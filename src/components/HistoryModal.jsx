import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

const HistoryModal = ({ isOpen, onClose, userId, userTasks }) => {
  const [historyDocs, setHistoryDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchHistory();
    }
  }, [isOpen, userId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users', userId, 'history'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Tarihe göre sıralama (en yeni en üstte)
      docs.sort((a, b) => b.savedAt?.toMillis() - a.savedAt?.toMillis());
      
      setHistoryDocs(docs);
      if (docs.length > 0) setSelectedDate(docs[0]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          <h2 style={{ color: '#1a365d', margin: 0 }}>Geçmiş Kayıtlar (Bellek)</h2>
          <button onClick={onClose} style={{ background: '#e06666', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Kapat</button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Geçmiş veriler yükleniyor...</p>
        ) : historyDocs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Henüz geçmiş kayıt bulunmuyor.</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>Bugün bittiğinde veriler buraya arşivlenecek.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Sol Menü: Tarihler */}
            <div style={{ flex: '1 1 200px', borderRight: '2px solid #f0f0f0', paddingRight: '15px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '15px' }}>Tarihler</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {historyDocs.map(doc => (
                  <button 
                    key={doc.id} 
                    onClick={() => setSelectedDate(doc)}
                    style={{ 
                      padding: '12px 15px', 
                      background: selectedDate?.id === doc.id ? '#4a86e8' : '#f8f9fa', 
                      color: selectedDate?.id === doc.id ? 'white' : '#333', 
                      border: 'none',
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: selectedDate?.id === doc.id ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    📅 {doc.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Sağ Taraf: O günün detayları */}
            <div style={{ flex: '2 1 300px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#4a86e8', marginBottom: '15px' }}>{selectedDate?.id} Detayı</h3>
              {selectedDate && (
                <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {userTasks.map(task => {
                      const isDone = selectedDate.statuses[task.id];
                      return (
                        <li key={task.id} style={{ 
                          padding: '12px 10px', 
                          borderBottom: '1px solid #eee', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          background: isDone ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                          borderRadius: '5px'
                        }}>
                          <span style={{ fontSize: '1.3rem' }}>{isDone ? '✅' : '❌'}</span>
                          <span style={{ 
                            textDecoration: isDone ? 'line-through' : 'none', 
                            color: isDone ? '#4caf50' : '#d32f2f',
                            fontWeight: isDone ? 'bold' : 'normal'
                          }}>
                            {task.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
