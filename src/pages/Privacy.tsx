export default function Privacy() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '80px 20px'
    }}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 700, marginBottom: '30px', color: '#2c3e50'}}>
          Privacy Policy
        </h1>
        <div style={{color: '#495057', fontSize: '1.1rem', lineHeight: '1.8'}}>
          <p style={{marginBottom: '20px'}}>Your privacy matters. We collect only the data necessary to provide our service and never sell your data.</p>
          <ul style={{listStyleType: 'disc', paddingLeft: '30px', marginBottom: '20px'}}>
            <li style={{marginBottom: '10px'}}>We use tokens to authenticate users.</li>
            <li style={{marginBottom: '10px'}}>Basic analytics may be collected to improve the service.</li>
            <li style={{marginBottom: '10px'}}>You can request data deletion by contacting support.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}