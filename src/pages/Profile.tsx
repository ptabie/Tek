import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { usePosts } from '@/hooks/usePosts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/PostCard';
import CoverPhotoUpload from '@/components/CoverPhotoUpload';
import ProfileMenu from '@/components/ProfileMenu';
import { useUpdateProfile } from '@/hooks/useProfile';
import { 
  ArrowLeft, 
  Calendar, 
  Link as LinkIcon, 
  MapPin, 
  MoreHorizontal,
  Settings,
  Bell,
  Mail
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const updateProfile = useUpdateProfile();

  // Filter posts by current user
  const userPosts = posts.filter(post => post.profiles.id === user?.id);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0];
  const username = profile?.username || user?.email?.split('@')[0];
  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  const handleCoverUpdate = (url: string) => {
    updateProfile.mutate({ cover_url: url });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-sm text-gray-500">{userPosts.length} posts</p>
            </div>
            <ProfileMenu username={username} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Cover Photo */}
        <CoverPhotoUpload
          currentCoverUrl={profile?.cover_url}
          onCoverUpdate={handleCoverUpdate}
        />

        {/* Profile Info */}
        <div className="px-4 pb-4">
          {/* Profile Picture and Edit Button */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="relative">
              <img
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200"}
                alt={displayName}
                className="w-32 h-32 rounded-full border-4 border-white bg-white cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => navigate('/profile')}
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-300 hover:bg-gray-50"
              >
                <Bell size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-300 hover:bg-gray-50"
              >
                <Mail size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
                className="rounded-full border-gray-300 hover:bg-gray-50 px-4"
              >
                Edit profile
              </Button>
            </div>
          </div>

          {/* Name and Username */}
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-gray-500">@{username}</p>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-gray-900 mb-3 leading-relaxed">{profile.bio}</p>
          )}

          {/* Location, Website, Join Date */}
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-3">
            {profile?.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon size={16} />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Followers and Following */}
          <div className="flex space-x-6 text-sm">
            <button className="hover:underline">
              <span className="font-bold text-gray-900">{profile?.following_count || 0}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-gray-900">{profile?.followers_count || 0}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-transparent h-auto p-0 space-x-0">
              <TabsTrigger 
                value="posts" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none py-4 text-gray-500 data-[state=active]:text-gray-900 font-medium hover:bg-gray-50"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="replies" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none py-4 text-gray-500 data-[state=active]:text-gray-900 font-medium hover:bg-gray-50"
              >
                Replies
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none py-4 text-gray-500 data-[state=active]:text-gray-900 font-medium hover:bg-gray-50"
              >
                Media
              </TabsTrigger>
              <TabsTrigger 
                value="likes" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none py-4 text-gray-500 data-[state=active]:text-gray-900 font-medium hover:bg-gray-50"
              >
                Likes
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-0">
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading posts...</p>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-4">When you post something, it will show up here.</p>
                  <Button onClick={() => navigate('/')}>
                    Create your first post
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {userPosts.map((post) => (
                    <div key={post.id} className="hover:bg-gray-50 transition-colors">
                      <PostCard 
                        post={{
                          id: post.id,
                          user: post.profiles.display_name || post.profiles.username,
                          username: post.profiles.username,
                          time: new Date(post.created_at).toLocaleDateString(),
                          content: post.content,
                          likes: post.likes_count,
                          comments: post.replies_count,
                          avatar: post.profiles.avatar_url || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100'
                        }} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Replies Tab */}
            <TabsContent value="replies" className="mt-0">
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No replies yet</h3>
                <p className="text-gray-500">When you reply to posts, they will show up here.</p>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="mt-0">
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No media yet</h3>
                <p className="text-gray-500">Photos and videos you post will appear here.</p>
              </div>
            </TabsContent>

            {/* Likes Tab */}
            <TabsContent value="likes" className="mt-0">
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No likes yet</h3>
                <p className="text-gray-500">Posts you like will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;