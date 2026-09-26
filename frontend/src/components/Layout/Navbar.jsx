import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  FileText,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isGuest, user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report', path: '/report' },
    { name: 'Safety Map', path: '/map' },
    { name: 'Community Feed', path: '/feed' },
  ];

  if (isAuthenticated && isAdmin) {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin/dashboard' });
  }

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.full_name?.[0]?.toUpperCase() || (isAdmin ? 'A' : 'U');
  const userDisplayName = user?.name || user?.full_name || (isAdmin ? 'Administrator' : 'Citizen');
  const userEmail = user?.email || '';

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(10, 15, 29, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.25rem' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <Shield size={19} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                SafeCity
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: '600', color: '#14b8a6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Safety Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="md-flex">
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
                    fontSize: '0.9rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
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

            {/* Profile Dropdown / Auth CTA */}
            {isAuthenticated ? (
              <div style={{ position: 'relative', marginLeft: '0.5rem' }} ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: isProfileOpen ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    padding: '0.35rem 0.75rem 0.35rem 0.45rem',
                    borderRadius: '8px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {user?.avatar || user?.avatar_url ? (
                    <img
                      src={user?.avatar || user?.avatar_url}
                      alt={userDisplayName}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isAdmin ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'linear-gradient(135deg, #0d9488, #14b8a6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {userInitial}
                    </div>
                  )}
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: '600' }}>
                    {userDisplayName}
                  </span>
                  <ChevronDown size={14} color="#94a3b8" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Profile Floating Dropdown Card */}
                {isProfileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.6rem)',
                    right: 0,
                    width: '260px',
                    background: '#10192d',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                    padding: '1rem',
                    zIndex: 1010
                  }}>
                    {/* User Info Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isAdmin ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'linear-gradient(135deg, #0d9488, #14b8a6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        flexShrink: 0
                      }}>
                        {userInitial}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userDisplayName}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userEmail}
                        </div>
                      </div>
                    </div>

                    {/* Role Pill */}
                    <div style={{ margin: '0.65rem 0' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        background: isAdmin ? 'rgba(225, 29, 72, 0.15)' : 'rgba(13, 148, 136, 0.15)',
                        color: isAdmin ? '#fda4af' : '#5eead4',
                        border: isAdmin ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(13, 148, 136, 0.3)'
                      }}>
                        <ShieldCheck size={12} />
                        {isAdmin ? 'System Administrator' : 'Verified Citizen'}
                      </span>
                    </div>

                    {/* Quick navigation links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.65rem' }}>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '6px',
                            color: '#e2e8f0',
                            fontSize: '0.85rem',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LayoutDashboard size={15} color="#14b8a6" /> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/report"
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '6px',
                          color: '#e2e8f0',
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={15} color="#14b8a6" /> Submit Report
                      </Link>
                      <Link
                        to="/map"
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '6px',
                          color: '#e2e8f0',
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <MapPin size={15} color="#14b8a6" /> Safety Map
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#f87171',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isGuest ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#14b8a6',
                  background: 'rgba(13, 148, 136, 0.1)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(13, 148, 136, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Shield size={12} /> Guest
                </span>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                >
                  <LogIn size={14} color="#14b8a6" /> Sign In
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  marginLeft: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                <LogIn size={14} color="#14b8a6" /> Sign In
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
                background: '#0d9488',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.85rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0f766e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0d9488';
                e.currentTarget.style.transform = 'translateY(0)';
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

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          padding: '1.25rem 1.5rem',
          background: '#0a0f1d',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }} className="md-none">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: isActive ? '#14b8a6' : '#94a3b8',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.95rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    background: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
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
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isAdmin ? '#e11d48' : '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}>
                    {userInitial}
                  </div>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600' }}>
                      {userDisplayName}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                      {isAdmin ? 'Administrator' : 'Verified Citizen'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.775rem',
                    fontWeight: '600'
                  }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : isGuest ? (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}>
                <span style={{ color: '#14b8a6', fontSize: '0.85rem', fontWeight: '600' }}>
                  Guest Mode
                </span>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: '600'
                  }}
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                style={{
                  marginTop: '0.25rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogIn size={15} color="#14b8a6" /> Sign In / Sign Up
              </Link>
            )}

            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: '0.25rem',
                textAlign: 'center',
                background: '#0d9488',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '0.7rem',
                borderRadius: '8px'
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
