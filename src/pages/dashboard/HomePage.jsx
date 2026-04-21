import React from 'react';

export default function HomePage() {
  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Beranda</h1>
        <p className="muted">Selamat datang di PinjamIn Mobile</p>
      </header>
      
      <div className="stats-grid">
        <div className="glass-card">
          <span className="stat-value">12</span>
          <span className="stat-label">Barang Tersedia</span>
        </div>
        <div className="glass-card">
          <span className="stat-value">3</span>
          <span className="stat-label">Pinjaman Aktif</span>
        </div>
      </div>
    </div>
  );
}
