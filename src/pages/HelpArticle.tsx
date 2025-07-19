import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share, BookOpen, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const HelpArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock article data - in a real app, this would come from an API
  const articles: Record<string, any> = {
    '1': {
      title: "How to reset your password",
      category: "Account",
      readTime: "2 min read",
      lastUpdated: "January 10, 2024",
      author: "TekPulse Support Team",
      content: [
        {
          type: "text",
          content: "If you've forgotten your password or need to reset it for security reasons, follow these simple steps:"
        },
        {
          type: "steps",
          content: [
            "Go to the login page and click 'Forgot Password'",
            "Enter your email address associated with your TekPulse account",
            "Check your email for a password reset link",
            "Click the link and enter your new password",
            "Confirm your new password and save changes"
          ]
        },
        {
          type: "text",
          content: "If you don't receive the reset email within 5 minutes, check your spam folder or contact support."
        },
        {
          type: "tip",
          content: "💡 Tip: Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols."
        }
      ]
    },
    '2': {
      title: "How to create your first post",
      category: "Getting Started",
      readTime: "3 min read",
      lastUpdated: "January 8, 2024",
      author: "TekPulse Support Team",
      content: [
        {
          type: "text",
          content: "Ready to share your thoughts with the TekPulse community? Creating your first post is easy!"
        },
        {
          type: "steps",
          content: [
            "Navigate to the Home section from the main menu",
            "Click in the 'What's happening on campus?' text area",
            "Type your message (up to 280 characters)",
            "Add photos or videos by clicking the media buttons",
            "Use hashtags (#) to make your post discoverable",
            "Click the 'Post' button to share with the community"
          ]
        },
        {
          type: "text",
          content: "Your post will appear in the main feed and be visible to other students on your campus."
        },
        {
          type: "tip",
          content: "💡 Tip: Use relevant hashtags like #StudyGroup or #CampusLife to help others find your posts!"
        }
      ]
    },
    '3': {
      title: "Setting up your profile",
      category: "Getting Started",
      readTime: "4 min read",
      lastUpdated: "January 5, 2024",
      author: "TekPulse Support Team",
      content: [
        {
          type: "text",
          content: "Your profile is how other students will get to know you. Here's how to set it up:"
        },
        {
          type: "steps",
          content: [
            "Go to Settings from the main menu",
            "Upload a profile picture by clicking on your avatar",
            "Add a display name and username",
            "Write a bio that describes your interests",
            "Add your location and website (optional)",
            "Upload a cover photo to personalize your profile",
            "Save your changes"
          ]
        },
        {
          type: "text",
          content: "A complete profile helps other students connect with you and builds trust in the community."
        },
        {
          type: "tip",
          content: "💡 Tip: Use a clear, friendly photo and mention your major or interests in your bio!"
        }
      ]
    }
  };

  const article = articles[id || '1'] || articles['1'];

  const handleFeedback = (helpful: boolean) => {
    toast({
      title: helpful ? "Thanks for your feedback!" : "Thanks for letting us know",
      description: helpful ? "We're glad this article was helpful." : "We'll work on improving this article.",
    });
  };

  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case 'text':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {item.content}
          </p>
        );
      case 'steps':
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-6 bg-blue-50 p-4 rounded-lg">
            {item.content.map((step: string, stepIndex: number) => (
              <li key={stepIndex} className="text-gray-700">
                {step}
              </li>
            ))}
          </ol>
        );
      case 'tip':
        return (
          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">{item.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

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
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BookOpen size={16} />
              <span>{article.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Clock size={14} />
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>Updated {article.lastUpdated}</span>
                </div>
                <CardTitle className="text-2xl">{article.title}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <User size={14} />
                  <span>By {article.author}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {article.content.map((item: any, index: number) => renderContent(item, index))}
                </div>

                {/* Feedback Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Was this article helpful?</h3>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => handleFeedback(true)}
                      className="flex items-center space-x-2"
                    >
                      <ThumbsUp size={16} />
                      <span>Yes, helpful</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleFeedback(false)}
                      className="flex items-center space-x-2"
                    >
                      <ThumbsDown size={16} />
                      <span>Not helpful</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: "Link copied!", description: "Article link copied to clipboard." });
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Share size={16} />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(articles).slice(0, 4).map(([articleId, articleData]) => (
                    <button
                      key={articleId}
                      onClick={() => navigate(`/help/article/${articleId}`)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {articleData.title}
                      </h4>
                      <p className="text-xs text-gray-500">{articleData.category}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button
                  onClick={() => navigate('/contact-support')}
                  className="w-full"
                  size="sm"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpArticle;