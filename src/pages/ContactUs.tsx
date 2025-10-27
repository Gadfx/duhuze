import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowLeft,
  MessageSquare,
  Headphones,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ContactUs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@duhuze.rw",
      description: "General inquiries and support",
      availability: "24/7 Response within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+250 788 123 456",
      description: "Urgent safety concerns",
      availability: "Mon-Fri 8AM-6PM CAT"
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: "Kigali, Rwanda",
      description: "Visit our headquarters",
      availability: "By appointment only"
    }
  ];

  const supportCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "safety", label: "Safety Concern" },
    { value: "billing", label: "Billing & Premium" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "partnership", label: "Partnership Opportunities" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    });

    setIsSubmitting(false);
  };

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
              Contact Us
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Have a question, concern, or suggestion? We'd love to hear from you.
          </p>
          <Button
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-sm"
          >
            Send a Message
          </Button>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center border border-gray-200 shadow-sm bg-white">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{info.title}</h3>
                <p className="text-gray-900 font-semibold mb-1">{info.details}</p>
                <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{info.availability}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="max-w-2xl mx-auto">
            <Card className="p-8 border border-gray-200 shadow-sm bg-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
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
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3 rounded-lg font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Support Options */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Other Ways to Get Help
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore additional resources and support options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 border border-gray-200 shadow-sm bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Live Chat Support</h3>
                  <p className="text-gray-600 text-sm">Available 24/7 for immediate assistance</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm">
                Start Live Chat
              </Button>
            </Card>

            <Card className="p-6 border border-gray-200 shadow-sm bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Community Forum</h3>
                  <p className="text-gray-600 text-sm">Connect with other users and share experiences</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm">
                Visit Forum
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
