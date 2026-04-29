import { db } from '../firebase';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';

/**
 * Checks if the user's 'today' document is from a previous day.
 * If so, it archives it to the 'history' collection and resets 'today'.
 */
export const checkAndResetDailyTasks = async (userId) => {
  if (!userId) return;

  const todayStr = new Date().toLocaleDateString('tr-TR'); // Örn: "30.04.2026"
  
  try {
    const todayDocRef = doc(db, 'users', userId, 'tracker', 'today');
    const todaySnap = await getDoc(todayDocRef);

    if (todaySnap.exists()) {
      const data = todaySnap.data();
      const savedDate = data.date;

      // Eğer belge eski bir güne aitse (veya date alanı yoksa)
      if (savedDate && savedDate !== todayStr) {
        const batch = writeBatch(db);
        
        // 1. Eski veriyi geçmişe kaydet
        const historyRef = doc(db, 'users', userId, 'history', savedDate);
        batch.set(historyRef, {
          statuses: data.statuses || {},
          savedAt: new Date()
        });

        // 2. Bugünü sıfırla
        batch.set(todayDocRef, {
          statuses: {},
          date: todayStr
        });

        await batch.commit();
        console.log("Geçmiş gün arşivlendi ve yeni gün başlatıldı.");
      } else if (!savedDate) {
        // İlk defa kullanılıyorsa sadece tarihi ekle
        await setDoc(todayDocRef, { date: todayStr }, { merge: true });
      }
    } else {
      // Belge hiç yoksa oluştur
      await setDoc(todayDocRef, {
        statuses: {},
        date: todayStr
      });
    }
  } catch (error) {
    console.error("Günlük sıfırlama işlemi sırasında hata oluştu:", error);
  }
};
