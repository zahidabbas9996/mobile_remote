import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA_Xy-nAWuZStA3Tm7fTE3QHkIjvne9Tvs",
  authDomain: "mobile-remote-17d84.firebaseapp.com",
  databaseURL: "https://mobile-remote-17d84-default-rtdb.firebaseio.com",
  projectId: "mobile-remote-17d84",
  storageBucket: "mobile-remote-17d84.firebasestorage.app",
  messagingSenderId: "647150142338",
  appId: "1:647150142338:web:1a3251612a2529ea50059b",
  measurementId: "G-6MNC9WB915"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
