// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRG20i_XdolLNdP6KTaGV0IauWS_IlIqg",
  authDomain: "mathcode-1c100.firebaseapp.com",
  projectId: "mathcode-1c100",
  storageBucket: "mathcode-1c100.firebasestorage.app",
  messagingSenderId: "315820356537",
  appId: "1:315820356537:web:195cb37bd8981cf1967c68",
  measurementId: "G-F0LFXW6B8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;