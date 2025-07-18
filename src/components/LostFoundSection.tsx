
import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Clock, User, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const LostFoundSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const items: LostFoundItem[] = [
    {
      id: '1',
      type: 'lost',
      title: 'Blue iPhone 13',
      description: 'Lost my blue iPhone 13 with a clear case. Has a small crack on the screen.',
      location: 'Library - 2nd Floor',
      date: '2 hours ago',
      contact: {
        email: 'john.doe@university.edu',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567'
      },
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      ],
      user: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100'
      },
      category: 'Electronics',
      reward: '$50'
    },
    {
      id: '4',
      type: 'lost',
      title: 'Red Backpack',
      description: 'Lost my red Jansport backpack with my laptop and textbooks inside. Very important!',
      location: 'Student Union - Food Court',
      date: '4 hours ago',
      contact: {
        email: 'anna.davis@university.edu',
        phone: '+1 (555) 234-5678'
      },
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      ],
      user: {
        name: 'Anna Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
      },
      category: 'Personal Items',
      reward: '$75'
    },
    {
      id: '5',
      type: 'found',
      title: 'Gold Watch',
      description: 'Found a gold watch in the gym locker room. Looks expensive, please contact to claim.',
      location: 'Recreation Center - Locker Room',
      date: '6 hours ago',
      contact: {
        email: 'carlos.martinez@university.edu',
        whatsapp: '+1 (555) 345-6789'
      },
      images: [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
      ],
      user: {
        name: 'Carlos Martinez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      },
      category: 'Accessories'
    },
    {
      id: '6',
      type: 'lost',
      title: 'Prescription Glasses',
      description: 'Lost my prescription glasses with black frames. I really need them for classes.',
      location: 'Chemistry Building - Lab 204',
      date: '8 hours ago',
      contact: {
        email: 'peter.wong@university.edu',
        phone: '+1 (555) 456-7890',
        whatsapp: '+1 (555) 456-7890'
      },
      images: [
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400'
      ],
      user: {
        name: 'Peter Wong',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
      },
      category: 'Personal Items'
    },
    {
      id: '7',
      type: 'found',
      title: 'Set of Keys',
      description: 'Found a set of keys with a blue keychain near the parking lot. Multiple keys attached.',
      location: 'Parking Lot B - Near Entrance',
      date: '10 hours ago',
      contact: {
        email: 'maria.garcia@university.edu'
      },
      images: [
        'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400'
      ],
      user: {
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
      },
      category: 'Personal Items'
    },
    {
      id: '8',
      type: 'lost',
      title: 'Blue Water Bottle',
      description: 'Lost my blue Hydro Flask water bottle. Has stickers from various clubs on it.',
      location: 'Library - 3rd Floor Study Area',
      date: '12 hours ago',
      contact: {
        email: 'kevin.lee@university.edu',
        whatsapp: '+1 (555) 567-8901'
      },
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'
      ],
      user: {
        name: 'Kevin Lee',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      category: 'Personal Items'
    },
    {
      id: '9',
      type: 'found',
      title: 'Textbook - Biology 101',
      description: 'Found a Biology 101 textbook in the cafeteria. Has someone\'s name written inside.',
      location: 'Main Cafeteria - Table 15',
      date: '1 day ago',
      contact: {
        email: 'jessica.brown@university.edu',
        phone: '+1 (555) 678-9012'
      },
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
      ],
      user: {
        name: 'Jessica Brown',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100'
      },
      category: 'Books'
    },
    {
      id: '10',
      type: 'lost',
      title: 'AirPods Pro',
      description: 'Lost my AirPods Pro in the white case. Last seen in the student lounge area.',
      location: 'Student Lounge - Building C',
      date: '1 day ago',
      contact: {
        email: 'ryan.taylor@university.edu',
        phone: '+1 (555) 789-0123',
        whatsapp: '+1 (555) 789-0123'
      },
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'
      ],
      user: {
        name: 'Ryan Taylor',
        avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100'
      },
      category: 'Electronics',
      reward: '$25'
    },
    {
      id: '2',
      type: 'found',
      title: 'Black Wallet',
      description: 'Found a black leather wallet near the cafeteria. Contains student ID.',
      location: 'Main Cafeteria',
      date: '5 hours ago',
      contact: {
        email: 'jane.smith@university.edu',
        whatsapp: '+1 (555) 987-6543'
      },
      images: [
        'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400'
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
      description: 'Missing my MacBook Pro with university stickers on it.',
      location: 'Computer Science Building',
      date: '1 day ago',
      contact: {
        email: 'mike.wilson@university.edu',
        phone: '+1 (555) 456-7890'
      },
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400'
      ],
      user: {
        name: 'Mike Wilson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      category: 'Electronics',
      reward: '$100'
    }
  ];

  // Filter items by tab and search query
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    // Limit to 5 images total
    const totalImages = selectedImages.length + validFiles.length;
    if (totalImages > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      });
      return;
    }

    // Add new files to selected images
    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Here you would typically upload the images and create the item
    toast({
      title: "Item posted!",
      description: "Your item has been posted successfully.",
    });
    
    // Reset form
    setShowForm(false);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lost & Found</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Post Item</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['all', 'lost', 'found'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
          {filteredItems.length === 0 && (
            <span className="block mt-1 text-gray-500">
              Try searching with different keywords or check the spelling
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 && !searchQuery ? (
          <div className="col-span-full text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              Be the first to post a {activeTab === 'all' ? 'lost or found' : activeTab} item!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post Item
            </button>
          </div>
        ) : (
        filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
            onClick={() => navigate(`/item/${item.id}`)}
          >
            {/* Image with overlay for multiple images */}
            <div className="relative">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              {item.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                  +{item.images.length - 1} more
                </div>
              )}
              {item.reward && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Reward: {item.reward}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {item.type.toUpperCase()}
                </span>
                <span className="text-gray-500 text-xs flex items-center">
                  <Clock size={12} className="mr-1" />
                  {item.date}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={14} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User size={14} className="mr-2 flex-shrink-0" />
                  <span className="truncate">Posted by {item.user.name}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">{item.user.name}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/item/${item.id}`);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>

      {/* Enhanced Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6">Post Lost/Found Item</h3>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="lost">Lost Item</option>
                  <option value="found">Found Item</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Blue iPhone 13"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="personal">Personal Items</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Detailed description of the item..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Where was it lost/found?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., $50"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <div className="text-gray-500">
                    <p className="text-sm font-medium">Click to upload photos</p>
                    <p className="text-xs mt-1">PNG, JPG up to 10MB each (max 5 photos)</p>
                  </div>
                </label>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@university.edu"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Post Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundSection;
