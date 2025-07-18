
import React, { useState } from 'react';
import PostCard from './PostCard';
import { Image, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts, useCreatePost } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const HomeSection = () => {
  const [postContent, setPostContent] = useState('');
  const { data: posts = [], isLoading } = usePosts();
  const createPost = useCreatePost();
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createPost.mutate(postContent);
    setPostContent('');
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex space-x-3">
          <img
            src={profile?.avatar_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100"}
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's happening on campus?"
              className="w-full border-none resize-none text-lg placeholder-gray-500 focus:ring-0 focus:outline-none"
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-4">
                <button 
                  type="button"
                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Image size={20} />
                  <span className="text-sm font-medium">Photo</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center space-x-2 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Smile size={20} />
                  <span className="text-sm font-medium">Emoji</span>
                </button>
              </div>
              <Button 
                type="submit" 
                disabled={!postContent.trim() || createPost.isPending}
              >
                {createPost.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
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
          ))
        )}
      </div>

      {posts.length > 0 && (
        <div className="text-center mt-8 py-4">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Load more posts
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeSection;
