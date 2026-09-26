import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Public Pages
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import ReportConfirmation from './pages/ReportConfirmation';
import MapPage from './pages/MapPage';
import SafetyFeed from './pages/SafetyFeed';
import AuthPage from './pages/auth/AuthPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import IncidentQueue from './pages/admin/IncidentQueue';
import IncidentDetail from './pages/admin/IncidentDetail';
import HotspotAnalysis from './pages/admin/HotspotAnalysis';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/Common/ProtectedRoute';

function AppContent() {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#032128',
        color: '#2dd4bf',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(45, 212, 191, 0.2)',
            borderTopColor: '#2dd4bf',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Loading SafeCity Platform...</div>
        </div>
      </div>
    );
  }

  // Routes that bypass citizen landing gate
  const isAuthOrAdminRoute = [
    '/login', '/signin', '/register', '/signup',
    '/admin'
  ].some(route => location.pathname === route || location.pathname.startsWith(route + '/'));

  const isAllowedWithoutAuth = isAuthenticated || isGuest || isAuthOrAdminRoute;

  return (
    <div className="app-container">
      <Routes>
        {/* Dedicated Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Shortcut /admin -> /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="incidents" element={<IncidentQueue />} />
                <Route path="incidents/:id" element={<IncidentDetail />} />
                <Route path="hotspots" element={<HotspotAnalysis />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Dedicated Citizen Auth Routes (no public navbar) */}
        <Route path="/login" element={<AuthPage initialMode="signin" />} />
        <Route path="/signin" element={<AuthPage initialMode="signin" />} />
        <Route path="/register" element={<AuthPage initialMode="signup" />} />
        <Route path="/signup" element={<AuthPage initialMode="signup" />} />

        {/* Main Application Routes */}
        <Route path="/*" element={
          !isAllowedWithoutAuth ? (
            // Professional pre-website landing gate
            <AuthPage initialMode="signin" />
          ) : (
            <>
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/report/confirm/:reportId" element={<ReportConfirmation />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/feed" element={<SafetyFeed />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </>
          )
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
