import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase only if config is available and not already initialized
let app;
if (typeof window !== 'undefined' && isFirebaseConfigured() && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('🔥 Firebase initialized successfully');
  } catch (error) {
    console.error('🔥 Firebase initialization failed:', error);
    app = null;
  }
} else if (getApps().length > 0) {
  app = getApps()[0];
} else if (typeof window !== 'undefined') {
  console.warn('🔥 Firebase not configured - missing environment variables');
}

// Initialize Firebase services only if app is available
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export const isFirebaseReady = () => !!(app && auth && db && storage);

export default app;
