import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-base, #070B14)',
          color: 'var(--text-primary, #F8FAFC)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <AlertTriangle size={32} color="#f87171" />
          </div>

          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            SafeCity Telemetry Exception
          </h2>
          <p style={{
            color: 'var(--text-secondary, #94A3B8)',
            marginBottom: '1.5rem',
            maxWidth: '480px',
            fontSize: '0.95rem'
          }}>
            An unexpected client-side rendering exception was encountered. Your session security remains uncompromised.
          </p>

          {this.state.error && (
            <pre style={{
              textAlign: 'left',
              background: 'rgba(14, 23, 38, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem',
              borderRadius: '12px',
              maxWidth: '750px',
              width: '100%',
              overflow: 'auto',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              color: '#f87171',
              marginBottom: '2rem',
              whiteSpace: 'pre-wrap'
            }}>
              {this.state.error.toString()}
            </pre>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} /> Reload Page
            </button>
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Return to Platform Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
