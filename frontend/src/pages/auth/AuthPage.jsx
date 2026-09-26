import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userLogin, userRegister } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Lock, Mail, User, Phone, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const AuthPage = ({ initialMode = 'signin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();

  // Mode: 'signin' | 'signup'
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

  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToPledge, setAgreedToPledge] = useState(true);

  const from = location.state?.from?.pathname || (isAdmin ? '/admin/dashboard' : '/');

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

  // Quick Demo fill for Admin
  const fillAdminCredentials = () => {
    setLoginEmail('admin@safecity.local');
    setLoginPassword('SafeCity@2026');
    toast('Admin credentials pre-filled!', { icon: '🔑' });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 4.5rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #063d4a 0%, #032128 75%)',
      padding: '2.5rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial glow decorations */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45, 212, 191, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Auth Container Card */}
      <div style={{
        width: '100%',
        maxWidth: mode === 'signup' ? '500px' : '440px',
        background: 'rgba(5, 42, 51, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '24px',
        padding: '2.25rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s ease'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
            boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Shield size={28} color="#ffffff" strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
            {mode === 'signin' ? 'Welcome Back' : 'Join SafeCity'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            {mode === 'signin' 
              ? 'Sign in to access community safety intelligence' 
              : 'Create an account to protect and empower your community'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => setMode('signin')}
            style={{
              padding: '0.6rem 0',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: mode === 'signin' ? '700' : '500',
              fontSize: '0.9rem',
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
              padding: '0.6rem 0',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: mode === 'signup' ? '700' : '500',
              fontSize: '0.9rem',
              color: mode === 'signup' ? '#032128' : '#94a3b8',
              background: mode === 'signup' ? 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)' : 'transparent',
              boxShadow: mode === 'signup' ? '0 2px 8px rgba(45, 212, 191, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* ════════════════════ SIGN IN FORM ════════════════════ */}
        {mode === 'signin' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                color: '#032128',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(45, 212, 191, 0.35)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>

            {/* Quick Demo Credentials shortcut */}
            <div style={{
              background: 'rgba(45, 212, 191, 0.08)',
              border: '1px dashed rgba(45, 212, 191, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="#2dd4bf" />
                <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Evaluating as Administrator?</span>
              </div>
              <button
                type="button"
                onClick={fillAdminCredentials}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#2dd4bf',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Fill Admin Demo
              </button>
            </div>
          </form>
        ) : (
          /* ════════════════════ SIGN UP FORM ════════════════════ */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>
            </div>

            {/* Phone & Emergency Contact (2 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                  Mobile (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765..."
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                  Emergency No.
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#2dd4bf" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                    placeholder="Guardian phone"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password (2 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 2rem 0.7rem 2.3rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.2rem'
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                  Confirm
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 2rem 0.7rem 2.3rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.2rem'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Community Safety Pledge */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', marginTop: '0.25rem' }}>
              <input
                type="checkbox"
                checked={agreedToPledge}
                onChange={e => setAgreedToPledge(e.target.checked)}
                style={{ marginTop: '0.2rem', accentColor: '#2dd4bf', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.775rem', color: '#94a3b8', lineHeight: 1.4 }}>
                I pledge to contribute responsibly to community safety and support verified reporting.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                color: '#032128',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(45, 212, 191, 0.35)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Footer switch prompt */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {mode === 'signin' ? (
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
              New to SafeCity?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2dd4bf',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.875rem'
                }}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2dd4bf',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.875rem'
                }}
              >
                Sign in to your account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
