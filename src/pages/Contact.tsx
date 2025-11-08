import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "@/styles/landing.css";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <div className="auth-header">
          <div className="logo-container">
            <div className="text-logo">TUGWEMO</div>
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Contact Us</h2>
          <p style={{ opacity: 0.8 }}>Have questions? We'd love to hear from you!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              required
              placeholder="What's this about?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              rows={6}
              placeholder="Tell us more..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="back-btn"
          >
            ← Back to Home
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
            You can also reach us at:
          </p>
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>
            support@tugwemo.com
          </p>
        </div>
      </div>
    </div>
  );
}
