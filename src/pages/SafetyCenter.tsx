import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Eye,
  Lock,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SafetyCenter = () => {
  const navigate = useNavigate();

  const safetyFeatures = [
    {
      icon: Shield,
      title: "AI-Powered Moderation",
      description: "Advanced machine learning algorithms detect and prevent inappropriate behavior in real-time.",
      details: ["Real-time content analysis", "Behavioral pattern recognition", "Automated intervention", "Human oversight"]
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description: "Complete control over what you share with granular privacy settings and optional features.",
      details: ["Video blur options", "Voice-only mode", "Selective sharing", "Data minimization"]
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Bank-level encryption protects all your conversations and personal information.",
      details: ["256-bit encryption", "Secure key exchange", "No data logging", "Regular audits"]
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description: "Clear rules and expectations for respectful interactions within our community.",
      details: ["Age verification", "Respectful communication", "Cultural sensitivity", "Zero tolerance policy"]
    }
  ];

  const emergencyContacts = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      contact: "+250 788 123 456",
      description: "24/7 emergency support for immediate safety concerns"
    },
    {
      icon: Mail,
      title: "Safety Team",
      contact: "safety@duhuze.rw",
      description: "Report safety concerns or get help from our dedicated team"
    },
    {
      icon: MessageSquare,
      title: "In-App Reporting",
      contact: "Available in chat interface",
      description: "Quick reporting tools accessible during conversations"
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
              Safety Center
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Your Safety is Our Priority
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Comprehensive safety measures and support systems designed to protect and empower our community.
          </p>
          <Button
            onClick={() => navigate("/report-issues")}
            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-sm"
          >
            Report an Issue
          </Button>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Advanced Safety Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple layers of protection ensure a safe and positive experience for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 bg-gray-50 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Get Help When You Need It
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple ways to reach our safety team for support and assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="p-6 text-center border border-gray-200 shadow-sm bg-white">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{contact.title}</h3>
                <p className="text-gray-900 font-semibold mb-2">{contact.contact}</p>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Report Safety Concerns
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Help us maintain a safe community by reporting any inappropriate behavior or safety concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/report-issues")}
              className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-sm"
            >
              Report an Issue
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/help-faq")}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm"
            >
              View Guidelines
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyCenter;
