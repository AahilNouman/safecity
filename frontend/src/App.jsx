import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            {/* Admin Routes with their own layout */}
            <Route path="/admin/login" element={<AuthPage initialMode="signin" />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="incidents" element={<IncidentQueue />} />
                    <Route path="incidents/:id" element={<IncidentDetail />} />
                    <Route path="hotspots" element={<HotspotAnalysis />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Public Routes with standard Navbar/Footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/report" element={<ReportPage />} />
                    <Route path="/report/confirm/:reportId" element={<ReportConfirmation />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/feed" element={<SafetyFeed />} />
                    <Route path="/login" element={<AuthPage initialMode="signin" />} />
                    <Route path="/signin" element={<AuthPage initialMode="signin" />} />
                    <Route path="/register" element={<AuthPage initialMode="signup" />} />
                    <Route path="/signup" element={<AuthPage initialMode="signup" />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
