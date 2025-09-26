import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "glow-worm-studio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "glow-worm-studio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "glow-worm-studio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const hasRequiredConfig = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

const hasValidConfig = firebaseConfig.apiKey !== 'your_api_key_here' &&
                      firebaseConfig.messagingSenderId !== 'your_sender_id_here' &&
                      firebaseConfig.appId !== 'your_app_id_here';

const isConfigured = hasRequiredConfig && hasValidConfig;

// Initialize variables
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Only initialize if configured and in browser
if (typeof window !== 'undefined' && isConfigured) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('🔥 Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else if (typeof window !== 'undefined') {
  console.log('⚠️ Firebase not configured - demo mode');
}

// Export services (will be null if not configured)
export { auth, db, storage };

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return isConfigured && auth !== null && db !== null && storage !== null;
};

// Log configuration status
if (typeof window !== 'undefined') {
  if (isConfigured && auth && db && storage) {
    console.log('🔥 Firebase configured successfully');
    console.log('📊 Services initialized:', { auth: !!auth, db: !!db, storage: !!storage });
  } else {
    console.log('⚠️ Firebase not configured - running in demo mode');
    if (!isConfigured) {
      console.log('Missing environment variables. Add Firebase config to enable full functionality.');
    }
  }
}

export default app;
