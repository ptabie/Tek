import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, Info, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ConversationList } from './ConversationList';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { NewChatModal } from './NewChatModal';
import { useMessages, useMarkAsRead, type Message } from '@/hooks/useMessages';
import { useConversations, type Conversation } from '@/hooks/useConversations';
import { useUserPresence, usePresence } from '@/hooks/usePresence';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const MessagingInterface: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  usePresence(); // Initialize presence tracking
  
  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(selectedConversation?.id || '');
  const markAsRead = useMarkAsRead();

  // Get participant user IDs for presence tracking
  const participantIds = selectedConversation?.participants.map(p => p.user_id) || [];
  const { data: presenceData = [] } = useUserPresence(participantIds);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender_id !== user?.id) {
        markAsRead.mutate({ messageId: lastMessage.id });
      }
    }
  }, [selectedConversation, messages, user?.id]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setReplyTo(null);
  };

  const handleNewConversationCreated = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
    }
  };

  const getConversationTitle = () => {
    if (!selectedConversation) return '';
    
    if (selectedConversation.type === 'group') {
      return selectedConversation.name || 'Unnamed Group';
    }
    
    const otherParticipant = selectedConversation.participants.find(p => p.user_id !== user?.id);
    return otherParticipant?.user.display_name || otherParticipant?.user.username || 'Unknown User';
  };

  const getConversationSubtitle = () => {
    if (!selectedConversation) return '';
    
    if (selectedConversation.type === 'group') {
      return `${selectedConversation.participants.length} members`;
    }
    
    const otherParticipant = selectedConversation.participants.find(p => p.user_id !== user?.id);
    if (!otherParticipant) return '';
    
    const presence = presenceData.find(p => p.user_id === otherParticipant.user_id);
    if (presence?.is_online) {
      return 'Online';
    } else if (presence?.last_seen) {
      const lastSeen = new Date(presence.last_seen);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    
    return 'Offline';
  };

  const getHeaderAvatar = () => {
    if (!selectedConversation) return null;
    
    if (selectedConversation.type === 'group') {
      return (
        <Avatar className="w-10 h-10">
          <AvatarImage src={selectedConversation.avatar_url} />
          <AvatarFallback>
            <Users size={20} />
          </AvatarFallback>
        </Avatar>
      );
    }
    
    const otherParticipant = selectedConversation.participants.find(p => p.user_id !== user?.id);
    const isOnline = presenceData.find(p => p.user_id === otherParticipant?.user_id)?.is_online;
    
    return (
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherParticipant?.user.avatar_url} />
          <AvatarFallback>
            {(otherParticipant?.user.display_name || otherParticipant?.user.username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>
    );
  };

  // Mobile view: show conversation list or chat
  if (isMobileView) {
    return (
      <div className="h-full flex flex-col bg-background">
        {!selectedConversation ? (
          <ConversationList
            selectedConversationId={selectedConversation?.id}
            onConversationSelect={handleConversationSelect}
            onNewChat={() => setShowNewChatModal(true)}
            onNewGroup={() => setShowNewChatModal(true)}
          />
        ) : (
          <>
            {/* Mobile Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
              
              {getHeaderAvatar()}
              
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground truncate">
                  {getConversationTitle()}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {getConversationSubtitle()}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="p-2">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Info size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === user?.id}
                  showAvatar={selectedConversation.type === 'group'}
                  onReply={setReplyTo}
                />
              ))}
              <TypingIndicator conversationId={selectedConversation.id} />
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput
              conversationId={selectedConversation.id}
              replyTo={replyTo || undefined}
              onClearReply={() => setReplyTo(null)}
            />
          </>
        )}

        <NewChatModal
          open={showNewChatModal}
          onOpenChange={setShowNewChatModal}
          onConversationCreated={handleNewConversationCreated}
        />
      </div>
    );
  }

  // Desktop view: side-by-side layout
  return (
    <div className="h-full flex bg-background">
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex-shrink-0">
        <ConversationList
          selectedConversationId={selectedConversation?.id}
          onConversationSelect={handleConversationSelect}
          onNewChat={() => setShowNewChatModal(true)}
          onNewGroup={() => setShowNewChatModal(true)}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
              {getHeaderAvatar()}
              
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground">
                  {getConversationTitle()}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {getConversationSubtitle()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === user?.id}
                  showAvatar={selectedConversation.type === 'group'}
                  onReply={setReplyTo}
                />
              ))}
              <TypingIndicator conversationId={selectedConversation.id} />
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput
              conversationId={selectedConversation.id}
              replyTo={replyTo || undefined}
              onClearReply={() => setReplyTo(null)}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Select a conversation
              </h3>
              <p className="text-muted-foreground mb-4">
                Choose a conversation from the sidebar to start messaging
              </p>
              <Button onClick={() => setShowNewChatModal(true)}>
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      <NewChatModal
        open={showNewChatModal}
        onOpenChange={setShowNewChatModal}
        onConversationCreated={handleNewConversationCreated}
      />
    </div>
  );
};