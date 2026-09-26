import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#070b14',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2.5rem 1.5rem',
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
        {/* Brand info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '7px',
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={15} color="#ffffff" strokeWidth={2.4} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.95rem'
          }}>
            SafeCity
          </span>
          <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '0.25rem' }}>
            • Municipal Safety & Incident Reporting Network © 2026
          </span>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
          <Link
            to="/admin/dashboard"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Admin Portal
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>•</span>
          <Link
            to="/map"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Live Safety Map
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>•</span>
          <Link
            to="/report"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Report Incident
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>•</span>
          <Link
            to="/feed"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Community Feed
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
