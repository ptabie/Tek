import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TypingIndicator {
  user_id: string;
  is_typing: boolean;
  user: {
    username: string;
    display_name?: string;
  };
}

export const useTypingIndicators = (conversationId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['typing', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('typing_indicators')
        .select(`
          *,
          user:profiles!user_id (
            username,
            display_name
          )
        `)
        .eq('conversation_id', conversationId)
        .eq('is_typing', true);

      if (error) throw error;
      return data as TypingIndicator[];
    },
    enabled: !!conversationId,
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['typing', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return query;
};

export const useTyping = (conversationId: string) => {
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const setTyping = useMutation({
    mutationFn: async (isTyping: boolean) => {
      if (!user || !conversationId) return;

      const { error } = await supabase
        .from('typing_indicators')
        .upsert({
          conversation_id: conversationId,
          user_id: user.id,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
  });

  const startTyping = () => {
    setTyping.mutate(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setTyping.mutate(false);
    }, 3000);
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping.mutate(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (user && conversationId) {
        setTyping.mutate(false);
      }
    };
  }, [conversationId, user]);

  return { startTyping, stopTyping };
};