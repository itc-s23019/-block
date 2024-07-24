// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAbVqP4HjXb184z7U4UxkUzunl579r76p4',
  authDomain: 'block-dd9b2.firebaseapp.com',
  projectId: 'block-dd9b2',
  storageBucket: 'block-dd9b2.appspot.com',
  messagingSenderId: '656434380964',
  appId: '1:656434380964:web:ae4a58fe9281e17e45a631',
  measurementId: "G-LVHW139F4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };

