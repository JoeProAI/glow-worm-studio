// FINAL FIREBASE ADMIN - USING SERVICE ACCOUNT JSON
import admin from 'firebase-admin';

// Initialize Firebase Admin with service account JSON
let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

const initializeFirebaseAdmin = () => {
  try {
    // Don't initialize if already done
    if (admin.apps.length > 0) {
      console.log('🔄 Firebase Admin already initialized');
      adminAuth = admin.auth();
      adminDb = admin.firestore();
      adminStorage = admin.storage();
      return true;
    }

    console.log('🔄 Initializing Firebase Admin with service account JSON...');

    // Try environment variable first (JSON string)
    let serviceAccount = null;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('✅ Using FIREBASE_SERVICE_ACCOUNT environment variable');
      } catch (error) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error);
      }
    }
    
    // Fallback to individual environment variables
    if (!serviceAccount) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      if (projectId && clientEmail && privateKey) {
        serviceAccount = {
          type: "service_account",
          project_id: projectId,
          private_key: privateKey,
          client_email: clientEmail,
        };
        console.log('✅ Using individual environment variables');
      }
    }

    if (!serviceAccount) {
      console.error('❌ No Firebase service account configuration found');
      return false;
    }

    // Initialize Firebase Admin
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'glow-worm-studio.firebasestorage.app',
    });

    // Initialize services
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    adminStorage = admin.storage();

    console.log('🔥 Firebase Admin initialized successfully');
    console.log('🔍 Services created:', {
      auth: !!adminAuth,
      db: !!adminDb,
      storage: !!adminStorage,
      appName: app.name
    });

    return true;

  } catch (error: any) {
    console.error('❌ Firebase Admin initialization failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 500)
    });
    return false;
  }
};

// Initialize on import
const isInitialized = initializeFirebaseAdmin();

// Export services
export { adminAuth, adminDb, adminStorage };

// Export initialization status
export const isFirebaseAdminConfigured = () => {
  const configured = isInitialized && !!adminAuth && !!adminDb && !!adminStorage;
  console.log('🔍 Firebase Admin configured:', configured);
  return configured;
};

export default admin;
