import React from 'react';

export default function ReturnsPage() {
  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Pengembalian</h1>
        <p className="muted">Riwayat pengembalian barang</p>
      </header>
      
      <div className="empty-state">
        <div className="empty-icon">🔄</div>
        <h3>Belum ada riwayat</h3>
        <p className="muted">Riwayat pengembalian Anda akan muncul di sini.</p>
      </div>
    </div>
  );
}
