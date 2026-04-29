import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';

const CaregiverPanel = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPatientId, setNewPatientId] = useState('');
  const [addMessage, setAddMessage] = useState('');

  // Fetch patients assigned to this caregiver
  const fetchPatients = async () => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'users'), where('caregiverId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const patientsList = [];
      querySnapshot.forEach((docSnap) => {
        patientsList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPatients(patientsList);
    } catch (error) {
      console.error("Hastalar çekilemedi:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setAddMessage('');
    if (!newPatientId.trim()) return;

    try {
      const patientRef = doc(db, 'users', newPatientId.trim());
      const patientSnap = await getDoc(patientRef);
      
      if (patientSnap.exists() && patientSnap.data().role === 'patient') {
        // Link patient
        await updateDoc(patientRef, {
          caregiverId: currentUser.uid
        });
        setAddMessage('Hasta başarıyla eklendi!');
        setNewPatientId('');
        fetchPatients(); // Refresh list
      } else {
        setAddMessage('Hata: Bu ID ile bir hasta bulunamadı.');
      }
    } catch (error) {
      console.error("Hasta ekleme hatası:", error);
      setAddMessage('Bir hata oluştu.');
    }
  };

  const sidebarButtons = [
    { label: 'Admin Panel', icon: '👑', onClick: () => navigate('/admin'), background: '#fef7e0', color: '#b08d00', isHidden: userRole !== 'admin' },
    { label: 'Profil', icon: '👤', onClick: () => navigate('/profile'), background: '#e6f4ea', color: '#137333' },
    { label: 'Çıkış', icon: '🚪', onClick: handleLogout, background: '#fce8e6', color: '#d93025' }
  ];

  return (
    <div className="app-container">
      <Sidebar 
        buttons={sidebarButtons} 
        title="BAKICI PANELİ"
        subtitle={`Hoşgeldin, ${currentUser?.email}`}
      />

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* Add Patient Form */}
        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Yeni Hasta Ekle</h3>
          <form onSubmit={handleAddPatient} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Hastanın ID'si (Örn: yF3...)" 
              value={newPatientId} 
              onChange={(e) => setNewPatientId(e.target.value)} 
              style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button type="submit" className="auth-btn" style={{ background: '#4a86e8', padding: '10px 20px' }}>Ekle</button>
          </form>
          {addMessage && <p style={{ margin: '10px 0 0 0', color: addMessage.includes('Hata') ? 'red' : 'green', fontSize: '0.9rem' }}>{addMessage}</p>}
        </div>

        <h2 style={{ marginBottom: '20px' }}>Hastalarım</h2>
        
        {loading ? (
          <div style={{ position: 'relative', height: '200px' }}><LoadingScreen /></div>
        ) : patients.length === 0 ? (
          <p style={{ color: '#666' }}>Henüz takip ettiğiniz bir hasta yok. Yukarıdan Hasta ID'si ile ekleyebilirsiniz.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {patients.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ddd', overflow: 'hidden' }}>
                    {p.photoURL ? (
                      <img src={p.photoURL} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '0.8rem' }}>Foto</div>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#1a365d' }}>{p.name || 'İsimsiz'}</h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>{p.email}</p>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => navigate(`/patient/${p.id}`)}
                    className="auth-btn" 
                    style={{ background: '#f4b400', color: '#000', padding: '8px 15px', fontSize: '0.9rem' }}
                  >
                    Panosunu Gör
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverPanel;
