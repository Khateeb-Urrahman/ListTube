// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfS43Ilx5lieqC8IfiD1wIHYLHs8qIM3w",
  authDomain: "listtube-32d9f.firebaseapp.com",
  projectId: "listtube-32d9f",
  storageBucket: "listtube-32d9f.firebasestorage.app",
  messagingSenderId: "902306662353",
  appId: "1:902306662353:web:ed6c47dc86b662a46282f0",
  measurementId: "G-8VH0J0ZQHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth
const auth = getAuth(app);

export { app, analytics, auth };