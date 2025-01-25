import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYdEjNqRULS_W0926owilWh2pP2x_bUxk",
  authDomain: "maithetuan-20211010.firebaseapp.com",
  projectId: "maithetuan-20211010",
  storageBucket: "maithetuan-20211010.firebasestorage.app",
  messagingSenderId: "435921427887",
  appId: "1:435921427887:web:b06070ed551bb244d2a35a",
  measurementId: "G-Q0EX51YDGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
