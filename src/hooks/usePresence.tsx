import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPresence {
  user_id: string;
  is_online: boolean;
  last_seen: string;
}

export const usePresence = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updatePresence = useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!user) return;

      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
  });

  // Set user as online when component mounts
  useEffect(() => {
    if (user) {
      updatePresence.mutate(true);

      // Set up interval to update presence every 30 seconds
      const interval = setInterval(() => {
        updatePresence.mutate(true);
      }, 30000);

      // Set user as offline when page is about to unload
      const handleBeforeUnload = () => {
        updatePresence.mutate(false);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        updatePresence.mutate(false);
      };
    }
  }, [user]);

  return { updatePresence };
};

export const useUserPresence = (userIds: string[]) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['presence', userIds],
    queryFn: async () => {
      if (userIds.length === 0) return [];

      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .in('user_id', userIds);

      if (error) throw error;
      return data as UserPresence[];
    },
    enabled: userIds.length > 0,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (userIds.length === 0) return;

    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['presence'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userIds, queryClient]);

  return query;
};