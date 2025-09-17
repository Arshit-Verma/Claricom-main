// Alternative Firebase configuration with more explicit initialization
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "<enter api key>",
  authDomain: "claricom-793e4.firebaseapp.com",
  projectId: "claricom-793e4",
  storageBucket: "claricom-793e4.firebasestorage.app",
  messagingSenderId: "10289954973",
  appId: "1:10289954973:web:9a2d7f65181cb790189474"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firebase Auth with error handling
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
  
  // Set auth settings
  auth.useDeviceLanguage();
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("<enter api key>");
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export { auth, db };
export default app;
