import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare, Shield, Globe, Users, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSetup from "@/components/ProfileSetup";
import LanguageSelector from "@/components/LanguageSelector";
import ConnectionModeSelector from "@/components/ConnectionModeSelector";
import ChatInterface from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { TypeAnimation } from 'react-type-animation';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showConnectionMode, setShowConnectionMode] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    if (user && !loading) {
      // Check if profile is complete
      supabase
        .from("profiles")
        .select("age")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.age) {
            setProfileComplete(true);
          }
        });
    }
  }, [user, loading]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
    setShowConnectionMode(true);
  };

  const handleConnectionModeSelect = () => {
    setShowConnectionMode(false);
    setShowChatInterface(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Show profile setup if user is logged in but profile incomplete
  if (user && !loading && !profileComplete) {
    return <ProfileSetup onComplete={() => setProfileComplete(true)} />;
  }

  if (showChatInterface) {
    return <ChatInterface language={selectedLanguage} />;
  }

  if (showConnectionMode) {
    return <ConnectionModeSelector onSelect={handleConnectionModeSelect} />;
  }

  if (showLanguageSelector) {
    return <LanguageSelector onSelect={handleLanguageSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          {user && (
            <div className="absolute top-8 right-8">
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 hover:border-white/50 transition-all duration-300 rounded-lg px-4 py-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl shadow-xl mb-6 overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                <img src="/Duhuze_Logo.png" alt="Duhuze Logo" className="w-16 h-16 object-contain" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight tracking-wider" style={{ textShadow: "0 0 40px rgba(255,255,255,0.3)", fontWeight: "900" }}>
              Duhuze
            </h1>

            <div className="mb-6">
              <div className="text-xl md:text-2xl text-white/90 mb-4 font-medium h-16 flex items-center justify-center">
                <TypeAnimation
                  sequence={[
                    'Connect anonymously.',
                    2000,
                    'Chat freely.',
                    2000,
                    'Meet authentically.',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="inline-block"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>10,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                  <Shield className="w-4 h-4" />
                  <span>100% Safe & Secure</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rwanda's premier platform for anonymous video chat and meaningful connections.
              Experience the future of social interaction with cutting-edge technology and unmatched privacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Button
                  onClick={() => setShowLanguageSelector(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 h-auto rounded-lg shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Connecting
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 h-auto rounded-lg shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-6 py-3 h-auto rounded-lg backdrop-blur-sm font-semibold bg-white/5"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3">
                <Users className="w-5 h-5 text-white/60 mx-auto mb-1" />
                <div className="text-white/80 text-sm font-medium">10K+ Users</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3">
                <Globe className="w-5 h-5 text-white/60 mx-auto mb-1" />
                <div className="text-white/80 text-sm font-medium">Global Access</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3">
                <Shield className="w-5 h-5 text-white/60 mx-auto mb-1" />
                <div className="text-white/80 text-sm font-medium">Enterprise Security</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Why Choose Duhuze?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the most advanced anonymous video chat platform with features designed for meaningful connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Anonymous Video Chat</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect face-to-face with random people or skip to the next. Your privacy is our priority with advanced anonymity features.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Rich Text Chat</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chat alongside your video call with emojis, GIFs, stickers, and Rwanda-specific cultural expressions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Enterprise Security</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bank-level encryption, AI-powered moderation, and instant reporting tools keep our community safe and respectful.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Multilingual Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chat in Kinyarwanda, French, English, or Swahili. Connect in the language you're most comfortable with.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Matching</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced algorithms connect you with people who share your interests, location, age preferences, and values.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Cultural Connection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rwanda-specific features, traditional greetings, and themed experiences celebrating our rich cultural heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-xl mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
                Your Safety Matters
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                We prioritize your security with enterprise-grade protection and proactive moderation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Moderation</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Advanced machine learning algorithms detect and prevent inappropriate behavior in real-time, ensuring a safe environment for everyone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Instant Reporting</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        One-click reporting and blocking tools empower you to maintain control over your experience and help keep our community safe.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Age Verification</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Strict 18+ age verification ensures all users are of legal age, creating a mature and responsible community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Privacy Controls</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Optional video blur, voice-only modes, and granular privacy settings give you complete control over what you share.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Secure Encryption</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        End-to-end encryption protects all your conversations, ensuring your private moments stay private forever.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Our dedicated safety team monitors the platform around the clock to respond quickly to any concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Ready to Connect?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Rwandans making meaningful connections every day.
              Your perfect match is just one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => setShowLanguageSelector(true)}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 h-auto rounded-lg shadow-xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 font-semibold border-2 border-white/20"
              >
                <Video className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>100% Free to Start</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                  <Users className="w-4 h-4" />
                  <span>No Registration Required</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-white/70 text-sm">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                <div className="text-2xl font-bold text-white mb-1">1M+</div>
                <div className="text-white/70 text-sm">Connections Made</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                <div className="text-2xl font-bold text-white mb-1">4.9★</div>
                <div className="text-white/70 text-sm">User Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/70 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                    <img src="/Duhuze_Logo.png" alt="Duhuze Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Duhuze</h3>
                    <p className="text-white/60">Connecting hearts across Rwanda</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed max-w-md text-sm">
                  Rwanda's premier platform for anonymous video chat and meaningful connections.
                  Safe, private, and designed for authentic interactions.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li><a href="/features" className="hover:text-white transition-colors">Anonymous Video Chat</a></li>
                  <li><a href="/features" className="hover:text-white transition-colors">Interest Matching</a></li>
                  <li><a href="/features" className="hover:text-white transition-colors">Multilingual Support</a></li>
                  <li><a href="/features" className="hover:text-white transition-colors">Cultural Connection</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Support</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li><a href="/safety-center" className="hover:text-white transition-colors">Safety Center</a></li>
                  <li><a href="/help-faq" className="hover:text-white transition-colors">Help & FAQ</a></li>
                  <li><a href="/contact-us" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/report-issues" className="hover:text-white transition-colors">Report Issues</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/60 text-center md:text-left text-sm">
                  &copy; 2024 Duhuze. All rights reserved. Made with IX for Rwanda.
                </p>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
                  <a href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
