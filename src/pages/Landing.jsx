import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#333' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4a86e8' }}>
          Günlük<span style={{ color: '#f4b400' }}>Takip</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #4a86e8', color: '#4a86e8', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={(e) => { e.target.style.background = '#f0f5ff' }}
            onMouseOut={(e) => { e.target.style.background = 'transparent' }}
          >
            Giriş Yap
          </button>
          <button 
            onClick={() => navigate('/register')} 
            style={{ padding: '10px 20px', background: '#4a86e8', border: 'none', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(74, 134, 232, 0.2)', transition: 'all 0.3s' }}
            onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)' }}
          >
            Hemen Başla
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '60vh', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#1a365d', marginBottom: '20px', maxWidth: '800px', lineHeight: '1.2' }}>
          Hafıza Dostu <br/> <span style={{ color: '#4a86e8' }}>Günlük Yaşam</span> Asistanınız
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
          Yaşlılar ve hafıza problemi yaşayan bireyler için özel olarak tasarlanmış, görsel bildirimler sunan ve bakıcılarla anında senkronize olan dijital takip sistemi.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => navigate('/register')} 
            style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#388e3c', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(56, 142, 60, 0.3)', transition: 'all 0.3s' }}
            onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 6px 20px rgba(56, 142, 60, 0.4)' }}
            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(56, 142, 60, 0.3)' }}
          >
            Ücretsiz Hesap Oluştur
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: 'white', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div style={{ flex: '1', minWidth: '300px', padding: '30px', background: '#f8f9fa', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '70px', height: '70px', background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>📱</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1a365d' }}>Kolay Kullanım</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>Büyük butonlar, yüksek kontrastlı renkler ve anlaşılır ikonlarla yaşlı bireyler için özel olarak optimize edilmiştir.</p>
          </div>

          <div style={{ flex: '1', minWidth: '300px', padding: '30px', background: '#f8f9fa', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '70px', height: '70px', background: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>👨‍👩‍👧</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1a365d' }}>Bakıcı Bağlantısı</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>Hastaların verileri anlık olarak bakıcı veya aile üyelerinin paneline düşer. İlaç saati geldiğinde anında haberiniz olur.</p>
          </div>

          <div style={{ flex: '1', minWidth: '300px', padding: '30px', background: '#f8f9fa', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '70px', height: '70px', background: '#fef7e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>☁️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1a365d' }}>Bulut Yedekleme</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>Tüm aktiviteler anlık olarak bulutta saklanır. Telefonunuz kapansa bile verileriniz ve rutinleriniz asla kaybolmaz.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a365d', color: 'white', textAlign: 'center', padding: '30px', marginTop: 'auto' }}>
        <p style={{ margin: 0, opacity: 0.8 }}>© 2026 Günlük Takip Sistemi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default Landing;
