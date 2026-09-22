import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border)',
      padding: '2rem 1rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', mdFlexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          SafeCity © 2026 • PRJ_544 Presidency University
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Admin Login</Link>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
