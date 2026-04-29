import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // AuthContext will fetch the role, then we navigate
      // For now, redirect to a loading state or rely on App.jsx to route based on role
      navigate('/dashboard'); // We will handle role-based routing in App.jsx
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1a365d' }}>Giriş Yap</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button disabled={loading} type="submit" className="auth-btn">
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        Hesabınız yok mu? <Link to="/register" style={{ color: '#4a86e8' }}>Kayıt Ol</Link>
      </div>
    </div>
  );
};

export default Login;
