import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These should be configured in AI Studio Secrets panel
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER",
  appId: process.env.VITE_FIREBASE_APP_ID || "PLACEHOLDER"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  VOLUNTEER = 'volunteer',
  RELAWAN = 'relawan',
  USER = 'user'
}
