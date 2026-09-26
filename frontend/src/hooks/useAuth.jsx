import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('safecity_admin_token');
    if (storedToken) {
      try {
        // Simple JWT decode for payload
        const payloadBase64 = storedToken.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decoded = JSON.parse(decodedJson);
        
        // Check expiry
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setAdmin(decoded);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('safecity_admin_token');
        }
      } catch (e) {
        localStorage.removeItem('safecity_admin_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData = null) => {
    localStorage.setItem('safecity_admin_token', newToken);
    try {
      const payloadBase64 = newToken.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      const combined = userData ? { ...decoded, ...userData } : decoded;
      setToken(newToken);
      setAdmin(combined);
      setIsAuthenticated(true);
    } catch (e) {
      setToken(newToken);
      setAdmin(userData || { email: 'user' });
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('safecity_admin_token');
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const isAdmin = Boolean(admin && ['admin', 'moderator', 'SUPER_ADMIN'].includes(admin.role));

  return (
    <AuthContext.Provider value={{ token, admin, user: admin, isAdmin, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
