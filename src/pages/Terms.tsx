import { useNavigate } from "react-router-dom";
import "@/styles/landing.css";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '900px' }}>
        <div className="auth-header">
          <div className="logo-container">
            <div className="text-logo">TUGWEMO</div>
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Terms of Service</h2>
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>1. Acceptance of Terms</h3>
            <p style={{ marginBottom: '15px' }}>
              Welcome to Tugwemo. By accessing or using our video chat service, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>2. User Conduct</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '30px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '10px' }}>Be respectful to all users; harassment, hate speech, or threatening behavior is strictly prohibited.</li>
              <li style={{ marginBottom: '10px' }}>No sharing of illegal content, pornographic material, or activities that violate local or international laws.</li>
              <li style={{ marginBottom: '10px' }}>Users must be 18 years or older to use this service.</li>
              <li style={{ marginBottom: '10px' }}>Do not impersonate others or create fake profiles.</li>
              <li style={{ marginBottom: '10px' }}>Respect others' privacy and do not record conversations without consent.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>3. Account Suspension</h3>
            <p style={{ marginBottom: '15px' }}>
              We reserve the right to suspend or terminate accounts that violate these terms without prior notice. 
              Repeated violations may result in permanent bans from the platform.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>4. Service Availability</h3>
            <p style={{ marginBottom: '15px' }}>
              We strive to maintain 24/7 service availability but do not guarantee uninterrupted access. 
              We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>5. Limitation of Liability</h3>
            <p style={{ marginBottom: '15px' }}>
              Tugwemo is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>6. Contact</h3>
            <p>
              If you have questions about these terms, please contact us through our contact page.
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