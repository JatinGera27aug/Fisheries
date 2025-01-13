// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAw9hYJgD1jzAXbLKy9v3JJPqkD3hG7zFc",
  authDomain: "fisherie.firebaseapp.com",
  projectId: "fisherie",
  storageBucket: "fisherie.firebasestorage.app",
  messagingSenderId: "36695992696",
  appId: "1:36695992696:web:d2efb5b4588f1e725bc08d",
  measurementId: "G-ZRQRKGCPVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth=getAuth();

export const db = getFirestore(app);
export default app;


