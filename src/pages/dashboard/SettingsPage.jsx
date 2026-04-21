import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    kelas: user?.kelas || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        setUser(data.user);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        }));
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal memperbarui profil.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>←</button>
        <h1>Pengaturan Akun</h1>
        <p className="muted">Perbarui informasi profil Anda</p>
      </header>

      {message && (
        <div className={`auth-alert ${message.type === 'success' ? 'auth-alert--success' : ''}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card animate-fade-in">
        <div className="form-group">
          <label>Email</label>
          <input type="text" value={user?.email} disabled className="input-disabled" />
          <small className="muted">Email tidak dapat diubah</small>
        </div>

        <div className="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Kelas</label>
          <input 
            type="text" 
            value={formData.kelas} 
            onChange={(e) => setFormData({...formData, kelas: e.target.value})}
            required
          />
        </div>

        <div className="divider"></div>
        <p className="form-section-title">Ganti Password (Opsional)</p>

        <div className="form-group">
          <label>Password Saat Ini</label>
          <input 
            type="password" 
            value={formData.current_password} 
            onChange={(e) => setFormData({...formData, current_password: e.target.value})}
            placeholder="Masukkan password lama"
          />
        </div>

        <div className="form-group">
          <label>Password Baru</label>
          <input 
            type="password" 
            value={formData.new_password} 
            onChange={(e) => setFormData({...formData, new_password: e.target.value})}
            placeholder="Minimal 8 karakter"
          />
        </div>

        <div className="form-group">
          <label>Konfirmasi Password Baru</label>
          <input 
            type="password" 
            value={formData.new_password_confirmation} 
            onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}
