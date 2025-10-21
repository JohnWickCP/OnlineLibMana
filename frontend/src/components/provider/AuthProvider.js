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

  // Check if user is already logged in on mount
  useEffect(() => {
  const initAuth = () => {
    const storedToken = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user') 
      : null;

    // ✅ Chỉ cần token và user
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole('USER');
        setIsAuthenticated(true);
        console.log('✅ Auth restored from localStorage');
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  initAuth();
}, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      const authToken = response.token;
      if (!authToken) throw new Error('Token không hợp lệ');

      const userData = response.user;

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return { token: authToken, user: userData };
    } catch (error) {
      setIsAuthenticated(false);
      
      // ✅ Throw error với thông tin chi tiết hơn
      if (error.response?.status === 401) {
        throw new Error('Email hoặc mật khẩu không chính xác');
      } else if (error.response?.status === 404) {
        throw new Error('Tài khoản không tồn tại');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối timeout');
      } else {
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
      }
    }
  };


  const logout = () => {
    // Clear memory state
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false); // ✅ Set false khi logout

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
    isAuthenticated, // ✅ Giờ đây là boolean, không phải function
    login,
    logout,
    updateUser,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}