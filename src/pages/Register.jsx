import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient'); // default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await register(email, password, role, name);
      // Wait for auth to settle, then redirect
      navigate('/dashboard'); 
    } catch (err) {
      setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1a365d' }}>Kayıt Ol</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Ad Soyad" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="E-posta" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <label style={{ marginTop: '10px', fontWeight: 'bold' }}>Hesap Türü:</label>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        >
          <option value="patient">Kullanıcı / Hasta</option>
          <option value="caregiver">Bakıcı / Aile Üyesi</option>
        </select>

        <button disabled={loading} type="submit" className="auth-btn" style={{ marginTop: '15px' }}>
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        Zaten hesabınız var mı? <Link to="/login" style={{ color: '#4a86e8' }}>Giriş Yap</Link>
      </div>
    </div>
  );
};

export default Register;
