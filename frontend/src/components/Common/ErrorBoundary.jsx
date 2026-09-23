import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={64} color="var(--rose)" style={{ marginBottom: '1rem' }} />
          <h2>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>We apologize for the inconvenience.</p>
          {this.state.error && (
            <pre style={{ textAlign: 'left', background: '#f1f5f9', padding: '1rem', borderRadius: '8px', maxWidth: '800px', overflow: 'auto', fontSize: '0.85rem', color: '#e11d48', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
              {this.state.error.toString()}
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
          <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
