// src/hooks/useAuth.js
'use client';

import { useContext } from 'react';
import { AuthContext } from '@/components/providers/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Additional auth-related hooks

export function useRequireAuth(redirectUrl = '/login') {
  const { isAuthenticated, loading } = useAuth();
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  if (!loading && !isAuthenticated() && router) {
    router.push(redirectUrl);
  }

  return { isAuthenticated: isAuthenticated(), loading };
}

export function useRequireAdmin(redirectUrl = '/') {
  const { isAdmin, loading } = useAuth();
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  if (!loading && !isAdmin() && router) {
    router.push(redirectUrl);
  }

  return { isAdmin: isAdmin(), loading };
}