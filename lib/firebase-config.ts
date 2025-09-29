// CLIENT-SIDE FIREBASE CONFIGURATION - AUTH ONLY
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | null = null;

// Disable Firestore and Storage on client-side to prevent 400 errors
// All data operations go through server-side APIs
const db = null;
const storage = null;

const initializeFirebaseServices = () => {
  try {
    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      return false;
    }

    // Check if we have the required config
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.log('ℹ️ Firebase client config missing - check environment variables');
      return false;
    }

    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize Auth service only
    auth = getAuth(app);
    
    console.log('✅ Firebase Auth initialized successfully');
    console.log('ℹ️ Firestore and Storage disabled on client - using server APIs');
    return true;
  } catch (error) {
    console.error('❌ Firebase Auth initialization failed:', error);
    return false;
  }
};

const isFirebaseConfigured = () => {
  return !!auth;
};

// Initialize Firebase on import (browser only)
if (typeof window !== 'undefined') {
  initializeFirebaseServices();
}

export { auth, db, storage, initializeFirebaseServices, isFirebaseConfigured };
export default app;
