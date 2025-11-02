import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const messages = [
    "Connect anonymously.",
    "Chat freely.",
    "Meet authentically.",
  ];

  useEffect(() => {
    const typeWriter = () => {
      const currentMessage = messages[messageIndex];

      if (!isDeleting) {
        setTypingText(currentMessage.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        
        if (charIndex === currentMessage.length) {
          setIsDeleting(true);
          setTimeout(() => {}, 2000);
          return;
        }
      } else {
        setTypingText(currentMessage.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        
        if (charIndex < 0) {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
          setTimeout(() => {}, 500);
          return;
        }
      }
    };

    const timer = setTimeout(typeWriter, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, messageIndex]);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/video");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tight">
              TUGWEMO
            </h1>

            <div className="h-12 flex items-center justify-center">
              <span className="text-2xl md:text-3xl text-muted-foreground">
                {typingText}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-6 items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>10,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>100% Safe & Secure</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rwanda's premier platform for anonymous video chat and meaningful connections.
              Experience the future of social interaction with cutting-edge technology and unmatched privacy.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="secondary" onClick={handleGetStarted} className="text-lg px-8">
                Tangira
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 justify-center pt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-sm text-muted-foreground">10K+ Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <div className="text-sm text-muted-foreground">Global Access</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="text-sm text-muted-foreground">Enterprise Security</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Tugwemo?</h2>
            <p className="text-muted-foreground text-lg">
              Experience the most advanced anonymous video chat platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📹",
                title: "Anonymous Video Chat",
                description: "Connect face-to-face with random people or skip to the next. Your privacy is our priority."
              },
              {
                icon: "💬",
                title: "Rich Text Chat",
                description: "Chat alongside your video call with emojis, GIFs, and cultural expressions."
              },
              {
                icon: "🛡️",
                title: "Enterprise Security",
                description: "Bank-level encryption and AI-powered moderation keep our community safe."
              },
              {
                icon: "🌍",
                title: "Multilingual Support",
                description: "Chat in Kinyarwanda, French, English, or Swahili."
              },
              {
                icon: "👥",
                title: "Smart Matching",
                description: "Advanced algorithms connect you with people who share your interests."
              },
              {
                icon: "❤️",
                title: "Cultural Connection",
                description: "Rwanda-specific features celebrating our rich cultural heritage."
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Rwandans making meaningful connections every day.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-12">
            <span className="mr-2">📹</span>
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-6 justify-center mb-4">
            <a href="/terms.html" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="/privacy.html" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/contact.html" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact Us
            </a>
          </div>
          <p className="text-center text-muted-foreground">&copy; 2024 Tugwemo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
