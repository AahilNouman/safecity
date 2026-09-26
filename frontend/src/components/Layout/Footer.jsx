import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#02181d',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3rem 1.5rem',
      color: '#94a3b8',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={16} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem' }}>SafeCity</span>
          <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
            © 2026 • Anonymous Community Safety Platform
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link
            to="/admin/dashboard"
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2dd4bf'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Admin Portal
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>|</span>
          <Link
            to="/map"
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2dd4bf'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Live Map
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>|</span>
          <Link
            to="/report"
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2dd4bf'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Report Incident
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
