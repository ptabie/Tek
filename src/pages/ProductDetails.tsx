import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Mail, MessageCircle, Phone, Share, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MarketItem {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  images: string[];
  likes: number;
  messages: number;
  posted: string;
  location: string;
  views: number;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - in real app, this would come from API/database
  const allItems: MarketItem[] = [
    {
      id: '1',
      title: 'MacBook Pro 2020',
      price: 800,
      description: 'Excellent condition MacBook Pro 13-inch from 2020. Barely used, perfect for students. Includes original charger, box, and documentation. No scratches or dents. Battery health is excellent at 95%. Perfect for coding, design work, and everyday tasks. Selling because I upgraded to a newer model.',
      category: 'electronics',
      condition: 'Like New',
      seller: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        rating: 4.8,
        verified: true
      },
      contact: {
        email: 'sarah.johnson@university.edu',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567'
      },
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'
      ],
      likes: 12,
      messages: 5,
      posted: '2 days ago',
      location: 'Campus - Dorm Building A',
      views: 45
    },
    {
      id: '2',
      title: 'Calculus Textbook',
      price: 45,
      description: 'Stewart Calculus 8th Edition in great condition. Minimal highlighting, no torn pages. Perfect for Calc I and II courses. All practice problems are unmarked. Includes access code for online resources (unused). Originally bought for $280, selling at a great price to help a fellow student.',
      category: 'books',
      condition: 'Good',
      seller: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 4.9,
        verified: true
      },
      contact: {
        email: 'mike.chen@university.edu',
        whatsapp: '+1 (555) 987-6543'
      },
      images: [
        'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'
      ],
      likes: 8,
      messages: 3,
      posted: '1 day ago',
      location: 'Library - Study Area',
      views: 23
    },
    {
      id: '3',
      title: 'Mini Fridge',
      price: 120,
      description: 'Perfect mini fridge for dorm room. Clean and working perfectly. Energy efficient and quiet operation. Dimensions: 18"W x 20"D x 24"H. Fits perfectly under most dorm desks. Great for keeping drinks, snacks, and leftovers fresh. Moving out, so need to sell quickly.',
      category: 'furniture',
      condition: 'Good',
      seller: {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100',
        rating: 4.7,
        verified: false
      },
      contact: {
        email: 'alex.rivera@university.edu',
        phone: '+1 (555) 456-7890'
      },
      images: [
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'
      ],
      likes: 15,
      messages: 8,
      posted: '3 hours ago',
      location: 'Dorm Building C - Room 205',
      views: 67
    }
  ];

  // Find the specific item based on the ID from URL
  const item = allItems.find(item => item.id === id);

  // If item not found, show error
  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleContactEmail = () => {
    window.open(`mailto:${item.contact.email}?subject=Interested in ${item.title}`);
  };

  const handleContactWhatsApp = () => {
    if (item.contact.whatsapp) {
      const message = encodeURIComponent(`Hi! I'm interested in your ${item.title} listed for $${item.price}. Is it still available?`);
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
    const shareText = `Check out this ${item.title} for $${item.price} on StudentHub!`;
    
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The product link has been copied to your clipboard.",
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Item removed from your favorites" : "Item added to your favorites",
    });
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
                  Listed by {item.seller.name}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <Heart size={20} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
              </Button>
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

            {/* Product Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {item.condition}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{item.views} views</span>
                  <span>{item.likes} likes</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">${item.price}</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{item.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">Posted {item.posted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info & Contact */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{item.seller.name}</p>
                    {item.seller.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{item.seller.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Seller</h3>
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
                <li>• Meet in public places on campus</li>
                <li>• Inspect item before payment</li>
                <li>• Use secure payment methods</li>
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

export default ProductDetails;