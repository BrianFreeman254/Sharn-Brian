// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCY8rufFnmvmvW5QMF989chBEZbF6ytOg",
  authDomain: "myapp-32598.firebaseapp.com",
  projectId: "myapp-32598",
  storageBucket: "myapp-32598.appspot.com",
  messagingSenderId: "349027005",
  appId: "1:349027005:web:3c3e13461b93aa3b9355d4",
  measurementId: "G-K9X4PVX4C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore database
const auth = getAuth(app);     // Authentication

// Export the initialized services
export { db, auth };
