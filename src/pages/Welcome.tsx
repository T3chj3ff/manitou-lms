import { useState } from 'react';
import { useProgress } from '../lib/useProgress';
import { UserCheck } from 'lucide-react';

export default function Welcome() {
  const { setUserName } = useProgress();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      setUserName(name);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <UserCheck size={48} color="var(--primary-color)" />
        </div>
        <h1 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Welcome back!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
          Please carefully enter your full name below. This name will become permanent and will be printed on your official Manitou Springs Certificate of Completion.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="First and Last Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--surface-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              outline: 'none',
              fontFamily: 'var(--font-family)',
              textAlign: 'center'
            }}
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
            Begin Training
          </button>
        </form>
      </div>
    </div>
  );
}
