export default function Terms() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '80px 20px'
    }}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 700, marginBottom: '30px', color: '#2c3e50'}}>
          Terms of Service
        </h1>
        <div style={{color: '#495057', fontSize: '1.1rem', lineHeight: '1.8'}}>
          <p style={{marginBottom: '20px'}}>Welcome to Tugwemo. By using our service, you agree to these terms. Please read them carefully.</p>
          <ul style={{listStyleType: 'disc', paddingLeft: '30px', marginBottom: '20px'}}>
            <li style={{marginBottom: '10px'}}>Be respectful to others; harassment is not tolerated.</li>
            <li style={{marginBottom: '10px'}}>No sharing of illegal content or activities.</li>
            <li style={{marginBottom: '10px'}}>We may suspend accounts that violate these terms.</li>
          </ul>
          <p>If you have questions about these terms, please contact us.</p>
        </div>
      </div>
    </main>
  );
}