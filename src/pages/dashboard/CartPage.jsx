import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(''); // State baru untuk tanggal pengembalian
  const [message, setMessage] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    if (!dueDate) {
      setMessage({ type: 'error', text: 'Silakan pilih tanggal pengembalian.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
          notes: notes,
          due_date: dueDate,
          type: isBooking ? 'booking' : 'loan'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        clearCart();
        setTimeout(() => navigate('/dashboard/loans'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghubungi server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Keranjang Pinjam</h1>
        <p className="muted">Review barang yang akan Anda pinjam</p>
      </header>

      {cart.length > 0 && (
        <div className="booking-toggle-card glass-card">
          <div className="toggle-info">
            <span className="icon">📅</span>
            <div>
              <strong>Booking Alat?</strong>
              <p className="muted">Pinjam untuk diambil besok pagi</p>
            </div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isBooking} 
              onChange={(e) => setIsBooking(e.target.checked)} 
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}

      {isBooking && (
        <div className="booking-alert animate-fade">
          <span className="icon">📅</span>
          <div>
            <strong>Mode Booking Aktif</strong>
            <p>Peminjaman ini dijadwalkan untuk: <strong>{new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></p>
          </div>
        </div>
      )}

      {message && (
        <div className={`auth-alert ${message.type === 'success' ? 'auth-alert--success' : ''}`}>
          {message.text}
        </div>
      )}

      {cart.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="glass-card cart-item">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="muted">{item.category}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <span>Jumlah: {item.quantity}</span>
                  </div>
                  <button className="btn-remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-form glass-card">
            <h3>Informasi Peminjaman</h3>
            
            <div className="form-group">
              <label className="form-label">Tanggal Pengembalian</label>
              <input 
                type="date" 
                className="form-input" 
                value={dueDate}
                min={new Date().toISOString().split('T')[0]} // Batasi minimal hari ini
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Catatan Tambahan</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="Contoh: Digunakan untuk praktik di Lab..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ marginTop: '20px' }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Mengirim...' : 'Ajukan Peminjaman'}
          </button>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Keranjang Kosong</h3>
          <p className="muted">Silakan pilih alat di beranda terlebih dahulu.</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
            Lihat Daftar Alat
          </button>
        </div>
      )}
    </div>
  );
}
