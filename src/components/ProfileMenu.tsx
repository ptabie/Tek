import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Share, FileText, Copy, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProfileMenuProps {
  username: string;
}

const ProfileMenu = ({ username }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile`;
    navigate(`/share?url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(`${username}'s Profile on StudentHub`)}`);
    setIsOpen(false);
  };

  const handleDrafts = () => {
    navigate('/drafts');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 hover:bg-gray-100"
      >
        <MoreHorizontal size={20} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={handleShare}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
          >
            <Share size={18} />
            <span>Share profile</span>
          </button>
          <button
            onClick={handleDrafts}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
          >
            <FileText size={18} />
            <span>Drafts</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;