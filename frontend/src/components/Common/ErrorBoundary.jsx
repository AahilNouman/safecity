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
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We apologize for the inconvenience.</p>
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
