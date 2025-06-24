import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-FC1QkpNgJ437RkhiF3nX03qgEg7r16U",
  authDomain: "event-manager-4426a.firebaseapp.com",
  projectId: "event-manager-4426a",
  storageBucket: "event-manager-4426a.appspot.com",
  messagingSenderId: "348604548984",
  appId: "1:348604548984:web:3136b655b96089f8b2a8d"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
