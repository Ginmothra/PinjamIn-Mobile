import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GuestGuard, AuthGuard } from './components/Guards';

// Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import HomePage from './pages/dashboard/HomePage';
import LoansPage from './pages/dashboard/LoansPage';
import ReturnsPage from './pages/dashboard/ReturnsPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Layout
import MainLayout from './components/layout/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root ke dashboard jika login, atau login jika tidak */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth pages — hanya bisa diakses jika belum login */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestGuard>
                <ForgotPasswordPage />
              </GuestGuard>
            }
          />

          {/* Protected pages — Menggunakan MainLayout dengan Bottom Bar */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            {/* Nested routes di dalam dashboard */}
            <Route index element={<HomePage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
