import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "glow-worm-studio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "glow-worm-studio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "glow-worm-studio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized and is properly configured
let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Only initialize services if we have a valid app
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.log('⚠️ Firebase initialization skipped - not configured');
  // Services remain null, which will be handled by isFirebaseConfigured()
}

// Export services (may be null if not configured)
export { auth, db, storage };

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  const hasRequiredConfig = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
  
  // Additional check: make sure we're not using placeholder values
  const hasValidConfig = firebaseConfig.apiKey !== 'your_api_key_here' &&
                        firebaseConfig.messagingSenderId !== 'your_sender_id_here' &&
                        firebaseConfig.appId !== 'your_app_id_here';
  
  return hasRequiredConfig && hasValidConfig;
};

// Log configuration status
if (typeof window !== 'undefined') {
  if (isFirebaseConfigured()) {
    console.log('🔥 Firebase configured successfully');
  } else {
    console.log('⚠️ Firebase not configured - some features may not work');
    console.log('Add Firebase environment variables to enable full functionality');
  }
}

export default app;
