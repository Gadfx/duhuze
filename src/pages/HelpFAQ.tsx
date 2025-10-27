import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  HelpCircle,
  ArrowLeft,
  Search,
  MessageSquare,
  Video,
  Shield,
  User,
  Settings,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const HelpFAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      icon: User,
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Get Started Free' on the homepage, fill in your details, and verify your email. You'll need to be 18+ and provide basic profile information."
        },
        {
          question: "Is Duhuze really free?",
          answer: "Yes! Duhuze is completely free to use. We may offer premium features in the future, but core video chat functionality will always be free."
        },
        {
          question: "What languages does Duhuze support?",
          answer: "Duhuze supports Kinyarwanda, English, French, and Swahili. You can set your preferred language in your profile settings."
        }
      ]
    },
    {
      icon: Video,
      title: "Video Chat",
      faqs: [
        {
          question: "How do I start a video chat?",
          answer: "After logging in and completing your profile, select your language preference, then click 'Start Connecting'. You'll be matched with another available user."
        },
        {
          question: "Can I skip to the next person?",
          answer: "Yes! Use the skip button anytime during a conversation. You'll be immediately matched with someone else."
        },
        {
          question: "What if I don't want video, just voice?",
          answer: "You can disable your camera in the chat controls. Voice-only mode is available for additional privacy."
        },
        {
          question: "How does the matching work?",
          answer: "Our smart algorithm matches you based on your preferences, language, and availability. You can set filters for age, interests, and location."
        }
      ]
    },
    {
      icon: MessageSquare,
      title: "Text Chat",
      faqs: [
        {
          question: "Can I chat while video calling?",
          answer: "Absolutely! The text chat runs alongside your video call. Send messages, emojis, and GIFs during your conversation."
        },
        {
          question: "Are messages private?",
          answer: "Yes, all messages are encrypted and only visible to you and your chat partner. Messages are not stored permanently."
        },
        {
          question: "What about self-destructing messages?",
          answer: "Premium users can enable self-destructing messages that automatically delete after a set time for extra privacy."
        }
      ]
    },
    {
      icon: Shield,
      title: "Safety & Privacy",
      faqs: [
        {
          question: "How does Duhuze protect my privacy?",
          answer: "We use end-to-end encryption, anonymous matching, and AI-powered moderation. You control what information you share."
        },
        {
          question: "What should I do if someone is inappropriate?",
          answer: "Use the report button immediately. Our safety team reviews all reports within 24 hours. You can also block users instantly."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, we follow bank-level security standards. We don't store video content or share personal data with third parties."
        },
        {
          question: "Can I remain completely anonymous?",
          answer: "Yes, you can choose to be anonymous. We don't require real names or photos, though you can add them if you prefer."
        }
      ]
    },
    {
      icon: Settings,
      title: "Account & Settings",
      faqs: [
        {
          question: "How do I update my profile?",
          answer: "Go to your profile settings after logging in. You can update your display name, bio, preferences, and privacy settings."
        },
        {
          question: "Can I change my language preference?",
          answer: "Yes, you can change your language in settings. The app will immediately switch to your selected language."
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team at support@duhuze.rw with your account details. We'll help you delete your account and all associated data."
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: "Troubleshooting",
      faqs: [
        {
          question: "Video isn't working, what do I do?",
          answer: "Check your camera permissions in your browser settings. Make sure no other apps are using your camera. Try refreshing the page."
        },
        {
          question: "I can't hear the other person?",
          answer: "Check your audio settings and speaker volume. Make sure your microphone isn't muted. Try using headphones if available."
        },
        {
          question: "The app is slow or freezing?",
          answer: "Check your internet connection. Close other browser tabs and try again. If issues persist, try a different browser."
        },
        {
          question: "I'm having trouble logging in?",
          answer: "Check your email for the verification link. Make sure you're using the correct email and password. Try resetting your password if needed."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              Help & FAQ
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            How Can We Help You?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base border-gray-200 focus:border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
              </div>

              <Card className="border border-gray-200 shadow-sm">
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`} className="border-b border-gray-100 last:border-b-0">
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          ))}

          {filteredCategories.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500">Try different keywords or contact our support team.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/contact-us")}
              className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium"
            >
              Contact Support
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/safety-center")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg"
            >
              Safety Center
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpFAQ;
