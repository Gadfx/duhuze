export default function Contact() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '80px 20px'
    }}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 700, marginBottom: '30px', color: '#2c3e50'}}>
          Contact Us
        </h1>
        <div style={{color: '#495057', fontSize: '1.1rem', lineHeight: '1.8'}}>
          <p style={{marginBottom: '20px'}}>Have questions or feedback? We'd love to hear from you.</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <p>
              <strong>Email:</strong>{' '}
              <a style={{color: '#667eea', textDecoration: 'underline'}} href="mailto:support@tugwemo.app">
                support@tugwemo.app
              </a>
            </p>
            <p>
              <strong>Twitter/X:</strong>{' '}
              <a style={{color: '#667eea', textDecoration: 'underline'}} href="https://twitter.com/tugwemo">
                @tugwemo
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}