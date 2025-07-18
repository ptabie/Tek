import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { socketClient } from '@/utils/socketClient';

interface SocketContextType {
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  emitTyping: (conversationId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socketClient.connect(user.id);
      socketClient.updatePresence(true);

      // Update presence periodically
      const interval = setInterval(() => {
        socketClient.updatePresence(true);
      }, 30000);

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        socketClient.updatePresence(!document.hidden);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        socketClient.updatePresence(false);
        socketClient.disconnect();
      };
    }
  }, [user]);

  const joinConversation = (conversationId: string) => {
    socketClient.joinConversation(conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    socketClient.leaveConversation(conversationId);
  };

  const emitTyping = (conversationId: string, isTyping: boolean) => {
    socketClient.emitTyping(conversationId, isTyping);
  };

  const value = {
    isConnected: !!user,
    joinConversation,
    leaveConversation,
    emitTyping,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};