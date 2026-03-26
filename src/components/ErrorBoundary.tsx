import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LMS UI Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-color)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px' }}>
            <AlertCircle size={56} color="var(--danger-color)" style={{ margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Something went wrong.
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              The application encountered an unexpected error. This has been logged in your console.
            </p>
            <details style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', overflowX: 'auto' }}>
              <summary style={{ color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>View Error Details</summary>
              <pre style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {this.state.errorMsg}
              </pre>
            </details>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
              style={{ display: 'inline-flex', gap: '0.5rem' }}
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
