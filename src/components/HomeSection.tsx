import React, { useState } from 'react';
import PostCard from './PostCard';
import { Image, Smile, Video, X, Hash, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts, useCreatePost, usePostsByHashtag, useTrendingHashtags } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';

const HomeSection = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  
  const { data: posts = [], isLoading } = usePosts();
  const { data: hashtagPosts = [], isLoading: hashtagLoading } = usePostsByHashtag(selectedHashtag || '');
  const { data: trendingHashtags = [] } = useTrendingHashtags();
  const createPost = useCreatePost();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { toast } = useToast();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported media file`,
          variant: "destructive",
        });
        return false;
      }
      
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 50MB`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    // Limit to 4 media files total
    const totalFiles = mediaFiles.length + validFiles.length;
    if (totalFiles > 4) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 4 media files per post",
        variant: "destructive",
      });
      return;
    }

    setMediaFiles(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [mediaFiles.length, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg', '.mov']
    },
    multiple: true,
    noClick: true
  });

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && mediaFiles.length === 0) return;

    createPost.mutate({ content: postContent, mediaFiles });
    setPostContent('');
    setMediaFiles([]);
    setMediaPreviews([]);
  };

  const handleHashtagClick = (hashtag: string) => {
    setSelectedHashtag(hashtag);
  };

  const clearHashtagFilter = () => {
    setSelectedHashtag(null);
  };

  const currentPosts = selectedHashtag ? hashtagPosts : posts;
  const currentLoading = selectedHashtag ? hashtagLoading : isLoading;

  if (currentLoading) {
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
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Hashtag Filter Header */}
          {selectedHashtag && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="text-blue-600" size={20} />
                  <span className="text-blue-900 font-semibold">#{selectedHashtag}</span>
                  <span className="text-blue-700 text-sm">
                    ({currentPosts.length} post{currentPosts.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHashtagFilter}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  <X size={16} className="mr-1" />
                  Clear Filter
                </Button>
              </div>
            </div>
          )}

          {/* Post Creation Form */}
          {!selectedHashtag && (
            <div {...getRootProps()} className="relative">
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <input {...getInputProps()} />
                
                {isDragActive && (
                  <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Image size={32} className="text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-700 font-medium">Drop media files here</p>
                    </div>
                  </div>
                )}

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
            
            {/* Media Previews */}
            {mediaPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    {mediaFiles[index]?.type.startsWith('image/') ? (
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={preview}
                        className="w-full h-32 object-cover rounded-lg"
                        muted
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-4">
                <button 
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Image size={20} />
                  <span className="text-sm font-medium">Photo</span>
                </button>
                <button 
                  type="button"
                  onClick={() => document.getElementById('video-upload')?.click()}
                  className="flex items-center space-x-2 text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Video size={20} />
                  <span className="text-sm font-medium">Video</span>
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
                disabled={(!postContent.trim() && mediaFiles.length === 0) || createPost.isPending}
              >
                {createPost.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
            
            {/* Hidden file inputs */}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onDrop(files);
              }}
            />
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onDrop(files);
              }}
            />
          </div>
        </div>
      </form>
            </div>
          )}

          {/* Posts Feed */}
      <div className="space-y-4">
            {currentPosts.length === 0 ? (
          <div className="text-center py-8">
              <p className="text-gray-500">
                {selectedHashtag 
                  ? `No posts found with #${selectedHashtag}` 
                  : 'No posts yet. Be the first to share something!'
                }
              </p>
          </div>
        ) : (
              currentPosts.map((post) => (
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
                avatar: post.profiles.avatar_url || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100',
                media: post.media,
                hashtags: post.hashtags
              }} 
              onHashtagClick={handleHashtagClick}
            />
          ))
        )}
      </div>

          {currentPosts.length > 0 && (
        <div className="text-center mt-8 py-4">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Load more posts
          </button>
        </div>
      )}
        </div>

        {/* Trending Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-orange-500" size={20} />
              <h3 className="font-semibold text-gray-900">Trending Hashtags</h3>
            </div>
            
            {trendingHashtags.length === 0 ? (
              <p className="text-gray-500 text-sm">No trending hashtags yet</p>
            ) : (
              <div className="space-y-3">
                {trendingHashtags.map((hashtag, index) => (
                  <button
                    key={hashtag.id}
                    onClick={() => handleHashtagClick(hashtag.tag)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedHashtag === hashtag.tag ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                          <span className="font-medium text-blue-600">#{hashtag.tag}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {hashtag.usage_count} post{hashtag.usage_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Hash className="text-gray-400" size={16} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;