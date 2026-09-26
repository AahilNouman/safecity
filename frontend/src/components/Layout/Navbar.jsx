import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report', path: '/report' },
    { name: 'Safety Map', path: '/map' },
    { name: 'Community Feed', path: '/feed' },
  ];

  if (isAuthenticated && isAdmin) {
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

            {/* Auth Button or User Profile Badge */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                <div
                  title={user?.email || 'Logged in user'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isAdmin ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'linear-gradient(135deg, #0d9488, #2dd4bf)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {user?.name?.[0]?.toUpperCase() || user?.full_name?.[0]?.toUpperCase() || (isAdmin ? 'A' : 'U')}
                  </div>
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || user?.full_name || (isAdmin ? 'Admin' : 'User')}
                  </span>
                  {isAdmin && (
                    <span style={{ fontSize: '0.625rem', background: 'rgba(225, 29, 72, 0.25)', color: '#fca5a5', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(225, 29, 72, 0.4)' }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#94a3b8',
                    padding: '0.45rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  marginLeft: '0.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                  e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                }}
              >
                <LogIn size={15} color="#2dd4bf" /> Sign In
              </Link>
            )}

            {/* Quick Action Button */}
            <Link
              to="/report"
              style={{
                marginLeft: '0.4rem',
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

            {/* Mobile Auth action */}
            {isAuthenticated ? (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isAdmin ? '#e11d48' : '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}>
                    {user?.name?.[0]?.toUpperCase() || user?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>
                      {user?.name || user?.full_name || 'User'}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {isAdmin ? 'Administrator' : 'Community Member'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                style={{
                  marginTop: '0.25rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  padding: '0.7rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogIn size={16} color="#2dd4bf" /> Sign In / Sign Up
              </Link>
            )}

            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: '0.25rem',
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
