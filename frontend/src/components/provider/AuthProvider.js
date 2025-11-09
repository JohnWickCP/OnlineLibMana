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

      // authAPI.login may return a { success: false, status, message } object
      // instead of throwing. Handle that shape here so we keep correct status.
      if (response && response.success === false) {
        const err = new Error(response.message || 'Đăng nhập thất bại');
        err.status = response.status;
        err.response = { data: { message: response.message } };
        throw err;
      }

      // Support different possible shapes returned by authAPI.login
      const authToken = response?.token || response?.data?.result?.token || response?.data?.token || response?.result?.token;
      if (!authToken) {
        const err = new Error('Token không hợp lệ');
        err.response = response;
        throw err;
      }

      const userData = response.user || (response.data && response.data.result && response.data.result.user) || response.data?.user || response.result?.user || { email };

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

      // Normalize a friendly message but preserve original response/code for callers
      const status = error?.response?.status;
      const apiMessage = error?.response?.data?.message || error?.response?.data?.error;

      let message = 'Đăng nhập thất bại';
      if (status === 401) {
        message = 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.';
      } else if (status === 404) {
        message = 'Tài khoản không tồn tại. Vui lòng kiểm tra lại.';
      } else if (error?.code === 'ECONNABORTED') {
        message = 'Kết nối timeout. Vui lòng thử lại.';
      } else if (apiMessage) {
        message = String(apiMessage);
      }

      const err = new Error(message);
      err.status = status;
      err.code = error?.code;
      err.response = error?.response;
      // preserve original error for deeper debugging if needed
      err.original = error;
      err.originalMessage = error?.message;
      throw err;
    }
  };


  const logout = () => {
    // Clear memory state
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false); 

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
    isAuthenticated, 
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