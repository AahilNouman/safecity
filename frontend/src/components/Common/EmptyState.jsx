import React from 'react';

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      textAlign: 'center',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius)',
      border: '1px dashed var(--border)'
    }}>
      {Icon && <Icon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
