import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'document' | 'audio';
  reply_to?: string;
  edited_at?: string;
  deleted_at?: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  read_receipts?: ReadReceipt[];
}

export interface MessageAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  user_id: string;
  user: {
    username: string;
    display_name?: string;
  };
}

export interface ReadReceipt {
  id: string;
  user_id: string;
  read_at: string;
  user: {
    username: string;
    display_name?: string;
  };
}

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            username,
            display_name,
            avatar_url
          ),
          attachments:message_attachments (*),
          reactions:message_reactions (
            *,
            user:profiles!user_id (
              username,
              display_name
            )
          ),
          read_receipts (
            *,
            user:profiles!user_id (
              username,
              display_name
            )
          )
        `)
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      messageType = 'text',
      replyTo,
      attachments,
    }: {
      conversationId: string;
      content: string;
      messageType?: string;
      replyTo?: string;
      attachments?: File[];
    }) => {
      if (!user) throw new Error('Must be logged in to send messages');

      // Create the message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType,
          reply_to: replyTo,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Upload attachments if any
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('message-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('message-attachments')
            .getPublicUrl(fileName);

          await supabase
            .from('message_attachments')
            .insert({
              message_id: message.id,
              file_name: file.name,
              file_url: publicUrl,
              file_type: file.type,
              file_size: file.size,
            });
        }
      }

      return message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddReaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useRemoveReaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useMarkAsRead = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('read_receipts')
        .upsert({
          message_id: messageId,
          user_id: user.id,
        });

      if (error) throw error;
    },
  });
};