import React from 'react';

const StatsCard = ({ icon: Icon, label, value, trend, trendLabel, color = '#0d9488' }) => {
  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      padding: '1.5rem',
      background: '#10192d',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ 
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        backgroundColor: `${color}18`,
        border: `1px solid ${color}30`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={22} />
      </div>
      <div>
        <p style={{
          color: '#94a3b8',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.2rem'
        }}>
          {label}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.1
        }}>
          {value}
        </h3>
        {trend && (
          <p style={{ 
            fontSize: '0.72rem', 
            color: trend.startsWith('+') ? '#10b981' : '#f43f5e',
            marginTop: '0.25rem',
            fontWeight: '600',
            margin: '0.2rem 0 0'
          }}>
            {trend} <span style={{ color: '#64748b', fontWeight: 'normal' }}>{trendLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
