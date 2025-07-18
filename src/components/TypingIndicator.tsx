import React from 'react';
import { useTypingIndicators } from '@/hooks/useTyping';
import { useAuth } from '@/contexts/AuthContext';

interface TypingIndicatorProps {
  conversationId: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { data: typingUsers = [] } = useTypingIndicators(conversationId);

  // Filter out current user
  const otherTypingUsers = typingUsers.filter(t => t.user_id !== user?.id);

  if (otherTypingUsers.length === 0) return null;

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      const user = otherTypingUsers[0];
      const name = user.user.display_name || user.user.username;
      return `${name} is typing...`;
    } else if (otherTypingUsers.length === 2) {
      const names = otherTypingUsers.map(u => u.user.display_name || u.user.username);
      return `${names[0]} and ${names[1]} are typing...`;
    } else {
      return `${otherTypingUsers.length} people are typing...`;
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span>{getTypingText()}</span>
      </div>
    </div>
  );
};