import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      background: 'var(--bg-surface, #0E1726)',
      borderRadius: 'var(--radius-card, 14px)',
      border: '1px dashed var(--border-subtle, rgba(255, 255, 255, 0.12))',
      margin: '1rem 0'
    }}>
      {Icon && (
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <Icon size={26} color="var(--accent, #0D9488)" />
        </div>
      )}
      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: '700',
        color: 'var(--text-primary, #F8FAFC)',
        marginBottom: '0.5rem',
        fontFamily: 'var(--font-heading)'
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--text-secondary, #94A3B8)',
        maxWidth: '440px',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        margin: 0
      }}>
        {description}
      </p>
      {action && (
        <div style={{ marginTop: '1.25rem' }}>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
