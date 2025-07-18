
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  if (!user) return null;

  const displayName = profile?.display_name || profile?.username || user.email?.split('@')[0];
  const username = profile?.username || user.email?.split('@')[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <img
            src={profile?.avatar_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100"}
            alt="Profile"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/profile')}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
              {displayName}
            </h3>
            <p 
              className="text-xs md:text-sm text-gray-500 truncate cursor-pointer hover:underline"
              onClick={() => navigate('/profile')}
            >
              @{username}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/settings')}
            className="hidden sm:flex"
          >
            <Settings size={14} className="mr-1" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/settings')}
            className="sm:hidden"
          >
            <Settings size={14} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="text-red-600 hover:text-red-700 hidden sm:flex"
          >
            <LogOut size={14} className="mr-1" />
            Logout
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="text-red-600 hover:text-red-700 sm:hidden"
          >
            <LogOut size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
