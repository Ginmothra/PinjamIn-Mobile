import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Jika sudah login, redirect ke /dashboard
export const GuestGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-loading">Memuat...</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Jika belum login, redirect ke /login
export const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-loading">Memuat...</div>;
  return user ? children : <Navigate to="/login" replace />;
};
