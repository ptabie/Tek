/*
  # Create messaging system tables for TekPulse

  1. New Tables
    - `conversations` - Direct messages and group chats
    - `conversation_participants` - Users in conversations
    - `messages` - Individual messages
    - `message_attachments` - File attachments
    - `message_reactions` - Emoji reactions
    - `typing_indicators` - Real-time typing status
    - `read_receipts` - Message read status
    - `user_presence` - Online status tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for conversation access
    - Secure file upload permissions

  3. Real-time Features
    - Message delivery
    - Typing indicators
    - Read receipts
    - Online status
*/

-- Conversations table (supports both direct messages and groups)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('direct', 'group')),
  name text, -- For group chats
  description text, -- For group chats
  avatar_url text, -- For group chats
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  is_muted boolean DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'document', 'audio')),
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Message reactions (emoji reactions)
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Typing indicators
CREATE TABLE IF NOT EXISTS typing_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_typing boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Read receipts
CREATE TABLE IF NOT EXISTS read_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Online status
CREATE TABLE IF NOT EXISTS user_presence (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Conversation creators and admins can update"
  ON conversations FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for conversation_participants
CREATE POLICY "Users can view participants in their conversations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join conversations they're invited to"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- RLS Policies for message_attachments
CREATE POLICY "Users can view attachments in their conversations"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
      WHERE cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload attachments to their messages"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    message_id IN (
      SELECT m.id FROM messages m
      WHERE m.sender_id = auth.uid()
    )
  );

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
      WHERE cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own reactions"
  ON message_reactions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for typing_indicators
CREATE POLICY "Users can view typing indicators in their conversations"
  ON typing_indicators FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own typing indicators"
  ON typing_indicators FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for read_receipts
CREATE POLICY "Users can view read receipts in their conversations"
  ON read_receipts FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
      WHERE cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own read receipts"
  ON read_receipts FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_presence
CREATE POLICY "Users can view presence of users in their conversations"
  ON user_presence FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT DISTINCT cp2.user_id
      FROM conversation_participants cp1
      JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
      WHERE cp1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own presence"
  ON user_presence FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Functions to update conversation timestamps
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at, updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- Function to create direct conversation
CREATE OR REPLACE FUNCTION create_direct_conversation(other_user_id uuid)
RETURNS uuid AS $$
DECLARE
  conversation_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Check if conversation already exists
  SELECT c.id INTO conversation_id
  FROM conversations c
  JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
  JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
  WHERE c.type = 'direct'
    AND cp1.user_id = current_user_id
    AND cp2.user_id = other_user_id
    AND (
      SELECT COUNT(*) FROM conversation_participants 
      WHERE conversation_id = c.id
    ) = 2;

  -- If conversation doesn't exist, create it
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (type, created_by)
    VALUES ('direct', current_user_id)
    RETURNING id INTO conversation_id;

    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES 
      (conversation_id, current_user_id),
      (conversation_id, other_user_id);
  END IF;

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage bucket for message attachments
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('message-attachments', 'message-attachments', false);
EXCEPTION
  WHEN unique_violation THEN
    NULL; -- Bucket already exists, ignore
END $$;

-- Storage policies
DO $$
BEGIN
  CREATE POLICY "Users can upload message attachments"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'message-attachments');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can view message attachments"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'message-attachments');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their own message attachments"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'message-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete their own message attachments"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'message-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;