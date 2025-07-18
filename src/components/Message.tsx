
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, MoreHorizontal, Phone, Video, Info, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  attachments?: any[];
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: Participant[];
  lastMessage: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
}

interface ChatInterfaceProps {
  conversation: Conversation;
  onSendMessage: (text: string, attachments?: any[]) => void;
}

// Mock messages for demo
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing?',
    senderId: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished working on that new project we discussed.',
    senderId: 'current-user',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
  },
  {
    id: '3',
    text: 'That sounds amazing! Can\'t wait to see what you\'ve built 🚀',
    senderId: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
  },
  {
    id: '4',
    text: 'Are we still on for lunch tomorrow?',
    senderId: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation.id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      senderId: 'current-user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConversationTitle = () => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat';
    }
    return conversation.participants[0]?.name || 'Unknown';
  };

  const getConversationSubtitle = () => {
    if (conversation.type === 'group') {
      return `${conversation.participants.length} members`;
    }
    const participant = conversation.participants[0];
    if (participant?.online) {
      return 'Online';
    }
    return participant?.username || '';
  };

  const getHeaderAvatar = () => {
    if (conversation.type === 'group') {
      return (
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-primary" />
        </div>
      );
    }
    const participant = conversation.participants[0];
    return (
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarImage src={participant?.avatar} />
          <AvatarFallback>{participant?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        {participant?.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-background rounded-full" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getHeaderAvatar()}
          <div>
            <h2 className="font-semibold text-sm">{getConversationTitle()}</h2>
            <p className="text-xs text-muted-foreground">{getConversationSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Info className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === 'current-user'}
            sender={conversation.participants.find(p => p.id === msg.senderId)}
            showAvatar={conversation.type === 'group'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={`Message ${getConversationTitle()}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-20 py-3 resize-none min-h-[44px] bg-muted/50"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="p-1.5 h-auto">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 h-auto">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
