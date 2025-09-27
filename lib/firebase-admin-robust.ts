// ROBUST FIREBASE ADMIN SETUP
import admin from 'firebase-admin';

// Initialize Firebase Admin with error handling
let adminApp: admin.app.App | null = null;
let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

const initializeFirebaseAdmin = () => {
  try {
    // Don't initialize if already done
    if (admin.apps.length > 0) {
      console.log('🔄 Firebase Admin already initialized');
      adminApp = admin.app();
      adminAuth = admin.auth();
      adminDb = admin.firestore();
      adminStorage = admin.storage();
      return true;
    }

    // Get environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    console.log('🔍 Environment variables check:', {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey,
      storageBucket: !!storageBucket
    });

    // Validate required environment variables
    if (!projectId || !clientEmail || !privateKey || !storageBucket) {
      console.error('❌ Missing required Firebase Admin environment variables');
      return false;
    }

    // Fix private key formatting
    if (privateKey) {
      // Handle different encodings
      privateKey = privateKey.replace(/\\n/g, '\n');
      privateKey = privateKey.replace(/\r\n/g, '\n');
      privateKey = privateKey.replace(/\r/g, '\n');
      privateKey = privateKey.trim();

      // Ensure proper format
      if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}`;
      }
      if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
        privateKey = `${privateKey}\n-----END PRIVATE KEY-----`;
      }
    }

    console.log('🔄 Initializing Firebase Admin...');

    // Create service account object
    const serviceAccount = {
      type: 'service_account',
      project_id: projectId,
      private_key: privateKey,
      client_email: clientEmail,
    };

    // Initialize Firebase Admin
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: storageBucket,
    });

    // Initialize services
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    adminStorage = admin.storage();

    console.log('🔥 Firebase Admin initialized successfully');
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
