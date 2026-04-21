import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); 
  const { addToCart, cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/items?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(search);
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Beranda</h1>
        <p className="muted">Cari alat yang ingin dipinjam</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Cari alat..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      {/* Items Grid (2 Column) */}
      {loading ? (
        <div className="loading-state">Memuat alat...</div>
      ) : (
        <div className="items-grid-2col">
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="glass-card item-card-grid" onClick={() => setSelectedItem(item)}>
              <div className="item-img-container">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="item-img" />
                ) : (
                  <div className="item-img-placeholder">📦</div>
                )}
              </div>
              <div className="item-info-grid">
                <h3 className="item-name-grid">{item.name}</h3>
                <span className="item-cat-grid">{item.category}</span>
                <button 
                  className="btn-add-grid"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
                  + Pinjam
                </button>
              </div>
            </div>
          )) : (
            <div className="empty-state" style={{ gridColumn: 'span 2' }}>
              <p>Tidak ada alat tersedia.</p>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
            <div className="modal-img-large">
              {selectedItem.image ? (
                <img src={selectedItem.image} alt={selectedItem.name} />
              ) : (
                <div className="item-img-placeholder-large">📦</div>
              )}
            </div>
            <div className="modal-body">
              <span className="item-category">{selectedItem.category}</span>
              <h2>{selectedItem.name}</h2>
              <p className="item-code">Kode: {selectedItem.code}</p>
              <div className="divider"></div>
              <h4>Deskripsi</h4>
              <p className="modal-desc">{selectedItem.description || 'Tidak ada deskripsi tersedia.'}</p>
              <div className="modal-footer">
                <div className="modal-stock">Stok tersedia: <strong>{selectedItem.stock}</strong></div>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  Tambahkan ke Pinjaman
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="floating-cart">
          <button className="cart-fab" onClick={() => navigate('/dashboard/cart')}>
            🛒 <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      )}
    </div>
  );
}
