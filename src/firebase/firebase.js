// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKa9ZoF_-Xrk-MV3KqZpFj0d8PIO7qlAc",
  authDomain: "kev-chat.firebaseapp.com",
  projectId: "kev-chat",
  storageBucket: "kev-chat.appspot.com",
  messagingSenderId: "829764390961",
  appId: "1:829764390961:web:9910b72cb4d9398e7a4510",
  measurementId: "G-09QSZ0EQRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export  {app, auth}