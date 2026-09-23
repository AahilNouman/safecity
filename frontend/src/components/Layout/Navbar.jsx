import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
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
      background: 'rgba(3, 33, 40, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
          
          {/* Modern Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Shield size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                SafeCity
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: '600', color: '#2dd4bf', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Safety Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="md-flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.925rem',
                    textDecoration: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '9999px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Quick Action Button */}
            <Link
              to="/report"
              style={{
                marginLeft: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                color: '#032128',
                fontWeight: '700',
                fontSize: '0.875rem',
                textDecoration: 'none',
                padding: '0.5rem 1.15rem',
                borderRadius: '9999px',
                boxShadow: '0 2px 10px rgba(45, 212, 191, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(45, 212, 191, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(45, 212, 191, 0.25)';
              }}
            >
              Report Now <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            style={{
              display: 'block',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#ffffff'
            }}
            className="md-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {isOpen && (
        <div style={{
          padding: '1.25rem 1.5rem',
          background: '#042831',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }} className="md-none">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: isActive ? '#2dd4bf' : '#cbd5e1',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: '0.5rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                color: '#032128',
                fontWeight: '700',
                fontSize: '0.95rem',
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '9999px'
              }}
            >
              Report an Incident
            </Link>
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
