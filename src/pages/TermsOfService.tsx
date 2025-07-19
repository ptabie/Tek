import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Users,
      title: "Acceptable Use",
      content: [
        "Be respectful to other students and community members",
        "Don't share inappropriate, harmful, or illegal content",
        "Respect intellectual property and copyright laws",
        "Don't spam, harass, or bully other users",
        "Use the platform for educational and social purposes"
      ]
    },
    {
      icon: Shield,
      title: "Account Responsibilities",
      content: [
        "Keep your login credentials secure",
        "Provide accurate information when registering",
        "You're responsible for all activity on your account",
        "Report suspicious activity immediately",
        "Don't share your account with others"
      ]
    },
    {
      icon: FileText,
      title: "Content Guidelines",
      content: [
        "You own the content you post",
        "Don't post copyrighted material without permission",
        "We may remove content that violates our policies",
        "Backup important content - we're not responsible for data loss",
        "Content must comply with university policies"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Creating fake accounts or impersonating others",
        "Attempting to hack or disrupt the service",
        "Selling or transferring your account",
        "Using automated tools without permission",
        "Violating any applicable laws or regulations"
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
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="text-blue-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to TekPulse! These terms govern your use of our platform. By using TekPulse, 
            you agree to these terms. Please read them carefully.
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

        {/* Service Availability */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="text-green-600" size={20} />
              </div>
              <span>Service Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What We Provide</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Social networking for students</li>
                  <li>• Messaging and communication tools</li>
                  <li>• Campus resources and information</li>
                  <li>• Lost & found functionality</li>
                  <li>• Student marketplace</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Service Limitations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Service may be temporarily unavailable</li>
                  <li>• We may modify features over time</li>
                  <li>• Storage limits may apply</li>
                  <li>• Some features require verification</li>
                  <li>• Available to verified students only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
            <CardDescription>
              Information about account suspension and termination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">We may suspend or terminate accounts for:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Violation of these terms</li>
                  <li>• Harmful or illegal activity</li>
                  <li>• Spam or abuse of the platform</li>
                  <li>• Impersonation or fake accounts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">You can delete your account anytime:</h4>
                <p className="text-sm text-gray-600">
                  Go to Settings → Account Management → Delete Account. 
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Questions About These Terms?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about these terms of service, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/contact-support')}>
                Contact Legal Team
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
            These terms may be updated from time to time. Continued use of TekPulse constitutes acceptance of any changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;