import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Image, Smile, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import { cn } from '@/lib/utils';
import { useTyping } from '@/hooks/useTyping';
import { useSendMessage, type Message } from '@/hooks/useMessages';

interface MessageInputProps {
  conversationId: string;
  replyTo?: Message;
  onClearReply?: () => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  replyTo,
  onClearReply,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { startTyping, stopTyping } = useTyping(conversationId);
  const sendMessage = useSendMessage();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/*': ['.txt'],
    },
  });

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const messageType = attachments.length > 0 
      ? attachments[0].type.startsWith('image/') ? 'image'
      : attachments[0].type.startsWith('video/') ? 'video'
      : attachments[0].type.startsWith('audio/') ? 'audio'
      : 'document'
      : 'text';

    try {
      await sendMessage.mutateAsync({
        conversationId,
        content: message,
        messageType,
        replyTo: replyTo?.id,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      setMessage('');
      setAttachments([]);
      onClearReply?.();
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    return '📄';
  };

  return (
    <div className="border-t border-border bg-background">
      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Replying to {replyTo.sender.display_name || replyTo.sender.username}
                </p>
                <p className="text-sm text-foreground truncate max-w-xs">
                  {replyTo.content}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClearReply}>
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-muted rounded-lg p-2 max-w-xs"
              >
                <span className="text-lg">{getFileIcon(file)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-6 w-6 p-0"
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div
        {...getRootProps()}
        className={cn(
          'p-4 transition-colors',
          isDragActive && 'bg-primary/5 border-primary/20'
        )}
      >
        <input {...getInputProps()} />
        
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/20 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Paperclip size={32} className="text-primary mx-auto mb-2" />
              <p className="text-sm text-primary font-medium">Drop files here to attach</p>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <div className="flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onDrop(files);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 p-0"
            >
              <Paperclip size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="h-10 w-10 p-0"
            >
              <Image size={18} />
            </Button>
          </div>

          {/* Message input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="pr-12 min-h-[40px] resize-none"
              disabled={sendMessage.isPending}
            />
            
            {/* Emoji picker button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 p-0"
              >
                <Smile size={16} />
              </Button>
            </div>

            {/* Emoji picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && attachments.length === 0) || sendMessage.isPending}
            className="h-10 w-10 p-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};