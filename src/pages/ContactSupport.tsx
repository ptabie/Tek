import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ContactSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: '',
    message: '',
    email: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Support ticket created!",
      description: "We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      subject: '',
      category: '',
      priority: '',
      message: '',
      email: '',
      name: ''
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@tekpulse.edu",
      responseTime: "Within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+1 (555) 123-HELP",
      responseTime: "Mon-Fri, 9AM-5PM"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Available in app",
      responseTime: "Mon-Fri, 9AM-5PM"
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
              onClick={() => navigate('/help')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Help Center</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Contact Support</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{method.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                          <p className="text-sm font-medium text-blue-600">{method.contact}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{method.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* FAQ Link */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Quick Answers</h3>
                    <p className="text-sm text-gray-600">Check our FAQ for instant solutions</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-green-600 hover:text-green-700"
                      onClick={() => navigate('/help')}
                    >
                      Browse FAQ →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@university.edu"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="technical">Technical Problems</SelectItem>
                          <SelectItem value="messaging">Messaging & Chat</SelectItem>
                          <SelectItem value="privacy">Privacy & Security</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Issue affecting usage</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical - Service unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please describe your issue in detail..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Before submitting:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Check our Help Center for quick answers</li>
                      <li>• Include as much detail as possible</li>
                      <li>• Mention your browser and device if it's a technical issue</li>
                      <li>• We typically respond within 24 hours</li>
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1">
                      Submit Ticket
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/help')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;