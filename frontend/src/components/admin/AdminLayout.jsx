import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Map as MapIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Sidebar (Desktop) */}
      <aside style={{ 
        width: '260px', 
        background: 'var(--navy)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }} className="md-sidebar-fixed">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={28} color="var(--blue)" />
            <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin Portal</span>
          </div>
          <button className="md-none" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white' }}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'var(--blue)' : 'transparent',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s'
              })}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>{admin?.name || 'Administrator'}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{admin?.role || 'Admin'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 'var(--radius)', cursor: 'pointer' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="md-content-margin">
        {/* Top Header (Mobile) */}
        <header className="md-none" style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none' }}>
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: '600' }}>SafeCity Admin</span>
        </header>

        <main style={{ padding: '2rem', flex: 1, overflowX: 'hidden' }}>
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
