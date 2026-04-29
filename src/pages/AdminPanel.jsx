import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';

const AdminPanel = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = currentUser?.email === 'serhatsatici0@gmail.com';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach((docSnap) => {
        usersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsers(usersList);
    } catch (error) {
      console.error("Kullanıcılar çekilirken hata:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Bu kullanıcının rolünü "${newRole}" olarak değiştirmek istediğinize emin misiniz?`)) {
      try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
        fetchUsers();
      } catch (error) {
        console.error("Rol güncellenirken hata:", error);
        alert('Rol güncellenemedi.');
      }
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === 'serhatsatici0@gmail.com') {
      alert('Güvenlik İhlali: Süper Admin hesabı silinemez!');
      return;
    }
    if (userId === currentUser.uid) {
      alert('Kendi hesabınızı silemezsiniz!');
      return;
    }
    if (window.confirm(`DİKKAT: ${userEmail} hesabının tüm verilerini silmek istediğinize emin misiniz? (Bu işlem geri alınamaz)`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
      } catch (error) {
        console.error("Kullanıcı silinirken hata:", error);
        alert('Kullanıcı veritabanından silinemedi.');
      }
    }
  };

  const sidebarButtons = [
    { label: 'Profil', icon: '👤', onClick: () => navigate('/profile'), background: '#e6f4ea', color: '#137333' },
    { label: 'Çıkış', icon: '🚪', onClick: logout, background: '#fce8e6', color: '#d93025' }
  ];

  return (
    <div className="app-container">
      <Sidebar 
        buttons={sidebarButtons} 
        title="SİSTEM YÖNETİMİ (ADMİN)"
        subtitle="Tüm Kullanıcıları Yönet"
      />

      {loading ? <LoadingScreen /> : (
        <div style={{ maxWidth: '1000px', margin: '20px auto', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Kullanıcı Listesi ({users.length})</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Profil</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>İsim / Email</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Hesap ID</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Rol</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ddd', overflow: 'hidden' }}>
                        {u.photoURL ? <img src={u.photoURL} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : null}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <strong>{u.name || 'İsimsiz'}</strong><br/>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#444' }}>{u.id}</td>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        disabled={
                          u.id === currentUser.uid || // Kendini değiştiremez
                          (u.email === 'serhatsatici0@gmail.com' && !isSuperAdmin) // Super Admin'e başkası dokunamaz
                        }
                      >
                        <option value="patient">Hasta</option>
                        <option value="caregiver">Bakıcı</option>
                        {(isSuperAdmin || u.role === 'admin') && <option value="admin">Admin</option>}
                      </select>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {u.role === 'patient' && (
                        <button 
                          onClick={() => navigate(`/patient/${u.id}`)}
                          style={{ padding: '5px 10px', background: '#4a86e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Panosunu Gör
                        </button>
                      )}
                      {u.email !== 'serhatsatici0@gmail.com' && u.id !== currentUser.uid && (
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          style={{ padding: '5px 10px', background: '#e06666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
