import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: LÜTFEN KENDİ FIREBASE BİLGİLERİNİZİ BURAYA GİRİN
const firebaseConfig = {
  apiKey: "AIzaSyDOHFeFv3XlBpcIoT1WfXvNs829GeuTCJM",
  authDomain: "hastabakim.firebaseapp.com",
  projectId: "hastabakim",
  storageBucket: "hastabakim.firebasestorage.app",
  messagingSenderId: "300783776324",
  appId: "1:300783776324:web:8041df2aa2368da6d70211"
};

// Initialize Firebase (Prevents duplicate app error on hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
