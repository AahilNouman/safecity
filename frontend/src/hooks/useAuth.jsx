import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('safecity_admin_token');
    const storedGuest = localStorage.getItem('safecity_guest') === 'true';

    if (storedToken) {
      try {
        const payloadBase64 = storedToken.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decoded = JSON.parse(decodedJson);
        
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setAdmin(decoded);
          setIsAuthenticated(true);

          // Fetch full profile in background to get latest emergency contact
          getMe().then(res => {
            if (res && res.data) {
              setAdmin(prev => ({ ...prev, ...res.data }));
            }
          }).catch(() => {});
        } else {
          localStorage.removeItem('safecity_admin_token');
        }
      } catch (e) {
        localStorage.removeItem('safecity_admin_token');
      }
    } else if (storedGuest) {
      setIsGuest(true);
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData = null) => {
    localStorage.setItem('safecity_admin_token', newToken);
    localStorage.removeItem('safecity_guest');
    setIsGuest(false);
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

  const updateUserData = (updatedFields) => {
    setAdmin(prev => ({ ...prev, ...updatedFields }));
  };

  const continueAsGuest = () => {
    localStorage.setItem('safecity_guest', 'true');
    setIsGuest(true);
  };

  const logout = () => {
    localStorage.removeItem('safecity_admin_token');
    localStorage.removeItem('safecity_guest');
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  const isAdmin = Boolean(admin && ['admin', 'moderator', 'SUPER_ADMIN'].includes(admin.role));

  return (
    <AuthContext.Provider value={{
      token,
      admin,
      user: admin,
      isAdmin,
      isAuthenticated,
      isGuest,
      continueAsGuest,
      login,
      logout,
      updateUserData,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
