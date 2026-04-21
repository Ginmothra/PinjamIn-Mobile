import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GuestGuard, AuthGuard } from './components/Guards';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Placeholder dashboard (ganti dengan halaman Dashboard yang sebenarnya nanti)
const Dashboard = () => {
  return (
    <div style={{ padding: 40, fontFamily: 'Figtree, Inter, sans-serif', background: '#f0f9ff', minHeight: '100vh' }}>
      <h1 style={{ color: '#007dff' }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginTop: 8 }}>Selamat datang! Anda berhasil login.</p>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root ke login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

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

          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
