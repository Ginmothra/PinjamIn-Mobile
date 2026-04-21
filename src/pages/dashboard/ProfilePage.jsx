import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

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
