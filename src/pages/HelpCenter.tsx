import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Book, MessageCircle, Shield, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HelpCenter = () => {
  const navigate = useNavigate();

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using TekPulse",
      icon: Book,
      articles: [
        "How to create your first post",
        "Setting up your profile",
        "Finding and following other students",
        "Using the campus map feature"
      ]
    },
    {
      title: "Messaging & Communication",
      description: "Everything about chatting and messaging",
      icon: MessageCircle,
      articles: [
        "Sending direct messages",
        "Creating group chats",
        "Sharing files and media",
        "Using emoji reactions"
      ]
    },
    {
      title: "Privacy & Security",
      description: "Keep your account safe and secure",
      icon: Shield,
      articles: [
        "Managing your privacy settings",
        "Blocking and reporting users",
        "Two-factor authentication",
        "Data protection and GDPR"
      ]
    },
    {
      title: "Account Settings",
      description: "Customize your TekPulse experience",
      icon: SettingsIcon,
      articles: [
        "Changing your password",
        "Notification preferences",
        "Deactivating your account",
        "Downloading your data"
      ]
    }
  ];

  const popularArticles = [
    "How to reset your password",
    "Why can't I see some posts?",
    "How to report inappropriate content",
    "Setting up notifications",
    "Using hashtags effectively"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Settings</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h2>
          <p className="text-gray-600 mb-6">Search our knowledge base or browse categories below</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search for help articles..."
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Articles</h3>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {popularArticles.map((article, index) => (
              <button
                key={index}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/help/article/${index + 1}`)}
              >
                <span className="text-blue-600 hover:text-blue-800">{article}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-blue-600" size={20} />
                      </div>
                      <span>{category.title}</span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <button
                            onClick={() => navigate(`/help/article/${index * 10 + articleIndex + 1}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                          >
                            {article}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Still need help?</h3>
          <p className="text-blue-700 mb-4">Can't find what you're looking for? Our support team is here to help.</p>
          <Button onClick={() => navigate('/contact-support')} className="bg-blue-600 hover:bg-blue-700">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;