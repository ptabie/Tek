import React, { useState } from 'react';
import { Search, Users, MessageCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateDirectConversation, useCreateGroupConversation } from '@/hooks/useConversations';

interface User {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
}

interface NewChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  open,
  onOpenChange,
  onConversationCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [activeTab, setActiveTab] = useState('direct');
  
  const { user } = useAuth();
  const createDirectConversation = useCreateDirectConversation();
  const createGroupConversation = useCreateGroupConversation();

  // Search for users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .neq('id', user?.id) // Exclude current user
        .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      return data as User[];
    },
    enabled: searchQuery.length > 0,
  });

  const handleUserSelect = (selectedUser: User) => {
    if (activeTab === 'direct') {
      // Create direct conversation immediately
      createDirectConversation.mutate(
        { otherUserId: selectedUser.id },
        {
          onSuccess: (conversationId) => {
            onConversationCreated(conversationId);
            onOpenChange(false);
            resetForm();
          },
        }
      );
    } else {
      // Add to group selection
      if (!selectedUsers.find(u => u.id === selectedUser.id)) {
        setSelectedUsers(prev => [...prev, selectedUser]);
      }
    }
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    createGroupConversation.mutate(
      {
        name: groupName,
        description: groupDescription,
        participantIds: selectedUsers.map(u => u.id),
      },
      {
        onSuccess: (conversation) => {
          onConversationCreated(conversation.id);
          onOpenChange(false);
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setSearchQuery('');
    setSelectedUsers([]);
    setGroupName('');
    setGroupDescription('');
    setActiveTab('direct');
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
          <DialogDescription>
            Search for users to start chatting or create a group
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Direct Message
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users size={16} />
              Group Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search for users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* User Results */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    disabled={createDirectConversation.isPending}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{user.display_name || user.username}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </button>
                ))
              ) : searchQuery.length > 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Start typing to search for users
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="group" className="space-y-4">
            {/* Group Details */}
            <div className="space-y-3">
              <Input
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Input
                placeholder="Group description (optional)"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected members ({selectedUsers.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                      {user.display_name || user.username}
                      <button
                        onClick={() => removeSelectedUser(user.id)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search for users to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* User Results */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                users
                  .filter(u => !selectedUsers.find(su => su.id === u.id))
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {(user.display_name || user.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{user.display_name || user.username}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </button>
                  ))
              ) : searchQuery.length > 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No users found
                </div>
              ) : null}
            </div>

            {/* Create Group Button */}
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedUsers.length === 0 || createGroupConversation.isPending}
              className="w-full"
            >
              {createGroupConversation.isPending ? 'Creating...' : 'Create Group'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};