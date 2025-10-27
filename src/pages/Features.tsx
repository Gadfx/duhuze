import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Video,
  MessageSquare,
  Shield,
  Globe,
  Users,
  Heart,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Video,
      title: "Anonymous Video Chat",
      description: "Connect face-to-face with random people or skip to the next. Your privacy is our priority with advanced anonymity features.",
      details: ["HD video quality", "Real-time connection", "Anonymous matching", "Skip anytime"]
    },
    {
      icon: MessageSquare,
      title: "Rich Text Chat",
      description: "Chat alongside your video call with emojis, GIFs, stickers, and Rwanda-specific cultural expressions.",
      details: ["Emoji support", "GIF integration", "Cultural expressions", "Real-time messaging"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, AI-powered moderation, and instant reporting tools keep our community safe and respectful.",
      details: ["End-to-end encryption", "AI moderation", "Instant reporting", "24/7 monitoring"]
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Chat in Kinyarwanda, French, English, or Swahili. Connect in the language you're most comfortable with.",
      details: ["4 languages", "Auto-translation", "Cultural sensitivity", "Local dialects"]
    },
    {
      icon: Users,
      title: "Smart Matching",
      description: "Advanced algorithms connect you with people who share your interests, location, age preferences, and values.",
      details: ["Interest matching", "Location-based", "Age preferences", "Value alignment"]
    },
    {
      icon: Heart,
      title: "Cultural Connection",
      description: "Rwanda-specific features, traditional greetings, and themed experiences celebrating our rich cultural heritage.",
      details: ["Traditional greetings", "Cultural themes", "Local celebrations", "Heritage preservation"]
    }
  ];

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
              Features
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Powerful Features for<br />Meaningful Connections
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Discover what makes Duhuze Rwanda's premier platform for anonymous video chat and authentic interactions.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium"
          >
            Start Connecting Now
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                </div>

                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of Rwandans who are already making meaningful connections on Duhuze.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium"
          >
            Start Connecting Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Features;
