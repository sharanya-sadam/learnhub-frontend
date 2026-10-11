import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('learnhub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('learnhub_token');
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.error('Failed to restore user session:', err);
          localStorage.removeItem('learnhub_token');
          localStorage.removeItem('learnhub_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('learnhub_token', data.token);
    setToken(data.token);
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    localStorage.setItem('learnhub_token', data.token);
    setToken(data.token);
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const updated = await authService.getCurrentUser();
      setUser(updated);
      return updated;
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
        isAdmin: user?.role === 'ROLE_ADMIN',
        isInstructor: user?.role === 'ROLE_INSTRUCTOR',
        isStudent: user?.role === 'ROLE_STUDENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
