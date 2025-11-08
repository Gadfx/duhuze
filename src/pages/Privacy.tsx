import { useNavigate } from "react-router-dom";
import "@/styles/landing.css";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '900px' }}>
        <div className="auth-header">
          <div className="logo-container">
            <div className="text-logo">TUGWEMO</div>
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Privacy Policy</h2>
          <p style={{ opacity: 0.8, marginBottom: '30px' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: '1.1rem', 
          lineHeight: '1.8',
          textAlign: 'left',
          padding: '0 20px'
        }}>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>Our Commitment to Privacy</h3>
            <p style={{ marginBottom: '15px' }}>
              Your privacy is of utmost importance to us. We are committed to protecting your personal information 
              and being transparent about how we collect, use, and share your data.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>Information We Collect</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '30px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Account Information:</strong> Email address and password (encrypted) when you create an account.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Usage Data:</strong> Basic analytics such as connection times, session duration, and feature usage to improve our service.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Technical Data:</strong> IP address, browser type, and device information for security and troubleshooting purposes.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>How We Use Your Information</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '30px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '10px' }}>To provide and maintain our video chat service</li>
              <li style={{ marginBottom: '10px' }}>To authenticate users and ensure account security</li>
              <li style={{ marginBottom: '10px' }}>To improve our service based on usage patterns</li>
              <li style={{ marginBottom: '10px' }}>To communicate important service updates</li>
              <li style={{ marginBottom: '10px' }}>To prevent fraud and ensure platform safety</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>Video Chat Privacy</h3>
            <p style={{ marginBottom: '15px' }}>
              <strong>We do not record or store your video conversations.</strong> All video and audio streams are peer-to-peer 
              and encrypted. Your conversations are private and ephemeral.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>Data Sharing</h3>
            <p style={{ marginBottom: '15px' }}>
              We <strong>never sell your personal data</strong>. We may share information only in these limited circumstances:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '30px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '10px' }}>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
              <li style={{ marginBottom: '10px' }}>When required by law or to protect our legal rights</li>
              <li style={{ marginBottom: '10px' }}>In case of a business merger or acquisition (users will be notified)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>Your Rights</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '30px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '10px' }}>Request access to your personal data</li>
              <li style={{ marginBottom: '10px' }}>Request data correction or deletion</li>
              <li style={{ marginBottom: '10px' }}>Opt out of non-essential data collection</li>
              <li style={{ marginBottom: '10px' }}>Delete your account at any time</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>Contact Us</h3>
            <p>
              For privacy-related questions or to exercise your rights, please contact us through our contact page.
            </p>
          </section>
        </div>

        <button
          onClick={() => navigate("/")}
          className="auth-btn"
          style={{ marginTop: '30px' }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}