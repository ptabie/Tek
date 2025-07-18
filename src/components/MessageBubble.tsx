import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Reply, Smile, Download, Eye, Trash2, Edit3 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import EmojiPicker from 'emoji-picker-react';
import { useAddReaction, useRemoveReaction, type Message } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    online: boolean;
  };
  showAvatar?: boolean;
  onReply?: (message: Message) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  sender,
  showAvatar = false,
  onReply,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { user } = useAuth();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  const handleEmojiClick = (emojiData: any) => {
    const existingReaction = message.reactions?.find(
      r => r.emoji === emojiData.emoji && r.user_id === user?.id
    );

    if (existingReaction) {
      removeReaction.mutate({ messageId: message.id, emoji: emojiData.emoji });
    } else {
      addReaction.mutate({ messageId: message.id, emoji: emojiData.emoji });
    }
    setShowEmojiPicker(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = (attachment: any) => {
    const isImage = attachment.file_type.startsWith('image/');
    const isVideo = attachment.file_type.startsWith('video/');
    const isAudio = attachment.file_type.startsWith('audio/');

    if (isImage) {
      return (
        <div className="mt-2 relative group">
          <img
            src={attachment.file_url}
            alt={attachment.file_name}
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(attachment.file_url, '_blank')}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white hover:bg-black/70"
            onClick={() => window.open(attachment.file_url, '_blank')}
          >
            <Eye size={16} />
          </Button>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="mt-2">
          <video
            src={attachment.file_url}
            controls
            className="max-w-xs rounded-lg"
          />
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="mt-2">
          <audio src={attachment.file_url} controls className="max-w-xs" />
        </div>
      );
    }

    // Document/file attachment
    return (
      <div className="mt-2 p-3 bg-gray-100 rounded-lg max-w-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Download size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {attachment.file_name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(attachment.file_size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(attachment.file_url, '_blank')}
          >
            <Download size={16} />
          </Button>
        </div>
      </div>
    );
  };

  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, typeof message.reactions>);

  return (
    <div
      className={cn(
        'flex gap-3 group relative',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar_url} />
          <AvatarFallback>
            {message.sender.display_name?.charAt(0) || message.sender.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn('flex flex-col max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
        {/* Sender name for group chats */}
        {showAvatar && !isOwn && (
          <span className="text-xs text-muted-foreground mb-1">
            {message.sender.display_name || message.sender.username}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2 max-w-full break-words',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted rounded-bl-md'
          )}
        >
          {/* Reply indicator */}
          {message.reply_to && (
            <div className="mb-2 p-2 bg-black/10 rounded-lg text-xs opacity-70">
              Replying to a message
            </div>
          )}

          {/* Message content */}
          {message.content && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          {/* Attachments */}
          {message.attachments?.map((attachment) => (
            <div key={attachment.id}>
              {renderAttachment(attachment)}
            </div>
          ))}

          {/* Edit indicator */}
          {message.edited_at && (
            <span className="text-xs opacity-50 ml-2">(edited)</span>
          )}
        </div>

        {/* Reactions */}
        {groupedReactions && Object.keys(groupedReactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(groupedReactions).map(([emoji, reactions]) => (
              <button
                key={emoji}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors',
                  reactions.some(r => r.user_id === user?.id)
                    ? 'bg-primary/20 border-primary/30'
                    : 'bg-muted border-muted-foreground/20 hover:bg-muted/80'
                )}
                onClick={() => handleEmojiClick({ emoji })}
              >
                <span>{emoji}</span>
                <span>{reactions.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and read receipts */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
          {isOwn && message.read_receipts && message.read_receipts.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Read by {message.read_receipts.length}
            </span>
          )}
        </div>
      </div>

      {/* Message Actions */}
      {showActions && (
        <div
          className={cn(
            'absolute top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background border shadow-sm"
            onClick={() => onReply?.(message)}
          >
            <Reply size={14} />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-background border shadow-sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={14} />
            </Button>
            {showEmojiPicker && (
              <div className="absolute top-full mt-2 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
          {isOwn && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background border shadow-sm"
              >
                <Edit3 size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background border shadow-sm text-destructive hover:text-destructive"
              >
                <Trash2 size={14} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background border shadow-sm"
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};