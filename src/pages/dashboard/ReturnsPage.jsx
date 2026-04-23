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
  
  // State untuk Kamera
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // Default kamera belakang
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

      // Ambil daftar barang yang siap dikembalikan
      const activeRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/returns/active-loans`, { headers });
      const activeData = await activeRes.json();
      setActiveLoans(activeData.loans || []);

      // Ambil riwayat pengembalian
      const historyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/returns`, { headers });
      const historyData = await historyRes.json();
      setReturnHistory(historyData.returns || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Bersihkan stream saat modal tutup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async (mode = facingMode) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      setMessage({ type: 'error', text: 'Gagal mengakses kamera. Pastikan izin diberikan.' });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (isCameraOpen) {
      startCamera(newMode);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg', 0.8);
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
    setIsCameraOpen(false);
  };

  const closeReturnModal = () => {
    stopCamera();
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
      case 'partial': return <span className="badge badge-pending">Menunggu Cek</span>;
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
                <div className="proof-preview-small" onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${ret.proof_image}`, '_blank')}>
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
              <p className="muted">Wajib mengunggah foto alat yang dikembalikan.</p>
              
              <div className="camera-container glass-card" style={{ marginTop: '20px', padding: '0', overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
                {isCameraOpen ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="camera-overlay">
                      <button className="btn-capture" onClick={capturePhoto}></button>
                      <button className="btn-switch-cam" onClick={switchCamera}>🔄</button>
                      <button className="btn-close-cam" onClick={stopCamera}>✕</button>
                    </div>
                  </>
                ) : photoPreview ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={photoPreview} alt="Preview" className="preview-img-full" />
                    <button className="btn-retake" onClick={() => startCamera()}>📸 Ambil Ulang</button>
                  </div>
                ) : (
                  <div className="upload-options">
                    <button className="btn-option" onClick={() => startCamera()}>
                      <span className="icon">📷</span>
                      <p>Buka Kamera</p>
                    </button>
                    <div className="divider-v"></div>
                    <button className="btn-option" onClick={() => fileInputRef.current.click()}>
                      <span className="icon">🖼️</span>
                      <p>Pilih Galeri</p>
                    </button>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                style={{ display: 'none' }}
              />

              <div className="modal-footer-stacked" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn-primary" 
                  disabled={submitting || !photo}
                  onClick={handleReturnSubmit}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Pengembalian'}
                </button>
                <button 
                  type="button" 
                  className="btn-text-only" 
                  onClick={closeReturnModal}
                  style={{ alignSelf: 'center', fontSize: '14px', color: '#64748b', background: 'none', border: 'none', fontWeight: '600' }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

