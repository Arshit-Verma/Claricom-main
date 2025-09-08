// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOwR4_BY2z5_xhx076jURBIyQ-6smWP8I",
  authDomain: "claricom-793e4.firebaseapp.com",
  projectId: "claricom-793e4",
  storageBucket: "claricom-793e4.firebasestorage.app",
  messagingSenderId: "10289954973",
  appId: "1:10289954973:web:7d5490c61dfe4935189474"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyBtkayaqNLfLLaRrwoG1gy8bjpSkKr-qT8");
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default app;
