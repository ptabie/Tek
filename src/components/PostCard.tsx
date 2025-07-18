
import React from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  user: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  avatar: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();

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
            {post.content}
          </p>
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
