import React from 'react';

const StatsCard = ({ icon: Icon, label, value, trend, trendLabel, color = 'var(--blue)' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{ 
        padding: '1rem', 
        borderRadius: 'var(--radius)', 
        backgroundColor: `${color}15`, // 15% opacity hex roughly
        color: color 
      }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{label}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0' }}>{value}</h3>
        {trend && (
          <p style={{ 
            fontSize: '0.75rem', 
            color: trend.startsWith('+') ? 'var(--emerald)' : 'var(--rose)',
            marginTop: '0.25rem',
            fontWeight: '500'
          }}>
            {trend} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{trendLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
