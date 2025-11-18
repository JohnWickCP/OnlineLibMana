// (nếu file của bạn nằm ở một path khác, áp dụng tương tự)
'use client';

import { createContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export const AuthContext = createContext(null);

function setCookie(name, value, options = {}) {
  // options: { days, secure }
  let cookieStr = `${name}=${encodeURIComponent(value)}; path=/;`;
  if (options.days) {
    const d = new Date();
    d.setTime(d.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookieStr += ` expires=${d.toUTCString()};`;
  }
  // In production we usually want Secure and SameSite=None for cross-site cookies
  if (options.secure) {
    cookieStr += ' Secure;';
    // If your app is cross-site (frontend different origin), set SameSite=None
    cookieStr += ' SameSite=None;';
  } else {
    // keep default SameSite=Lax (or omit)
  }
  document.cookie = cookieStr;
}

function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = typeof window !== 'undefined' && localStorage.getItem('authToken');
      const storedUser = typeof window !== 'undefined' && localStorage.getItem('user');
      const storedRole = typeof window !== 'undefined' && localStorage.getItem('userRole');

      if (storedToken && storedUser && storedRole) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
        setIsAuthenticated(true);

        // Also ensure cookies exist for middleware (useful after page refresh)
        // Set cookies only if missing
        if (typeof document !== 'undefined') {
          const hasAuthCookie = document.cookie.includes('auth_token=');
          const hasRoleCookie = document.cookie.includes('user_role=');
          const secureFlag = process.env.NODE_ENV === 'production';
          if (!hasAuthCookie) setCookie('auth_token', storedToken, { days: 7, secure: secureFlag });
          if (!hasRoleCookie) setCookie('user_role', storedRole, { days: 7, secure: secureFlag });
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
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

      // --- NEW: set cookies that Next.js middleware reads ---
      // Note: middleware expects cookie names 'auth_token' and 'user_role'
      const secureFlag = process.env.NODE_ENV === 'production';
      setCookie('auth_token', authToken, { days: 7, secure: secureFlag });
      setCookie('user_role', userRole, { days: 7, secure: secureFlag });
      // ------------------------------------------------------

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

    // --- NEW: remove cookies so middleware won't see them anymore ---
    deleteCookie('auth_token');
    deleteCookie('user_role');
    // --------------------------------------------------------------
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;