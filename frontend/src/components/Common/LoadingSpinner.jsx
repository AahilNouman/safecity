import React from 'react';

const LoadingSpinner = ({ label = 'Loading SafeCity intelligence...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      minHeight: '200px'
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        border: '3px solid rgba(255, 255, 255, 0.08)',
        borderTopColor: 'var(--accent, #0D9488)',
        borderRadius: '50%',
        animation: 'spinSpinner 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      }} />
      <p style={{
        marginTop: '1.25rem',
        color: 'var(--text-secondary, #94a3b8)',
        fontSize: '0.875rem',
        fontWeight: '500',
        letterSpacing: '0.01em'
      }}>
        {label}
      </p>
      <style>{`
        @keyframes spinSpinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
