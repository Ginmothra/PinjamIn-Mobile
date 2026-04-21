import React from 'react';

export default function LoansPage() {
  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Peminjaman</h1>
        <p className="muted">Daftar pengajuan peminjaman Anda</p>
      </header>
      
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>Belum ada peminjaman</h3>
        <p className="muted">Anda belum melakukan peminjaman barang saat ini.</p>
      </div>
    </div>
  );
}
