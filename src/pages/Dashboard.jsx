import React, { useState, useEffect } from 'react';
import { defaultTasks } from '../data/defaultTasks';
import Column from '../components/Column';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import HistoryModal from '../components/HistoryModal';
import Sidebar from '../components/Sidebar';
import { checkAndResetDailyTasks } from '../utils/dailyReset';

const Dashboard = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [taskStatuses, setTaskStatuses] = useState({});
  const [userTasks, setUserTasks] = useState(defaultTasks);
  const [loading, setLoading] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sesli Asistan Fonksiyonu
  const speak = (text) => {
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      // Önceki konuşmaları durdur
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR'; // Türkçe konuşması için
      utterance.rate = 0.9; // Yaşlılar için biraz daha yavaş ve tane tane
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Load from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;

    // Listener for statuses and tasks
    const userDocRef = doc(db, 'users', currentUser.uid);
    const todayDocRef = doc(db, 'users', currentUser.uid, 'tracker', 'today');
    
    // Unsubscribe from multiple listeners
    let unsubUser = () => {};
    let unsubToday = () => {};

    const initializeData = async () => {
      await checkAndResetDailyTasks(currentUser.uid);

      try {
        unsubUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().customTasks) {
            setUserTasks(docSnap.data().customTasks);
          }
        });

        unsubToday = onSnapshot(todayDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setTaskStatuses(docSnap.data().statuses || {});
          } else {
            setTaskStatuses({});
          }
          setLoading(false);
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      unsubUser();
      unsubToday();
    };
  }, [currentUser]);

  // Save to Firestore whenever statuses change
  const handleToggleStatus = async (taskId, newStatus) => {
    // Sesli geri bildirim (Sadece görev yapıldı işaretlendiğinde)
    if (newStatus) {
      const completedTask = userTasks.find(t => t.id === taskId);
      if (completedTask) {
        speak(`Harika, ${completedTask.title} görevini başarıyla tamamladın.`);
      }
    }

    // Optimistic UI update
    const newStatuses = {
      ...taskStatuses,
      [taskId]: newStatus
    };
    setTaskStatuses(newStatuses);

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'tracker', 'today');
        await setDoc(docRef, { statuses: newStatuses }, { merge: true });
      } catch (error) {
        console.error("Firestore write error:", error);
      }
    }
  };

  const handleResetDaily = async () => {
    if (window.confirm('Bugünün tüm kayıtlarını sıfırlamak istediğinize emin misiniz?')) {
      setTaskStatuses({});
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid, 'tracker', 'today');
          await setDoc(docRef, { statuses: {} });
        } catch (error) {
          console.error("Firestore reset error:", error);
        }
      }
    }
  };

  const morningTasks = userTasks.filter(t => t.timeOfDay === 'morning');
  const afternoonTasks = userTasks.filter(t => t.timeOfDay === 'afternoon');
  const eveningTasks = userTasks.filter(t => t.timeOfDay === 'evening');

  if (loading) {
    return <LoadingScreen />;
  }

  const sidebarButtons = [
    { label: 'Admin Panel', icon: '👑', onClick: () => navigate('/admin'), background: '#fef7e0', color: '#b08d00', isHidden: userRole !== 'admin' },
    { label: 'Geçmişi Gör', icon: '🕒', onClick: () => setIsHistoryOpen(true), background: '#e8f0fe', color: '#1a73e8' },
    { label: 'Profil', icon: '👤', onClick: () => navigate('/profile'), background: '#e6f4ea', color: '#137333' },
    { label: isVoiceEnabled ? 'Ses Açık' : 'Ses Kapalı', icon: isVoiceEnabled ? '🔊' : '🔇', onClick: () => setIsVoiceEnabled(!isVoiceEnabled), background: isVoiceEnabled ? '#e8f0fe' : '#f1f3f4', color: isVoiceEnabled ? '#1a73e8' : '#5f6368', closeOnClick: false },
    { label: 'Çıkış', icon: '🚪', onClick: logout, background: '#fce8e6', color: '#d93025' }
  ];

  return (
    <div className="app-container">
      <Sidebar 
        buttons={sidebarButtons} 
        title="GÜNLÜK TAKİP"
        subtitle="Kullanıcı Panosu"
      />

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

      <button className="reset-btn" onClick={handleResetDaily}>
        Günü Sıfırla
      </button>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        userId={currentUser?.uid} 
        userTasks={userTasks} 
      />
    </div>
  );
};

export default Dashboard;
