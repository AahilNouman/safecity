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

  const login = (newToken) => {
    localStorage.setItem('safecity_admin_token', newToken);
    const payloadBase64 = newToken.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    
    setToken(newToken);
    setAdmin(decoded);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('safecity_admin_token');
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
