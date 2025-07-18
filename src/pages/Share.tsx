import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Copy, 
  Share2, 
  Twitter, 
  Facebook, 
  MessageCircle,
  Mail,
  Link,
  QrCode
} from 'lucide-react';

const Share = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState('');
  
  // Get the URL to share from query params or default to profile
  const urlToShare = new URLSearchParams(location.search).get('url') || `${window.location.origin}/profile`;
  const title = new URLSearchParams(location.search).get('title') || 'Check out this profile on StudentHub';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link.",
        variant: "destructive",
      });
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: customMessage || title,
          url: urlToShare,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      toast({
        title: "Not supported",
        description: "Web Share API is not supported on this device.",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(customMessage || title);
    const url = encodeURIComponent(urlToShare);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(urlToShare);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${customMessage || title}\n\n${urlToShare}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(`${customMessage || title} ${urlToShare}`);
    window.open(`sms:?body=${text}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Share</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900 mb-2">{title}</p>
            <p className="text-blue-600 text-sm break-all">{urlToShare}</p>
          </div>
        </div>

        {/* Custom Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a message (optional)
          </label>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your own message..."
            className="min-h-[100px]"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex items-center space-x-2 p-4 h-auto"
          >
            <Copy size={20} />
            <span>Copy link</span>
          </Button>
          <Button
            onClick={shareViaWebShare}
            variant="outline"
            className="flex items-center space-x-2 p-4 h-auto"
          >
            <Share2 size={20} />
            <span>Share</span>
          </Button>
        </div>

        {/* Social Media Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Share to</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={shareToTwitter}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter size={20} className="text-white" />
              </div>
              <span className="font-medium text-gray-900">Twitter</span>
            </button>

            <button
              onClick={shareToFacebook}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook size={20} className="text-white" />
              </div>
              <span className="font-medium text-gray-900">Facebook</span>
            </button>

            <button
              onClick={shareViaSMS}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <span className="font-medium text-gray-900">Messages</span>
            </button>

            <button
              onClick={shareViaEmail}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <span className="font-medium text-gray-900">Email</span>
            </button>
          </div>
        </div>

        {/* Link Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Link</h3>
          <div className="flex items-center space-x-2">
            <Input
              value={urlToShare}
              readOnly
              className="flex-1 bg-white"
            />
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;