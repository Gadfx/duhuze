import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/landing.css";

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
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-elements">
          <div className="floating-shape shape1"></div>
          <div className="floating-shape shape2"></div>
          <div className="floating-shape shape3"></div>
          <div className="floating-shape shape4"></div>
        </div>

        <div className="hero-content">
          <div className="logo-container">
            <h1 className="text-logo">TUGWEMO</h1>
          </div>

          <div className="typing-container">
            <span id="typing-text">{typingText}</span>
            <span className="cursor">|</span>
          </div>

          <div className="social-proof">
            <div className="proof-item">
              <div className="status-dot"></div>
              <span>10,000+ Active Users</span>
            </div>
            <div className="proof-item">
              <span>🛡️</span>
              <span>100% Safe & Secure</span>
            </div>
          </div>

          <p className="hero-description">
            Rwanda's premier platform for anonymous video chat and meaningful connections.
            Experience the future of social interaction with cutting-edge technology and unmatched privacy.
          </p>

          <div className="cta-buttons">
            <button className="cta-button primary" onClick={handleGetStarted}>
              <span>📹</span>
              Get Started Free
            </button>
            <button className="cta-button secondary" onClick={handleGetStarted}>
              Tangira
            </button>
          </div>

          <div className="trust-indicators">
            <div className="indicator">
              <span className="indicator-icon">👥</span>
              <div className="indicator-text">10K+ Users</div>
            </div>
            <div className="indicator">
              <span className="indicator-icon">🌍</span>
              <div className="indicator-text">Global Access</div>
            </div>
            <div className="indicator">
              <span className="indicator-icon">🛡️</span>
              <div className="indicator-text">Enterprise Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Tugwemo?</h2>
            <p>Experience the most advanced anonymous video chat platform</p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📹</div>
              <h3>Anonymous Video Chat</h3>
              <p>Connect face-to-face with random people or skip to the next. Your privacy is our priority.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <h3>Rich Text Chat</h3>
              <p>Chat alongside your video call with emojis, GIFs, and cultural expressions.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption and AI-powered moderation keep our community safe.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3>Multilingual Support</h3>
              <p>Chat in Kinyarwanda, French, English, or Swahili.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <h3>Smart Matching</h3>
              <p>Advanced algorithms connect you with people who share your interests.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">❤️</div>
              <h3>Cultural Connection</h3>
              <p>Rwanda-specific features celebrating our rich cultural heritage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Connect?</h2>
            <p>Join thousands of Rwandans making meaningful connections every day.</p>
            <button className="cta-button-large primary" onClick={handleGetStarted}>
              <span>📹</span>
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <p className="copyright">&copy; 2024 Tugwemo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
