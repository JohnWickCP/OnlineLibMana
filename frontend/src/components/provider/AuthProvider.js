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

  // Restore auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
       const response = await authAPI.login({ email, password });

    const authToken = response.token;
    const userRole = response.role;
    const userObject = { email };

    // Set state
    setToken(authToken);
    setRole(userRole);
    setUser(userObject);
    setIsAuthenticated(true);

    // Lưu localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('user', JSON.stringify(userObject));

    return { token: authToken, role: userRole };
    } catch (error) {
       if (error.message === 'User not existed') {
    alert('Người dùng không tồn tại. Vui lòng đăng ký trước.');
  } else if (error.message === 'Password incorrect') {
    alert('Mật khẩu không đúng.');
  } else {
    alert(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
  }
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
