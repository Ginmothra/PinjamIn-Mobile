import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setLoans(data.loans || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-pending">Menunggu</span>;
      case 'borrowed': return <span className="badge badge-success">Dipinjam</span>;
      case 'rejected': return <span className="badge badge-danger">Ditolak</span>;
      case 'returned': return <span className="badge badge-info">Dikembalikan</span>;
      case 'completed': return <span className="badge badge-success">Selesai</span>;
      case 'booked': return <span className="badge badge-indigo">Dibooking</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Peminjaman</h1>
        <p className="muted">Pantau status alat yang Anda pinjam</p>
      </header>

      {loading ? (
        <div className="loading-state">Memuat riwayat...</div>
      ) : (
        <div className="loans-list">
          {loans.length > 0 ? loans.map((loan) => (
            <div key={loan.id} className="glass-card loan-card">
              <div className="loan-header">
                <span className="loan-code">{loan.loan_code}</span>
                {getStatusBadge(loan.status)}
              </div>
              
              <div className="loan-body">
                <div className="loan-items-summary">
                  {loan.loan_items.map((li, idx) => (
                    <div key={li.id} className="loan-item-row">
                      <span className="item-qty">{li.quantity}x</span>
                      <span className="item-name">{li.item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="loan-meta">
                  <div className="meta-item">
                    <span className="meta-label">Pinjam:</span>
                    <span className="meta-value">{new Date(loan.loan_date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Kembali:</span>
                    <span className="meta-value">{new Date(loan.due_date).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                {loan.status === 'booked' && loan.verification_code && (
                  <div className="verification-code-box">
                    <span className="code-label">KODE BOOKING</span>
                    <span className="code-value">{loan.verification_code}</span>
                    <p className="code-hint">Tunjukkan kode ini ke petugas saat mengambil barang</p>
                  </div>
                )}

                {loan.status === 'rejected' && loan.reject_reason && (
                  <div className="rejection-box">
                    <strong>Alasan Ditolak:</strong>
                    <p>{loan.reject_reason}</p>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Belum ada peminjaman</h3>
              <p className="muted">Alat yang Anda ajukan akan muncul di sini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
