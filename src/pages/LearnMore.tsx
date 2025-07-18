import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Search, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Shield, 
  Smartphone, 
  Globe,
  ArrowLeft,
  CheckCircle,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';

const LearnMore = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Social Feed",
      description: "Connect with fellow students, share experiences, and build meaningful relationships within your campus community."
    },
    {
      icon: Search,
      title: "Lost & Found",
      description: "Never lose track of your belongings again. Post lost items or help others find their missing possessions."
    },
    {
      icon: MapPin,
      title: "Campus Map",
      description: "Navigate your campus with ease using our interactive map feature with real-time location services."
      
    },
    {
      icon: Calendar,
      title: "Timetable Management",
      description: "Organize your academic schedule, set reminders, and never miss an important class or deadline."
    },
    {
      icon: ShoppingBag,
      title: "Student Marketplace",
      description: "Buy, sell, or trade textbooks, furniture, and other student essentials with your peers."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Student Verified",
      description: "All users are verified students, ensuring a safe and authentic community environment."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Access TekPulse seamlessly on any device with our responsive design."
    },
    {
      icon: Globe,
      title: "Campus Focused",
      description: "Connect specifically with students from your university or college campus."
    }
  ];

const testimonials = [
  {
    name: "Sarah Johnson",
    year: "Junior, Computer Science",
    content:
      "TekPulse has completely transformed how I connect with other students. I've found study groups, sold textbooks, and even found my lost laptop!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Marcus Chen",
    year: "Sophomore, Business",
    content:
      "The marketplace feature saved me hundreds of dollars on textbooks. Plus, the campus map helped me navigate during my first week.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Emily Rodriguez",
    year: "Senior, Psychology",
    content:
      "As a senior, I love how easy it is to help freshmen through the platform. The community aspect is amazing!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Button>
          <h1 className="text-2xl font-bold text-blue-600">TekPulse</h1>
          <Button onClick={() => navigate('/auth')}>
            Get Started
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Everything Students Need
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In One Platform
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            TekPulse brings together all the tools and connections you need to thrive in your academic journey. 
            From finding study partners to navigating campus life, we've got you covered.
          </p>
          <div className="relative max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop&auto=format"
              alt="Students using technology for learning"
              className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover all the ways TekPulse can enhance your university experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TekPulse?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for students, by students who understand your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are already loving TekPulse
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.year}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Universities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Connections Made</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with TekPulse is simple and takes just minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account using your student email for instant verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore</h3>
              <p className="text-gray-600">Discover features, connect with classmates, and join your campus community</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Start building relationships and making the most of your university experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Student Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already connecting, sharing, and thriving with TekPulse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
            >
              Back to Home
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">
            Free to use • Student verified • Secure platform
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">TekPulse</h3>
          <p className="text-gray-400 mb-4">Connecting students, building communities</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 TekPulse</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
