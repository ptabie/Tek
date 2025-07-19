import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Account information (name, email, username)",
        "Profile information (bio, avatar, location)",
        "Posts, messages, and interactions",
        "Device and usage information",
        "Location data (if enabled)"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Provide and improve our services",
        "Personalize your experience",
        "Send notifications and updates",
        "Ensure platform safety and security",
        "Comply with legal obligations"
      ]
    },
    {
      icon: Globe,
      title: "Information Sharing",
      content: [
        "We don't sell your personal information",
        "Public posts are visible to other users",
        "Anonymous analytics with third parties",
        "Legal compliance when required",
        "Service providers under strict agreements"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "End-to-end encryption for messages",
        "Secure data transmission (HTTPS)",
        "Regular security audits",
        "Access controls and monitoring",
        "Data backup and recovery"
      ]
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-blue-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">Your Privacy Matters</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            At TekPulse, we're committed to protecting your privacy and being transparent about how we collect, 
            use, and share your information. This policy explains our practices in plain language.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: January 15, 2024 • Effective date: January 15, 2024
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="text-blue-600" size={20} />
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Your Rights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="text-green-600" size={20} />
              </div>
              <span>Your Rights and Controls</span>
            </CardTitle>
            <CardDescription>
              You have control over your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Access and Control</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• View and download your data</li>
                  <li>• Update your information anytime</li>
                  <li>• Delete your account and data</li>
                  <li>• Control who sees your posts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Privacy Settings</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Make your account private</li>
                  <li>• Control message permissions</li>
                  <li>• Manage notification preferences</li>
                  <li>• Block unwanted users</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="text-purple-600" size={20} />
              </div>
              <span>Questions About Privacy?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about this privacy policy or how we handle your data, 
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/contact-support')}>
                Contact Privacy Team
              </Button>
              <Button variant="outline" onClick={() => navigate('/help')}>
                Visit Help Center
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This policy may be updated from time to time. We'll notify you of any significant changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;