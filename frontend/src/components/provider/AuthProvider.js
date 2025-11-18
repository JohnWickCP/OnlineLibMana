'use client';

import { createContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole || null);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      // Lấy token từ API
      const authToken =
        response?.result?.token ||
        response?.data?.result?.token ||
        response?.token;

      if (!authToken) throw new Error("Token không hợp lệ");

      // Lấy role từ API
      const userRole =
        response?.result?.role ||
        response?.data?.result?.role ||
        null;

      if (!userRole) throw new Error("Role không hợp lệ");

      // Set state
      setToken(authToken);
      setRole(userRole);
      setUser({ email });

      setIsAuthenticated(true);

      // Save localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('user', JSON.stringify({ email }));

      return { token: authToken, role: userRole };
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated,
    login,
    logout,
    isAdmin: () => role === 'ADMIN',
    isUser: () => role === 'USER',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
