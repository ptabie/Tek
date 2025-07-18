import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  avatar_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  participants: ConversationParticipant[];
  last_message?: {
    content: string;
    sender_name: string;
    created_at: string;
  };
  unread_count: number;
}

export interface ConversationParticipant {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  last_read_at: string;
  is_muted: boolean;
  user: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export const useConversations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants (
            *,
            user:profiles!user_id (
              id,
              username,
              display_name,
              avatar_url
            )
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get last message and unread count for each conversation
      const conversationsWithDetails = await Promise.all(
        data.map(async (conv) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              content,
              created_at,
              sender:profiles!sender_id (
                display_name,
                username
              )
            `)
            .eq('conversation_id', conv.id)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const userParticipant = conv.participants.find((p: any) => p.user_id === user.id);
          const lastReadAt = userParticipant?.last_read_at || '1970-01-01';

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .gt('created_at', lastReadAt)
            .neq('sender_id', user.id)
            .is('deleted_at', null);

          return {
            ...conv,
            last_message: lastMessage ? {
              content: lastMessage.content,
              sender_name: lastMessage.sender?.display_name || lastMessage.sender?.username || 'Unknown',
              created_at: lastMessage.created_at,
            } : undefined,
            unread_count: unreadCount || 0,
          };
        })
      );

      return conversationsWithDetails as Conversation[];
    },
    enabled: !!user,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_participants',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
};

export const useCreateDirectConversation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ otherUserId }: { otherUserId: string }) => {
      const { data, error } = await supabase.rpc('create_direct_conversation', {
        other_user_id: otherUserId,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating conversation",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateGroupConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      participantIds,
    }: {
      name: string;
      description?: string;
      participantIds: string[];
    }) => {
      if (!user) throw new Error('Must be logged in');

      // Create the group conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'group',
          name,
          description,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add creator as admin
      const participants = [
        { conversation_id: conversation.id, user_id: user.id, role: 'admin' },
        ...participantIds.map(id => ({
          conversation_id: conversation.id,
          user_id: id,
          role: 'member' as const,
        })),
      ];

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: "Group created!",
        description: "Your group conversation has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddParticipant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'member',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: "Participant added!",
        description: "User has been added to the conversation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding participant",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};