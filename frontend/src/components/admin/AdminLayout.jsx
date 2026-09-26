import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  List,
  Map as MapIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Incident Queue', path: '/admin/incidents', icon: List },
    { name: 'Hotspot Analysis', path: '/admin/hotspots', icon: MapIcon },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1d', color: '#e2e8f0' }}>
      
      {/* Sidebar (Desktop) */}
      <aside style={{ 
        width: '260px', 
        background: '#0f172a', 
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease-in-out',
      }} className="md-sidebar-fixed">
        
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Shield size={17} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
                SafeCity
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#fda4af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Admin Console
              </div>
            </div>
          </Link>
          <button className="md-none" onClick={() => setSidebarOpen(false)} style={{ color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.95rem',
                borderRadius: '8px',
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(13, 148, 136, 0.3)' : '1px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.875rem',
                transition: 'all 0.15s ease'
              })}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}

          {/* Quick link to public site */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                color: '#94a3b8',
                fontSize: '0.8rem',
                textDecoration: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              <ArrowLeft size={14} /> Back to Public Platform
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer with Admin Profile */}
        <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#0a0f1d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || user?.full_name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#fda4af', fontWeight: '600', textTransform: 'uppercase' }}>
                System Officer
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              width: '100%',
              padding: '0.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="md-content-margin">
        {/* Mobile Header */}
        <header className="md-none" style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: '#ffffff' }}>
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>SafeCity Admin Console</span>
        </header>

        {/* Content Body */}
        <main style={{ padding: '2rem 2.5rem', flex: 1, overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-none { display: none !important; }
          .md-sidebar-fixed { transform: translateX(0) !important; }
          .md-content-margin { margin-left: 260px; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
