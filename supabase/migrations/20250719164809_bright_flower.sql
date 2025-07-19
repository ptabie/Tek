/*
  # Add media support and hashtag functionality

  1. New Tables
    - `hashtags` - Store hashtag information and usage counts
    - `post_hashtags` - Many-to-many relationship between posts and hashtags
    - `post_media` - Store media attachments for posts

  2. Updates
    - Add media support to posts
    - Add hashtag extraction and trending functionality

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_hashtags junction table
CREATE TABLE IF NOT EXISTS post_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  hashtag_id uuid REFERENCES hashtags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, hashtag_id)
);

-- Create post_media table for multiple media attachments
CREATE TABLE IF NOT EXISTS post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  file_name text,
  file_size bigint,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hashtags
CREATE POLICY "Hashtags are viewable by everyone"
  ON hashtags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can manage hashtags"
  ON hashtags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for post_hashtags
CREATE POLICY "Post hashtags are viewable by everyone"
  ON post_hashtags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage hashtags for their posts"
  ON post_hashtags FOR ALL
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM posts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    post_id IN (
      SELECT id FROM posts WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for post_media
CREATE POLICY "Post media is viewable by everyone"
  ON post_media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage media for their posts"
  ON post_media FOR ALL
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM posts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    post_id IN (
      SELECT id FROM posts WHERE user_id = auth.uid()
    )
  );

-- Function to extract and process hashtags
CREATE OR REPLACE FUNCTION process_hashtags(post_content text, post_id uuid)
RETURNS void AS $$
DECLARE
  hashtag_text text;
  hashtag_record hashtags%ROWTYPE;
  hashtag_pattern text := '#[a-zA-Z0-9_]+';
BEGIN
  -- Extract hashtags from content
  FOR hashtag_text IN
    SELECT DISTINCT lower(regexp_replace(match, '#', ''))
    FROM regexp_split_to_table(post_content, '\s+') AS match
    WHERE match ~ hashtag_pattern AND length(regexp_replace(match, '#', '')) > 0
  LOOP
    -- Insert or update hashtag
    INSERT INTO hashtags (tag, usage_count)
    VALUES (hashtag_text, 1)
    ON CONFLICT (tag) 
    DO UPDATE SET 
      usage_count = hashtags.usage_count + 1,
      updated_at = now()
    RETURNING * INTO hashtag_record;

    -- Link hashtag to post
    INSERT INTO post_hashtags (post_id, hashtag_id)
    VALUES (post_id, hashtag_record.id)
    ON CONFLICT (post_id, hashtag_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrease hashtag usage when post is deleted
CREATE OR REPLACE FUNCTION decrease_hashtag_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease usage count for hashtags associated with deleted post
  UPDATE hashtags 
  SET usage_count = usage_count - 1,
      updated_at = now()
  WHERE id IN (
    SELECT hashtag_id 
    FROM post_hashtags 
    WHERE post_id = OLD.id
  );

  -- Remove hashtags with zero usage
  DELETE FROM hashtags WHERE usage_count <= 0;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to process hashtags when post is created
CREATE OR REPLACE FUNCTION trigger_process_hashtags()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM process_hashtags(NEW.content, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_hashtags_trigger
  AFTER INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION trigger_process_hashtags();

-- Trigger to decrease hashtag usage when post is deleted
CREATE TRIGGER decrease_hashtag_usage_trigger
  BEFORE DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION decrease_hashtag_usage();

-- Storage bucket for post media
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('post-media', 'post-media', true);
EXCEPTION
  WHEN unique_violation THEN
    NULL; -- Bucket already exists, ignore
END $$;

-- Storage policies for post media
DO $$
BEGIN
  CREATE POLICY "Users can upload post media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'post-media');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

DO $$
BEGIN
  CREATE POLICY "Post media is publicly viewable"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'post-media');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their own post media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete their own post media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;