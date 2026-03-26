import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg-color)'
    }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', maxWidth: '500px', width: '100%' }}>
        <AlertTriangle size={64} color="var(--accent-color)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          The module or page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <Home size={18} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
