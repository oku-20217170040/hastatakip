import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultTasks } from '../data/defaultTasks';
import Column from '../components/Column';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import LoadingScreen from '../components/LoadingScreen';
import HistoryModal from '../components/HistoryModal';
import Sidebar from '../components/Sidebar';
import { checkAndResetDailyTasks } from '../utils/dailyReset';

const PatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('Yükleniyor...');
  const [taskStatuses, setTaskStatuses] = useState({});
  const [userTasks, setUserTasks] = useState(defaultTasks);
  const [loading, setLoading] = useState(true);
  
  // Task Editing State
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('morning');
  const [newTaskIcon, setNewTaskIcon] = useState('Activity');

  // Load patient data and Firestore listener
  useEffect(() => {
    if (!patientId) return;

    let unsubUser = () => {};
    let unsubToday = () => {};

    const initializePatientData = async () => {
      await checkAndResetDailyTasks(patientId);

      try {
        const userDocRef = doc(db, 'users', patientId);
        unsubUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setPatientName(docSnap.data().name || 'İsimsiz Hasta');
            if (docSnap.data().customTasks) {
              setUserTasks(docSnap.data().customTasks);
            }
          }
        });

        const todayDocRef = doc(db, 'users', patientId, 'tracker', 'today');
        unsubToday = onSnapshot(todayDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setTaskStatuses(docSnap.data().statuses || {});
          } else {
            setTaskStatuses({});
          }
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    initializePatientData();

    return () => {
      unsubUser();
      unsubToday();
    };
  }, [patientId]);

  // Caregiver can also toggle status if they want
  const handleToggleStatus = async (taskId, newStatus) => {
    const newStatuses = {
      ...taskStatuses,
      [taskId]: newStatus
    };
    setTaskStatuses(newStatuses);

    try {
      const docRef = doc(db, 'users', patientId, 'tracker', 'today');
      await setDoc(docRef, { statuses: newStatuses }, { merge: true });
    } catch (error) {
      console.error("Firestore write error:", error);
    }
  };

  const handleSaveTasks = async (newTasks) => {
    try {
      await setDoc(doc(db, 'users', patientId), { customTasks: newTasks }, { merge: true });
    } catch (error) {
      console.error("Görevler kaydedilirken hata:", error);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: 't_' + Date.now(),
      timeOfDay: newTaskTime,
      title: newTaskTitle.trim(),
      icon: newTaskIcon
    };
    handleSaveTasks([...userTasks, newTask]);
    setNewTaskTitle('');
  };

  const handleRemoveTask = (taskId) => {
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      handleSaveTasks(userTasks.filter(t => t.id !== taskId));
    }
  };

  const morningTasks = userTasks.filter(t => t.timeOfDay === 'morning');
  const afternoonTasks = userTasks.filter(t => t.timeOfDay === 'afternoon');
  const eveningTasks = userTasks.filter(t => t.timeOfDay === 'evening');

  const sidebarButtons = [
    { label: 'Geri Dön', icon: '🔙', onClick: () => navigate(-1), background: '#f5f5f5', color: '#333' },
    { label: 'Geçmişi Gör', icon: '🕒', onClick: () => setIsHistoryOpen(true), background: '#e8f0fe', color: '#1a73e8' },
    { label: isEditingTasks ? 'Düzenlemeyi Bitir' : 'Görevleri Düzenle', icon: '✏️', onClick: () => setIsEditingTasks(!isEditingTasks), background: isEditingTasks ? '#fce8e6' : '#fef7e0', color: isEditingTasks ? '#d93025' : '#e37400', closeOnClick: false }
  ];

  return (
    <div className="app-container">
      <Sidebar 
        buttons={sidebarButtons} 
        title={`${patientName.toUpperCase()} - GÜNLÜK TAKİP`}
        subtitle="Bakıcı Kontrol Ekranı"
      />

      {loading ? (
        <LoadingScreen />
      ) : isEditingTasks ? (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px' }}>Görev (Beceri) Yönetimi</h2>
          
          <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Yeni Görev Ekle</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Görev Adı (Örn: Tansiyon İlacı)" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '200px' }}
                required
              />
              <select value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option value="morning">Sabah</option>
                <option value="afternoon">Öğle</option>
                <option value="evening">Akşam</option>
              </select>
              <select value={newTaskIcon} onChange={(e) => setNewTaskIcon(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option value="Activity">Genel (Aktivite)</option>
                <option value="Pill">İlaç</option>
                <option value="GlassWater">Su</option>
                <option value="Coffee">Yemek/Kahve</option>
                <option value="HeartPulse">Sağlık/Tansiyon</option>
              </select>
              <button type="submit" className="auth-btn" style={{ background: '#388e3c' }}>Ekle</button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ margin: 0 }}>Mevcut Görevler ({userTasks.length})</h3>
            {userTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
                <div>
                  <strong>{t.title}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '10px', background: '#ddd', padding: '2px 6px', borderRadius: '10px' }}>
                    {t.timeOfDay === 'morning' ? 'Sabah' : t.timeOfDay === 'afternoon' ? 'Öğle' : 'Akşam'}
                  </span>
                </div>
                <button onClick={() => handleRemoveTask(t.id)} style={{ background: '#e06666', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="board">
          <Column 
            timeOfDay="morning" 
            tasks={morningTasks} 
            taskStatuses={taskStatuses} 
            onToggleStatus={handleToggleStatus} 
          />
          <Column 
            timeOfDay="afternoon" 
            tasks={afternoonTasks} 
            taskStatuses={taskStatuses} 
            onToggleStatus={handleToggleStatus} 
          />
          <Column 
            timeOfDay="evening" 
            tasks={eveningTasks} 
            taskStatuses={taskStatuses} 
            onToggleStatus={handleToggleStatus} 
          />
        </div>
      )}

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        userId={patientId} 
        userTasks={userTasks} 
      />
    </div>
  );
};

export default PatientView;
