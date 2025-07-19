
import React from 'react';
import { Heart, MessageCircle, Share, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PostMedia } from '@/hooks/usePosts';

interface Post {
  id: string;
  user: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  avatar: string;
  media?: PostMedia[];
  hashtags?: Array<{ hashtag: { tag: string } }>;
}

interface PostCardProps {
  post: Post;
  onHashtagClick?: (hashtag: string) => void;
}

const PostCard = ({ post, onHashtagClick }: PostCardProps) => {
  const navigate = useNavigate();

  const renderHashtagContent = (content: string) => {
    const hashtagPattern = /#[a-zA-Z0-9_]+/g;
    const parts = content.split(hashtagPattern);
    const hashtags = content.match(hashtagPattern) || [];

    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {hashtags[index] && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHashtagClick?.(hashtags[index].slice(1)); // Remove # symbol
            }}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {hashtags[index]}
          </button>
        )}
      </React.Fragment>
    ));
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    return (
      <div className="mt-3 rounded-lg overflow-hidden">
        {post.media.length === 1 ? (
          // Single media item
          <div className="relative">
            {post.media[0].media_type === 'image' ? (
              <img
                src={post.media[0].media_url}
                alt="Post media"
                className="w-full max-h-96 object-cover cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(post.media[0].media_url, '_blank');
                }}
              />
            ) : (
              <div className="relative">
                <video
                  src={post.media[0].media_url}
                  controls
                  className="w-full max-h-96 object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        ) : (
          // Multiple media items - grid layout
          <div className={`grid gap-1 ${
            post.media.length === 2 ? 'grid-cols-2' : 
            post.media.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.media.slice(0, 4).map((media, index) => (
              <div key={media.id} className="relative">
                {media.media_type === 'image' ? (
                  <img
                    src={media.media_url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(media.media_url, '_blank');
                    }}
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={media.media_url}
                      className="w-full h-32 object-cover"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="text-white" size={24} />
                    </div>
                  </div>
                )}
                {index === 3 && post.media.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-semibold">+{post.media.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <img
          src={post.avatar || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100"}
          alt={post.user}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/profile')}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
              {post.user}
            </h3>
            <span 
              className="text-gray-500 text-sm truncate cursor-pointer hover:underline"
              onClick={() => navigate('/profile')}
            >
              @{post.username}
            </span>
            <span className="text-gray-400 hidden sm:inline">·</span>
            <span className="text-gray-500 text-xs md:text-sm">{post.time}</span>
          </div>
          <p className="text-gray-800 mb-3 md:mb-4 text-sm md:text-base leading-relaxed">
            {renderHashtagContent(post.content)}
          </p>
          {renderMedia()}
          <div className="flex items-center space-x-4 md:space-x-6 text-gray-500">
            <button className="flex items-center space-x-1 hover:text-red-500 transition-colors p-1">
              <Heart size={16} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-base">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors p-1">
              <MessageCircle size={16} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-base">{post.comments}</span>
            </button>
            <button className="hover:text-green-500 transition-colors p-1">
              <Share size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
