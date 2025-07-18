import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import MobileNavigation from '../components/MobileNavigation';
import HomeSection from '../components/HomeSection';
import LostFoundSection from '../components/LostFoundSection';
import CampusMap from '../components/CampusMap';
import ResourcesSection from '../components/ResourcesSection';
import MarketplaceSection from '../components/MarketplaceSection';
import UserProfile from '../components/UserProfile';
import Message  from '../components/Message';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StudentHub
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium">
                  Connect, Share, and Discover
                </p>
                <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto lg:mx-0">
                  Join thousands of students who are already connecting, sharing resources, and discovering opportunities on campus.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => navigate('/auth')} 
                  size="lg" 
                  className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/learn-more')}
                  className="px-8 py-3 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free to use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Student verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Secure platform</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-100 to-blue-100 rounded-3xl transform -rotate-3"></div>
              
              {/* Main image container */}
              <div className="relative bg-white rounded-3xl p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop&auto=format"
                  alt="Students collaborating with technology"
                  className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-xl shadow-lg transform rotate-12">
                  <div className="text-sm font-semibold">📚 Study Groups</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-xl shadow-lg transform -rotate-12">
                  <div className="text-sm font-semibold">🎯 Find Resources</div>
                </div>
                <div className="absolute top-1/2 -right-6 bg-green-500 text-white p-2 rounded-lg shadow-lg">
                  <div className="text-xs font-semibold">💬 Connect</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'lost-found':
        return <LostFoundSection />;
      case 'map':
        return <CampusMap />;
      case 'resources':
        return <ResourcesSection />;
      case 'marketplace':
        return <MarketplaceSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <UserProfile />
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;
