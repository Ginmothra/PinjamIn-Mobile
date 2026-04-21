import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [showFines, setShowFines] = useState(false);
  const [finesHistory, setFinesHistory] = useState([]);
  const [loadingFines, setLoadingFines] = useState(false);

  const fetchFines = async () => {
    if (showFines) return; // Already fetching or fetched
    setLoadingFines(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fines`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setFinesHistory(data.fines || []);
      setShowFines(true);
    } catch (error) {
      console.error('Error fetching fines:', error);
    } finally {
      setLoadingFines(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Profil</h1>
      </header>
      
      <div className="glass-card profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="profile-info">
          <h3>{user?.name || 'User'}</h3>
          <p className="muted">{user?.email || 'user@email.com'}</p>
        </div>
      </div>

      {/* Fine Widget */}
      <div className={`glass-card fine-widget ${showFines ? 'expanded' : ''}`} onClick={() => !showFines ? fetchFines() : setShowFines(false)}>
        <div className="fine-header">
          <div className="fine-summary">
            <span className="fine-icon">💸</span>
            <div>
              <p className="fine-label">Total Denda</p>
              <h4 className={`fine-amount ${user?.unpaid_fines_sum > 0 ? 'text-danger' : 'text-success'}`}>
                Rp {user?.unpaid_fines_sum?.toLocaleString('id-ID') || 0}
              </h4>
            </div>
          </div>
          <button className="expand-btn">{showFines ? '▲' : '▼'}</button>
        </div>

        {showFines && (
          <div className="fine-details animate-fade-in">
            <div className="divider"></div>
            {loadingFines ? (
              <p className="loading-text">Memuat histori...</p>
            ) : finesHistory.length > 0 ? (
              <div className="fine-list">
                {finesHistory.map(fine => (
                  <div key={fine.id} className={`fine-item ${fine.status}`}>
                    <div className="fine-info">
                      <p className="fine-reason">{fine.reason}</p>
                      <p className="fine-date">{new Date(fine.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="fine-status-group">
                      <p className="fine-value">Rp {parseInt(fine.amount).toLocaleString('id-ID')}</p>
                      <span className={`status-badge-mini ${fine.status}`}>
                        {fine.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">Tidak ada histori denda.</p>
            )}
          </div>
        )}
      </div>

      <div className="menu-list">
        <button className="menu-item">
          <span>⚙️</span> Pengaturan Akun
        </button>
        <button className="menu-item logout" onClick={logout}>
          <span>🚪</span> Keluar
        </button>
      </div>
    </div>
  );
}
