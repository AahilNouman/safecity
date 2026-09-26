import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { ShieldAlert, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@safecity.local');
  const [password, setPassword] = useState('SafeCity@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  // If already logged in as admin, redirect directly to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');

    setLoading(true);
    try {
      const response = await adminLogin(email.trim(), password);
      const token = response?.token || response?.data?.token;
      const adminData = response?.admin || response?.data?.admin || response?.user || response?.data?.user || { role: 'admin' };
      
      if (!token) throw new Error('Authentication token not received');
      
      login(token, { ...adminData, role: 'admin' });
      toast.success('Administrator authenticated successfully!', { icon: '🛡️' });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || 'Invalid administrator credentials';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setEmail('admin@safecity.local');
    setPassword('SafeCity@2026');
    setLoading(true);
    try {
      const response = await adminLogin('admin@safecity.local', 'SafeCity@2026');
      const token = response?.token || response?.data?.token;
      const adminData = response?.admin || response?.data?.admin || { role: 'admin', email: 'admin@safecity.local', name: 'System Administrator' };
      
      if (!token) throw new Error('Token not received');
      
      login(token, { ...adminData, role: 'admin' });
      toast.success('Welcome back, System Administrator!', { icon: '🔑' });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || 'Admin authentication failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #063d4a 0%, #02171c 100%)',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial decorations */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Admin Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(5, 42, 51, 0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Return to Public Link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.825rem',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
        >
          <ArrowLeft size={14} /> Return to Public Safety Platform
        </Link>

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #9f1239 100%)',
            boxShadow: '0 8px 24px rgba(225, 29, 72, 0.4)',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ShieldAlert size={30} color="#ffffff" strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
            Admin Portal Access
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Municipal Incident Verification & Hotspot Intelligence Console
          </p>
        </div>

        {/* If user is logged in as a normal citizen */}
        {isAuthenticated && !isAdmin && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: '#fef08a',
            lineHeight: 1.4
          }}>
            Currently browsing as <strong>{user?.name || user?.full_name || 'Citizen'}</strong>. Enter administrator credentials to elevate permissions.
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@safecity.local"
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
                onFocus={e => e.target.style.borderColor = '#e11d48'}
                onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0' }}>
                Master Key / Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                onFocus={e => e.target.style.borderColor = '#e11d48'}
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
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'} <ArrowRight size={18} />
          </button>
        </form>

        {/* 1-Click Instant Demo Login */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem',
          background: 'rgba(225, 29, 72, 0.08)',
          border: '1px dashed rgba(225, 29, 72, 0.35)',
          borderRadius: '14px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#fda4af', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            <Sparkles size={15} color="#fb7185" />
            Evaluation / Demo Mode
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleInstantDemoLogin}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            <ShieldCheck size={16} color="#fb7185" />
            1-Click Admin Demo Login
          </button>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            Default: <code>admin@safecity.local</code> • <code>SafeCity@2026</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
