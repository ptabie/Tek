import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus, Users, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useConversations, type Conversation } from '@/hooks/useConversations';
import { useUserPresence } from '@/hooks/usePresence';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onConversationSelect,
  onNewChat,
  onNewGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();

  // Get all participant user IDs for presence tracking
  const allUserIds = conversations.flatMap(conv => 
    conv.participants.map(p => p.user_id)
  );
  const { data: presenceData = [] } = useUserPresence(allUserIds);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // For group chats, search by name
    if (conv.type === 'group') {
      return conv.name?.toLowerCase().includes(query);
    }
    
    // For direct messages, search by participant name
    const otherParticipant = conv.participants.find(p => p.user_id !== user?.id);
    const participantName = otherParticipant?.user.display_name || otherParticipant?.user.username || '';
    return participantName.toLowerCase().includes(query);
  });

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Unnamed Group';
    }
    
    const otherParticipant = conversation.participants.find(p => p.user_id !== user?.id);
    return otherParticipant?.user.display_name || otherParticipant?.user.username || 'Unknown User';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.avatar_url;
    }
    
    const otherParticipant = conversation.participants.find(p => p.user_id !== user?.id);
    return otherParticipant?.user.avatar_url;
  };

  const isUserOnline = (userId: string) => {
    const presence = presenceData.find(p => p.user_id === userId);
    return presence?.is_online || false;
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.last_message) return 'No messages yet';
    
    const { content, sender_name } = conversation.last_message;
    const isFromCurrentUser = conversation.last_message.sender_name === (user?.email?.split('@')[0]);
    const prefix = isFromCurrentUser ? 'You: ' : `${sender_name}: `;
    
    return `${prefix}${content.length > 50 ? content.substring(0, 50) + '...' : content}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onNewChat}>
              <MessageCircle size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onNewGroup}>
              <Users size={16} />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No conversations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new conversation to connect with your classmates
            </p>
            <div className="flex gap-2">
              <Button onClick={onNewChat} size="sm">
                <MessageCircle size={16} className="mr-2" />
                New Chat
              </Button>
              <Button onClick={onNewGroup} variant="outline" size="sm">
                <Users size={16} className="mr-2" />
                New Group
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;
              const title = getConversationTitle(conversation);
              const avatarUrl = getConversationAvatar(conversation);
              const lastMessagePreview = getLastMessagePreview(conversation);
              
              // Check if other participant is online (for direct messages)
              const otherParticipant = conversation.participants.find(p => p.user_id !== user?.id);
              const isOnline = otherParticipant ? isUserOnline(otherParticipant.user_id) : false;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                  className={cn(
                    'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                    isSelected && 'bg-muted'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          {conversation.type === 'group' ? (
                            <Users size={20} />
                          ) : (
                            title.charAt(0).toUpperCase()
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.type === 'direct' && isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {title}
                        </h3>
                        {conversation.last_message && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessagePreview}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge variant="default" className="ml-2 min-w-[20px] h-5 text-xs">
                            {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Group participant count */}
                      {conversation.type === 'group' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversation.participants.length} members
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};