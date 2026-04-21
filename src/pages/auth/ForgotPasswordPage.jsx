import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/api';
import logo from '../../assets/logo.png';
import '../../styles/auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email wajib diisi.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Format email tidak valid.'); return; }

    setLoading(true);
    setError('');
    setStatus('');
    try {
      const res = await authService.forgotPassword(email);
      setStatus(res.message || 'Link reset password telah dikirimkan ke email Anda. Silakan cek kotak masuk Anda.');
      setEmail('');
    } catch (err) {
      if (err.errors?.email) {
        setError(err.errors.email[0]);
      } else {
        setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <img src={logo} alt="PinjamIn" />
          <span className="auth-logo-text">PinjamIn</span>
        </div>

        {/* Card */}
        <div className="auth-card">
          <h1 className="auth-title">Lupa Password</h1>
          <p className="auth-subtitle">
            Masukkan email Anda dan kami akan mengirimkan link untuk mereset password Anda.
          </p>

          {/* Success status */}
          {status && (
            <div className="auth-alert auth-alert--success">
              <span>✓</span> {status}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="auth-alert">
              <span>⚠</span> {error}
            </div>
          )}

          {!status && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={`form-input ${error ? 'is-error' : ''}`}
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                id="forgot-password-submit-btn"
              >
                {loading ? (
                  <span className="btn-spinner">
                    <span className="spinner"></span> Mengirim...
                  </span>
                ) : 'Kirim Link Reset'}
              </button>
            </form>
          )}

          <div className="auth-back-link">
            <Link to="/login" className="auth-link">
              ← Kembali ke halaman masuk
            </Link>
          </div>
        </div>

        <p className="auth-footer">
          &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}
        </p>
      </div>
    </div>
  );
}
