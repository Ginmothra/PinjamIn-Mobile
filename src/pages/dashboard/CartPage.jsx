import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (cart.length === 0) return;

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
          notes: notes
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
        <button className="btn-back" onClick={() => navigate(-1)}>←</button>
        <h1>Keranjang Pinjam</h1>
        <p className="muted">Review barang yang akan Anda pinjam</p>
      </header>

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
                    <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <button className="btn-remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-form glass-card">
            <label className="form-label">Catatan Peminjaman (Opsional)</label>
            <textarea 
              className="form-input" 
              placeholder="Contoh: Untuk keperluan praktik RPL..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
            ></textarea>
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
