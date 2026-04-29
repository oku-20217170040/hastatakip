import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const Profile = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData((prev) => ({ ...prev, ...docSnap.data() }));
          }
        } catch (error) {
          console.error("Profil çekilirken hata:", error);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      let newPhotoURL = profileData.photoURL;
      
      // Resim seçildiyse Cloudinary'ye yükle
      if (file) {
        const uploadedUrl = await uploadImageToCloudinary(file);
        if (uploadedUrl) {
          newPhotoURL = uploadedUrl;
          setProfileData(prev => ({ ...prev, photoURL: uploadedUrl }));
        }
      }

      // Firestore'u güncelle
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        name: profileData.name,
        phone: profileData.phone || '',
        photoURL: newPhotoURL
      });

      setMessage('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      setMessage('Güncelleme sırasında bir hata oluştu.');
    }
    
    setSaving(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="app-container">
      <header style={{ position: 'relative' }}>
        <h1>PROFİL BİLGİLERİ</h1>
        <p>Hesap Ayarları</p>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <button onClick={() => navigate(-1)} className="auth-btn" style={{ padding: '5px 10px', fontSize: '0.9rem', background: '#4a86e8' }}>
            Geri Dön
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        {message && <div style={{ padding: '10px', marginBottom: '20px', background: message.includes('hata') ? '#ffebee' : '#e8f5e9', color: message.includes('hata') ? '#c62828' : '#2e7d32', borderRadius: '8px', textAlign: 'center' }}>{message}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto', overflow: 'hidden', border: '3px solid #4a86e8' }}>
              {profileData.photoURL ? (
                <img src={profileData.photoURL} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>Fotoğraf Yok</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '15px', fontSize: '0.9rem' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Ad Soyad</label>
            <input 
              type="text" 
              name="name"
              value={profileData.name} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Telefon</label>
            <input 
              type="text" 
              name="phone"
              value={profileData.phone || ''} 
              onChange={handleChange} 
              placeholder="05xxxxxxxxx"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Rol</label>
            <input 
              type="text" 
              value={userRole === 'patient' ? 'Kullanıcı / Hasta' : userRole === 'caregiver' ? 'Bakıcı' : 'Admin'} 
              disabled
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', background: '#f5f5f5', color: '#666' }}
            />
          </div>

          {userRole === 'patient' && (
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Hesap ID (Bakıcınıza Verin)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={currentUser?.uid || ''} 
                  disabled
                  style={{ flexGrow: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '8px', background: '#f5f5f5', color: '#333', fontFamily: 'monospace' }}
                />
                <button 
                  type="button" 
                  onClick={() => { navigator.clipboard.writeText(currentUser?.uid); alert('Kopyalandı!'); }}
                  className="auth-btn" 
                  style={{ padding: '0 15px', background: '#4a86e8' }}
                >
                  Kopyala
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={saving} className="auth-btn" style={{ marginTop: '10px', background: '#388e3c' }}>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
