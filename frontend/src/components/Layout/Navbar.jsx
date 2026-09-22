import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report', path: '/report' },
    { name: 'Safety Map', path: '/map' },
    { name: 'Community Feed', path: '/feed' },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin/dashboard' });
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--navy)', textDecoration: 'none' }}>
            <Shield size={28} color="var(--blue)" />
            <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>SafeCity</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'none', gap: '1.5rem' }} className="md-flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  color: location.pathname === link.path ? 'var(--blue)' : 'var(--text-body)',
                  fontWeight: location.pathname === link.path ? '600' : '500',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button onClick={toggleMenu} style={{ display: 'block', background: 'none', border: 'none' }} className="md-none">
            {isOpen ? <X size={24} color="var(--text-dark)" /> : <Menu size={24} color="var(--text-dark)" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div style={{ padding: '1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }} className="md-none">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={{
                  color: location.pathname === link.path ? 'var(--blue)' : 'var(--text-body)',
                  fontWeight: location.pathname === link.path ? '600' : '500',
                  textDecoration: 'none',
                  padding: '0.5rem 0'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
          .md-none { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
