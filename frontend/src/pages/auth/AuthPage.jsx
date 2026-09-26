import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userLogin, userRegister, googleAuth } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Cpu,
  MapPin,
  Check,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const AuthPage = ({ initialMode = 'signin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, continueAsGuest } = useAuth();

  // Route awareness
  const isRegisterRoute = location.pathname === '/register' || location.pathname === '/signup';
  const [mode, setMode] = useState(isRegisterRoute || initialMode === 'signup' ? 'signup' : 'signin');

  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login' || location.pathname === '/signin') {
      setMode('signin');
    }
  }, [location.pathname]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Form states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToPledge, setAgreedToPledge] = useState(true);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isGoogleCustomOpen, setIsGoogleCustomOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || (isAdmin ? '/admin/dashboard' : '/');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#64748b' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 50, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 75, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 100, label: 'Strong', color: '#10b981' };
      default:
        return { score: 15, label: 'Very Weak', color: '#ef4444' };
    }
  };

  const passwordStrength = getPasswordStrength(registerPassword);

  // Handle Sign In Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      return toast.error('Please enter your email and password');
    }

    setLoading(true);
    try {
      const response = await userLogin(loginEmail, loginPassword);
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (!token) throw new Error('Authentication token not received');

      login(token, user);
      toast.success(`Welcome back, ${user?.full_name || 'User'}!`);

      if (user?.role === 'admin' || user?.role === 'moderator' || user?.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || 'Invalid email or password';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) return toast.error('Please enter your full name');
    if (!registerEmail.trim()) return toast.error('Please enter a valid email');
    if (!registerPassword) return toast.error('Please enter a password');
    if (registerPassword.length < 6) return toast.error('Password must be at least 6 characters long');
    if (registerPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (!agreedToPledge) return toast.error('Please accept the community safety pledge');

    setLoading(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        phone: phone.trim() || undefined,
        emergency_contact: emergencyContact.trim() || undefined
      };

      const response = await userRegister(payload);
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (!token) throw new Error('Registration succeeded but token was missing');

      login(token, user);
      toast.success('Account created successfully! Welcome to SafeCity.');
      navigate('/', { replace: true });
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Action
  const handleGoogleSignIn = async (selectedEmail, selectedName, avatar) => {
    setGoogleLoading(true);
    try {
      const response = await googleAuth({
        email: selectedEmail,
        name: selectedName,
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedName)}`
      });

      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (!token) throw new Error('Google authentication token missing');

      login(token, user);
      setShowGoogleModal(false);
      toast.success(`Signed in as ${user?.full_name || selectedName} via Google!`);

      if (user?.role === 'admin' || user?.role === 'moderator' || user?.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || 'Google sign-in failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Continue as Guest bypass
  const handleGuestBypass = () => {
    continueAsGuest();
    toast.success('Browsing in Anonymous Guest Mode. Your reports remain 100% private.', { icon: '🛡️' });
    navigate('/', { replace: true });
  };

  // Quick Demo fill for Admin
  const fillAdminCredentials = () => {
    setMode('signin');
    setLoginEmail('admin@safecity.local');
    setLoginPassword('SafeCity@2026');
    toast('Admin credentials pre-filled!', { icon: '🔑' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #04252d 0%, #02171c 100%)',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45, 212, 191, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '15%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Split-Screen Container */}
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        minHeight: '680px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        background: 'rgba(5, 38, 46, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '28px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        zIndex: 2
      }}>
        {/* ════════════════════ LEFT HERO BRANDING PANEL ════════════════════ */}
        <div style={{
          padding: '3rem 2.5rem',
          background: 'linear-gradient(145deg, rgba(6, 47, 57, 0.95) 0%, rgba(3, 26, 32, 0.95) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Subtle grid pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: 'radial-gradient(#2dd4bf 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }} />

          <div>
            {/* Brand Logo & Security Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(13, 148, 136, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Shield size={24} color="#ffffff" strokeWidth={2.4} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
                  SafeCity
                </h1>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#2dd4bf', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Enterprise Safety Network
                </span>
              </div>
            </div>

            {/* Hero Pitch */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(45, 212, 191, 0.12)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                color: '#2dd4bf',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}>
                <Sparkles size={13} />
                Smart Community Defense
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '1rem'
              }}>
                Empowering women through spatial intelligence & verified reporting.
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                A community-driven platform providing real-time incident auditing, AI threat categorization, and predictive hotspot deterrence.
              </p>
            </div>

            {/* 3 Value Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(45, 212, 191, 0.12)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={18} color="#2dd4bf" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem', fontWeight: '700' }}>
                    Zero-PII Anonymous Protection
                  </h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.4 }}>
                    Reports strip personal identifiers and randomize coordinates for absolute privacy.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Cpu size={18} color="#60a5fa" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem', fontWeight: '700' }}>
                    DistilBERT NLP Severity Engine
                  </h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.4 }}>
                    Automated sub-50ms severity classification preventing false reports and prioritizing emergency response.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} color="#facc15" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem', fontWeight: '700' }}>
                    DBSCAN Spatial Hotspot Mapping
                  </h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.4 }}>
                    Dynamic density clustering computes safe routes and pinpoints poorly-lit danger zones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.75rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2dd4bf' }}>55+</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Clusters Mapped</div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8' }}>&lt;50ms</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>AI Inference</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399' }}>100%</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Zero-PII</div>
            </div>
          </div>
        </div>

        {/* ════════════════════ RIGHT INTERACTIVE AUTH PANEL ════════════════════ */}
        <div style={{
          padding: '2.5rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(4, 30, 37, 0.75)'
        }}>
          <div>
            {/* Header info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
                {mode === 'signin' ? 'Sign in to SafeCity' : 'Create your account'}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                {mode === 'signin'
                  ? 'Access verified civic incident maps and community protection'
                  : 'Join verified citizens contributing to municipal safety in Bengaluru'}
              </p>
            </div>

            {/* Official Google Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#1e293b',
                fontWeight: '600',
                fontSize: '0.925rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Google 4-color SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.64v3.02h3.88c2.27-2.09 3.66-5.17 3.66-9.1z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.12C3.27 21.43 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.59H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.41l4.03-3.12z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.59l4.03 3.12c.95-2.83 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1.25rem 0',
              color: '#64748b',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span style={{ padding: '0 0.85rem' }}>or continue with email</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Segmented Mode Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '1.25rem'
            }}>
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{
                  padding: '0.5rem 0',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: mode === 'signin' ? '700' : '500',
                  fontSize: '0.85rem',
                  color: mode === 'signin' ? '#032128' : '#94a3b8',
                  background: mode === 'signin' ? 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)' : 'transparent',
                  boxShadow: mode === 'signin' ? '0 2px 8px rgba(45, 212, 191, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  padding: '0.5rem 0',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: mode === 'signup' ? '700' : '500',
                  fontSize: '0.85rem',
                  color: mode === 'signup' ? '#032128' : '#94a3b8',
                  background: mode === 'signup' ? 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)' : 'transparent',
                  boxShadow: mode === 'signup' ? '0 2px 8px rgba(45, 212, 191, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Create Account
              </button>
            </div>

            {/* ════════════════════ SIGN IN FORM ════════════════════ */}
            {mode === 'signin' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Email Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="name@domain.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem 0.65rem 2.4rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e2e8f0' }}>
                      Password
                    </label>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 2.4rem 0.65rem 2.4rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '0.2rem'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Options */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#2dd4bf' }}
                    />
                    Remember this device
                  </label>
                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2dd4bf',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Admin Demo Access?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                    color: '#032128',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(45, 212, 191, 0.3)',
                    transition: 'all 0.2s ease',
                    marginTop: '0.25rem'
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* ════════════════════ SIGN UP FORM ════════════════════ */
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem 0.6rem 2.3rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={e => setRegisterEmail(e.target.value)}
                      placeholder="name@domain.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem 0.6rem 2.3rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
                    />
                  </div>
                </div>

                {/* Phone & Emergency No */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                      Mobile (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91..."
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.6rem 0.55rem 2.1rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.825rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                      Emergency SOS No.
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={14} color="#2dd4bf" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        value={emergencyContact}
                        onChange={e => setEmergencyContact(e.target.value)}
                        placeholder="Guardian phone"
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.6rem 0.55rem 2.1rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.825rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={e => setRegisterPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        required
                        style={{
                          width: '100%',
                          padding: '0.55rem 1.8rem 0.55rem 2.1rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.825rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.4rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                      Confirm
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat"
                        required
                        style={{
                          width: '100%',
                          padding: '0.55rem 1.8rem 0.55rem 2.1rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.825rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.4rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {registerPassword && (
                  <div style={{ marginTop: '-0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Password Strength:</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${passwordStrength.score}%`,
                        background: passwordStrength.color,
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* Community Safety Pledge */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', marginTop: '0.2rem' }}>
                  <input
                    type="checkbox"
                    checked={agreedToPledge}
                    onChange={e => setAgreedToPledge(e.target.checked)}
                    style={{ marginTop: '0.15rem', accentColor: '#2dd4bf' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.3 }}>
                    I pledge to uphold community safety, submit genuine reports, and respect bystander privacy.
                  </span>
                </label>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                    color: '#032128',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(45, 212, 191, 0.3)',
                    transition: 'all 0.2s ease',
                    marginTop: '0.25rem'
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>

          {/* ════════════════════ GUEST BYPASS & FOOTER ════════════════════ */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: '700', color: '#ffffff' }}>
                  Need to report an urgent incident?
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Skip registration to report anonymously or view public maps
                </div>
              </div>
              <button
                type="button"
                onClick={handleGuestBypass}
                style={{
                  background: 'rgba(45, 212, 191, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  color: '#2dd4bf',
                  fontSize: '0.775rem',
                  fontWeight: '700',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(45, 212, 191, 0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(45, 212, 191, 0.15)';
                }}
              >
                Continue as Guest →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════ GOOGLE ACCOUNT CHOOSER MODAL ════════════════════ */}
      {showGoogleModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            padding: '2rem',
            color: '#1f2937',
            position: 'relative',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Close */}
            <button
              onClick={() => setShowGoogleModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <X size={20} />
            </button>

            {/* Google Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" style={{ marginBottom: '0.75rem' }}>
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.64v3.02h3.88c2.27-2.09 3.66-5.17 3.66-9.1z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.12C3.27 21.43 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.59H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.41l4.03-3.12z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.59l4.03 3.12c.95-2.83 3.6-4.96 6.72-4.96z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>
                Sign in with Google
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                to continue to <strong style={{ color: '#0d9488' }}>SafeCity Protection Network</strong>
              </p>
            </div>

            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {/* Account 1 */}
              <div
                onClick={() => !googleLoading && handleGoogleSignIn('aahilnouman@gmail.com', 'Aahil Nouman')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  cursor: googleLoading ? 'wait' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d9488, #2dd4bf)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}>
                  A
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111827' }}>Aahil Nouman</div>
                  <div style={{ fontSize: '0.775rem', color: '#6b7280' }}>aahilnouman@gmail.com</div>
                </div>
                <ExternalLink size={16} color="#9ca3af" />
              </div>

              {/* Account 2 */}
              <div
                onClick={() => !googleLoading && handleGoogleSignIn('priya.sharma@gmail.com', 'Priya Sharma')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  cursor: googleLoading ? 'wait' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}>
                  P
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111827' }}>Priya Sharma</div>
                  <div style={{ fontSize: '0.775rem', color: '#6b7280' }}>priya.sharma@gmail.com</div>
                </div>
                <ExternalLink size={16} color="#9ca3af" />
              </div>

              {/* Custom Google Account toggle */}
              {!isGoogleCustomOpen ? (
                <button
                  type="button"
                  onClick={() => setIsGoogleCustomOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    textAlign: 'left'
                  }}
                >
                  + Use another Google account
                </button>
              ) : (
                <div style={{
                  padding: '0.85rem',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={e => setCustomGoogleName(e.target.value)}
                    placeholder="Your Name (e.g. Maya Rao)"
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={e => setCustomGoogleEmail(e.target.value)}
                    placeholder="Your Google Email (@gmail.com)"
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    disabled={!customGoogleEmail || googleLoading}
                    onClick={() => handleGoogleSignIn(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0])}
                    style={{
                      padding: '0.55rem',
                      background: '#1d4ed8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {googleLoading ? 'Signing in...' : 'Sign in with this Google Account'}
                  </button>
                </div>
              )}
            </div>

            {/* Privacy notice */}
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', textAlign: 'center', margin: 0, lineHeight: 1.4 }}>
              To continue, Google will share your name and email address with SafeCity. Before using this app, review SafeCity's Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
