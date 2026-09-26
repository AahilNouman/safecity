import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle,
  Sparkles
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

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div style={{ position: 'relative', marginLeft: '0.25rem' }} ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: isProfileOpen ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    padding: '0.35rem 0.75rem 0.35rem 0.45rem',
                    borderRadius: '9999px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {user?.avatar || user?.avatar_url ? (
                    <img
                      src={user?.avatar || user?.avatar_url}
                      alt={userDisplayName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isAdmin ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'linear-gradient(135deg, #0d9488, #2dd4bf)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: '700'
                    }}>
                      {userInitial}
                    </div>
                  )}
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '600' }}>
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
                    width: '270px',
                    background: '#042831',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    zIndex: 1010,
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    {/* User Info Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: isAdmin ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'linear-gradient(135deg, #0d9488, #2dd4bf)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        {userInitial}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userDisplayName}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userEmail}
                        </div>
                      </div>
                    </div>

                    {/* Role Pill */}
                    <div style={{ margin: '0.75rem 0' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        background: isAdmin ? 'rgba(225, 29, 72, 0.2)' : 'rgba(45, 212, 191, 0.2)',
                        color: isAdmin ? '#fda4af' : '#5eead4',
                        border: isAdmin ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid rgba(45, 212, 191, 0.4)'
                      }}>
                        <ShieldCheck size={12} />
                        {isAdmin ? 'System Administrator' : 'Verified Citizen'}
                      </span>
                    </div>

                    {/* Quick navigation links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LayoutDashboard size={15} color="#2dd4bf" /> Admin Dashboard
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
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={15} color="#2dd4bf" /> Submit New Report
                      </Link>
                      <Link
                        to="/map"
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <MapPin size={15} color="#2dd4bf" /> Live Safety Map
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div style={{ paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.55rem 0.65rem',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#f87171',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isGuest ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#2dd4bf',
                  background: 'rgba(45, 212, 191, 0.1)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Shield size={12} /> Guest Mode
                </span>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    padding: '0.45rem 0.9rem',
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
                  <LogIn size={14} color="#2dd4bf" /> Sign In
                </Link>
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isAdmin ? '#e11d48' : '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '700'
                  }}>
                    {userInitial}
                  </div>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>
                      {userDisplayName}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
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
            ) : isGuest ? (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                marginTop: '0.5rem'
              }}>
                <span style={{ color: '#2dd4bf', fontSize: '0.85rem', fontWeight: '600' }}>
                  Guest Mode
                </span>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textDecoration: 'none'
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
          .md-none { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
