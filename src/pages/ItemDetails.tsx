import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Mail, MessageCircle, Phone, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  images: string[];
  user: {
    name: string;
    avatar: string;
  };
  category: string;
  reward?: string;
}

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - in real app, this would come from API/database
  const allItems: LostFoundItem[] = [
    {
      id: '1',
      type: 'lost',
      title: 'Blue iPhone 13',
      description: 'Lost my blue iPhone 13 with a clear case. Has a small crack on the screen. The phone has a blue case with my university ID card inside. It was last seen in the library on the 2nd floor near the study area. Very important as it contains all my class notes and photos. Please contact me if found.',
      location: 'Library - 2nd Floor, Study Area',
      date: '2 hours ago',
      contact: {
        email: 'john.doe@university.edu',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567'
      },
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600'
      ],
      user: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100'
      },
      category: 'Electronics',
      reward: '$50'
    },
    {
      id: '2',
      type: 'found',
      title: 'Black Wallet',
      description: 'Found a black leather wallet near the cafeteria. Contains student ID and some cash. The wallet appears to belong to a student as it has university cards inside. I found it on the bench outside the main cafeteria around lunch time. Please contact me with details to verify ownership.',
      location: 'Main Cafeteria',
      date: '5 hours ago',
      contact: {
        email: 'jane.smith@university.edu',
        whatsapp: '+1 (555) 987-6543'
      },
      images: [
        'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
      ],
      user: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      },
      category: 'Personal Items'
    },
    {
      id: '3',
      type: 'lost',
      title: 'Silver MacBook Pro',
      description: 'Missing my MacBook Pro with university stickers on it. It\'s a 13-inch MacBook Pro with several coding stickers and a university parking permit sticker. Last seen in the Computer Science building study room. Contains important project files and assignments. Offering reward for safe return.',
      location: 'Computer Science Building',
      date: '1 day ago',
      contact: {
        email: 'mike.wilson@university.edu',
        phone: '+1 (555) 456-7890'
      },
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'
      ],
      user: {
        name: 'Mike Wilson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      category: 'Electronics',
      reward: '$100'
    }
  ];

  // Find the specific item based on the ID from URL
  const item = allItems.find(item => item.id === id);

  // If item not found, show error
  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h1>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleContactEmail = () => {
    window.open(`mailto:${item.contact.email}?subject=Regarding ${item.type} item: ${item.title}`);
  };

  const handleContactWhatsApp = () => {
    if (item.contact.whatsapp) {
      const message = encodeURIComponent(`Hi! I saw your ${item.type} item post about "${item.title}". I'd like to help/discuss.`);
      window.open(`https://wa.me/${item.contact.whatsapp.replace(/\D/g, '')}?text=${message}`);
    }
  };

  const handleContactPhone = () => {
    if (item.contact.phone) {
      window.open(`tel:${item.contact.phone}`);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `${item.type.toUpperCase()}: ${item.title} - ${item.description.substring(0, 100)}...`;
    
    if (navigator.share) {
      navigator.share({
        title: `${item.type.toUpperCase()}: ${item.title}`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The item link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
                <p className="text-sm text-gray-500">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Item
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <Share size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                )}
              </div>
              
              {item.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {item.type.toUpperCase()}
                </span>
                {item.reward && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Reward: {item.reward}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{item.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{item.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Posted by</h3>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.user.name}</p>
                  <p className="text-sm text-gray-500">University Student</p>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleContactEmail}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Mail size={18} />
                  <span>Send Email</span>
                </Button>

                {item.contact.whatsapp && (
                  <Button
                    onClick={handleContactWhatsApp}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </Button>
                )}

                {item.contact.phone && (
                  <Button
                    onClick={handleContactPhone}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Phone size={18} />
                    <span>Call</span>
                  </Button>
                )}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {item.contact.email}
                </p>
                {item.contact.phone && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Phone:</strong> {item.contact.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Meet in public places</li>
                <li>• Verify item details before meeting</li>
                <li>• Trust your instincts</li>
                <li>• Report suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;