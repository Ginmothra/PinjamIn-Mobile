import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReturnsPage() {
  const [activeLoans, setActiveLoans] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  
  // State untuk Modal & Foto
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json'
      };

      const [loansRes, historyRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/returns/active-loans`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/returns`, { headers })
      ]);

      const loansData = await loansRes.json();
      const historyData = await historyRes.json();

      setActiveLoans(loansData.loans || []);
      setReturnHistory(historyData.returns || []);
    } catch (error) {
      console.error('Error fetching return data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openReturnModal = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const closeReturnModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setMessage({ type: 'error', text: 'Wajib mengunggah foto bukti pengembalian!' });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('loan_id', selectedLoan.id);
    formData.append('proof_image', photo);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/returns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        closeReturnModal();
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal mengajukan pengembalian.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-pending">Menunggu Cek</span>;
      case 'completed': return <span className="badge badge-success">Selesai</span>;
      case 'rejected': return <span className="badge badge-danger">Bermasalah</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Pengembalian</h1>
        <p className="muted">Kembalikan alat yang sudah selesai dipinjam</p>
      </header>

      {message && (
        <div className={`auth-alert ${message.type === 'success' ? 'auth-alert--success' : ''}`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <div className="section-title">
        <h2>Siap Dikembalikan</h2>
        <span className="count-pill">{activeLoans.length}</span>
      </div>

      {loading ? (
        <div className="loading-state">Memuat data...</div>
      ) : (
        <div className="active-loans-list" style={{ marginBottom: '40px' }}>
          {activeLoans.length > 0 ? activeLoans.map((loan) => (
            <div key={loan.id} className="glass-card loan-card return-ready">
              <div className="loan-header">
                <span className="loan-code">{loan.loan_code}</span>
                <button 
                  className="btn-return-action"
                  onClick={() => openReturnModal(loan)}
                >
                  ↩ Kembalikan
                </button>
              </div>
              <div className="loan-body">
                <div className="loan-items-summary">
                  {loan.loan_items.map((li) => (
                    <div key={li.id} className="loan-item-row">
                      <span className="item-qty">{li.quantity}x</span>
                      <span className="item-name">{li.item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-state-small">
              <p>Tidak ada peminjaman yang aktif.</p>
            </div>
          )}
        </div>
      )}

      <div className="section-title">
        <h2>Riwayat Pengembalian</h2>
      </div>

      <div className="return-history-list">
        {returnHistory.length > 0 ? returnHistory.map((ret) => (
          <div key={ret.id} className="glass-card history-card">
            <div className="history-header">
              <span className="loan-code">{ret.loan.loan_code}</span>
              {getStatusBadge(ret.status)}
            </div>
            <div className="history-body">
              <p className="return-date">Dikembalikan pada: {new Date(ret.return_date).toLocaleDateString('id-ID')}</p>
              {ret.proof_image && (
                <div className="proof-preview-small">
                  <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${ret.proof_image}`} alt="Bukti" />
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="empty-state-small">
            <p>Belum ada riwayat pengembalian.</p>
          </div>
        )}
      </div>

      {/* Modal Pengembalian */}
      {showModal && (
        <div className="modal-overlay" onClick={closeReturnModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <h2>Bukti Pengembalian</h2>
              <p className="muted">Wajib mengunggah foto alat yang dikembalikan untuk bukti fisik.</p>
              
              <form onSubmit={handleReturnSubmit} style={{ marginTop: '20px' }}>
                <div className="photo-upload-area" onClick={() => fileInputRef.current.click()}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="preview-img-full" />
                  ) : (
                    <div className="upload-placeholder">
                      <span style={{ fontSize: '40px' }}>📸</span>
                      <p>Klik untuk Ambil Foto / Pilih Gambar</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  capture="environment"
                />

                <div className="modal-footer" style={{ marginTop: '24px' }}>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submitting || !photo}
                  >
                    {submitting ? 'Mengirim...' : 'Kirim Pengembalian'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={closeReturnModal}
                    style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700' }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
