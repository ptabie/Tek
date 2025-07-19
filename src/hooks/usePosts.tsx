import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  created_at: string;
  media?: PostMedia[];
  hashtags?: PostHashtag[];
  profiles: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface PostMedia {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  file_name?: string;
}

export interface PostHashtag {
  id: string;
  hashtag: {
    id: string;
    tag: string;
    usage_count: number;
  };
}

export interface Hashtag {
  id: string;
  tag: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            id,
            username,
            display_name,
            avatar_url
          ),
          media:post_media (*),
          hashtags:post_hashtags (
            id,
            hashtag:hashtags (
              id,
              tag,
              usage_count
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });
};

export const usePostsByHashtag = (hashtag: string) => {
  return useQuery({
    queryKey: ['posts', 'hashtag', hashtag],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            id,
            username,
            display_name,
            avatar_url
          ),
          media:post_media (*),
          hashtags:post_hashtags (
            id,
            hashtag:hashtags (
              id,
              tag,
              usage_count
            )
          )
        `)
        .eq('hashtags.hashtag.tag', hashtag.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
    enabled: !!hashtag,
  });
};

export const useTrendingHashtags = () => {
  return useQuery({
    queryKey: ['hashtags', 'trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hashtags')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Hashtag[];
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ content, mediaFiles }: { content: string; mediaFiles?: File[] }) => {
      if (!user) throw new Error('Must be logged in to create posts');

      // Create the post first
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Upload media files if any
      if (mediaFiles && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          const mediaType = file.type.startsWith('image/') ? 'image' : 'video';

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('post-media')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('post-media')
            .getPublicUrl(fileName);

          // Save media record
          await supabase
            .from('post_media')
            .insert({
              post_id: data.id,
              media_url: publicUrl,
              media_type: mediaType,
              file_name: file.name,
              file_size: file.size,
            });
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hashtags'] });
      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};