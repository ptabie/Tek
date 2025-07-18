import React, { useState } from 'react';
import { Plus, Search, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  images: string[];
  likes: number;
  messages: number;
  posted: string;
  location: string;
  views: number;
}

const MarketplaceSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const allItems: MarketItem[] = [
    {
      id: '1',
      title: 'MacBook Pro 2020',
      price: 800,
      description: 'Excellent condition MacBook Pro 13-inch from 2020. Barely used, perfect for students.',
      category: 'electronics',
      condition: 'Like New',
      seller: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        rating: 4.8,
        verified: true
      },
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
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
      description: 'Stewart Calculus 8th Edition. Great condition with minimal highlighting.',
      category: 'books',
      condition: 'Good',
      seller: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 4.9,
        verified: true
      },
      images: ['https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400'],
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
      description: 'Perfect for dorm room. Clean and working perfectly. Dimensions: 18\"W x 20\"D x 24\"H',
      category: 'furniture',
      condition: 'Good',
      seller: {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100',
        rating: 4.7,
        verified: false
      },
      images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400'],
      likes: 15,
      messages: 8,
      posted: '3 hours ago',
      location: 'Dorm Building C',
      views: 67
    },
    {
      id: '4',
      title: 'Gaming Chair',
      price: 150,
      description: 'Ergonomic gaming chair with lumbar support. Perfect for long study sessions.',
      category: 'furniture',
      condition: 'Like New',
      seller: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        rating: 4.6,
        verified: true
      },
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
      likes: 20,
      messages: 12,
      posted: '4 hours ago',
      location: 'Engineering Building',
      views: 89
    },
    {
      id: '5',
      title: 'iPhone 12',
      price: 450,
      description: 'iPhone 12 in excellent condition. No cracks, works perfectly. Includes case and charger.',
      category: 'electronics',
      condition: 'Good',
      seller: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        rating: 4.9,
        verified: true
      },
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      likes: 25,
      messages: 18,
      posted: '6 hours ago',
      location: 'Student Center',
      views: 134
    }
  ];

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'books', label: 'Textbooks' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'other', label: 'Other' }
  ];

  const filteredItems = allItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Student Marketplace</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Sell Item</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <span className="text-2xl font-bold text-green-600">${item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {item.condition}
                </span>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{item.views} views</span>
                  <span>•</span>
                  <span>{item.posted}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={item.seller.avatar}
                    alt={item.seller.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">{item.seller.name}</span>
                    {item.seller.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart size={16} />
                    <span className="text-sm">{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span className="text-sm">{item.messages}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Message Seller
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">List an Item</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForm(false);
                    navigate('/product/preview');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  List Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceSection;
