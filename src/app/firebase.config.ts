import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBE987GKhbxQILIaLZO7Ec-CxBlE8p8-nQ",
  authDomain: "portafolio-web-f46e7.firebaseapp.com",
  projectId: "portafolio-web-f46e7",
  storageBucket: "portafolio-web-f46e7.firebasestorage.app",
  messagingSenderId: "698675697974",
  appId: "1:698675697974:web:2ef77f627452d1730b3b97"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);