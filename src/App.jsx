import React from 'react';

function App() {
  return (
    <div className="app-container">
      <header className="animate-fade" style={{ marginTop: '40px' }}>
        <div className="hero-icon">📦</div>
        <h1>PinjamIn</h1>
        <p className="muted">Solusi cerdas manajemen peminjaman barang Anda.</p>
      </header>

      <main style={{ marginTop: '32px' }}>
        <div className="glass-card animate-fade" style={{ animationDelay: '0.1s' }}>
          <h3>Aktivitas Terbaru</h3>
          <p className="muted" style={{ marginTop: '4px' }}>Pantau status barang yang Anda pinjam.</p>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">Barang Dipinjam</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">3</span>
              <span className="stat-label">Terlambat</span>
            </div>
          </div>
        </div>

        <div className="glass-card animate-fade" style={{ animationDelay: '0.2s' }}>
          <h3>Pinjam Barang Baru</h3>
          <p className="muted" style={{ marginTop: '4px', marginBottom: '20px' }}>
            Cari barang yang tersedia di gudang kami sekarang.
          </p>
          <button className="btn-primary">Mulai Meminjam</button>
        </div>

        <div className="glass-card animate-fade" style={{ animationDelay: '0.3s' }}>
          <h3>Riwayat</h3>
          <div style={{ marginTop: '16px' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i === 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>Projector Epson X41</div>
                  <div className="muted" style={{ fontSize: '12px' }}>20 April 2026</div>
                </div>
                <div style={{ 
                  backgroundColor: '#10b98122', 
                  color: '#10b981', 
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Selesai
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="muted" style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
        &copy; 2026 PinjamIn Mobile. Dibuat dengan ❤️ untuk kemudahan Anda.
      </footer>
    </div>
  );
}

export default App;
