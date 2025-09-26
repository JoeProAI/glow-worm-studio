import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin configuration using service account
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID || 'glow-worm-studio',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@glow-worm-studio.iam.gserviceaccount.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'glow-worm-studio.firebasestorage.app',
};

// Initialize Firebase Admin (server-side only)
let app: any = null;

if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseAdminConfig);
    console.log('🔥 Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
} else {
  app = getApps()[0];
}

// Export Firebase Admin services
export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;
export const adminStorage = app ? getStorage(app) : null;

// Helper function to check if Firebase Admin is configured
export const isFirebaseAdminConfigured = () => {
  return !!(adminAuth && adminDb && adminStorage);
};

export default app;
