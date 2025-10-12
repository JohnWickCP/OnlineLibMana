// src/components/providers/AuthProvider.js
'use client';

import { createContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = typeof window !== 'undefined' ? 
        window.localStorage?.getItem('authToken') : null;
      const storedUser = typeof window !== 'undefined' ? 
        window.localStorage?.getItem('user') : null;
      const storedRole = typeof window !== 'undefined' ? 
        window.localStorage?.getItem('userRole') : null;

      if (storedToken && storedUser && storedRole) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, expectedRole = null) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: authToken, user: userData, role: userRole } = response.data;

      // Check if role matches expected role
      if (expectedRole && userRole !== expectedRole) {
        throw new Error(`Access denied. This login is for ${expectedRole} only.`);
      }

      // Store in memory
      setToken(authToken);
      setUser(userData);
      setRole(userRole);

      // Store in localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('authToken', authToken);
        window.localStorage.setItem('user', JSON.stringify(userData));
        window.localStorage.setItem('userRole', userRole);
      }

      return { token: authToken, user: userData, role: userRole };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear memory state
    setToken(null);
    setUser(null);
    setRole(null);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('userRole');
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return role === 'ADMIN';
  };

  const isUser = () => {
    return role === 'USER';
  };

  const value = {
    user,
    token,
    role,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}