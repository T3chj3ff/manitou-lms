import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { ShieldAlert, Loader } from 'lucide-react';

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader className="animate-spin" size={32} color="var(--primary-color)" />
        <p style={{ color: 'var(--text-secondary)' }}>Verifying administrative access...</p>
      </div>
    );
  }

  // Not logged in? Go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT an admin? Go to standard dashboard
  if (!isAdmin) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <ShieldAlert size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
        <h1>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You do not have administrative privileges to view this page.</p>
        <a href="/" className="btn btn-primary">Return to Dashboard</a>
      </div>
    );
  }

  return <Outlet />;
}
