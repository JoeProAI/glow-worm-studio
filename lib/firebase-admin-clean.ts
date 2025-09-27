// CLEAN FIREBASE ADMIN SETUP - NO SECRETS IN CODE
import admin from 'firebase-admin';

// Get service account from environment variables
const getServiceAccount = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  // Handle private key formatting - Vercel sometimes stores it differently
  if (privateKey) {
    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Ensure proper formatting
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
    }
  }
  
  console.log('🔍 Firebase Admin environment check:', {
    hasProjectId: !!projectId,
    hasClientEmail: !!clientEmail,
    hasPrivateKey: !!privateKey,
    projectId: projectId,
    clientEmail: clientEmail,
    privateKeyStart: privateKey ? privateKey.substring(0, 50) + '...' : 'null'
  });
  
  if (projectId && clientEmail && privateKey) {
    console.log('✅ Firebase Admin environment variables found');
    return {
      type: "service_account",
      project_id: projectId,
      private_key: privateKey,
      client_email: clientEmail,
    };
  }
  
  console.error('❌ Missing Firebase Admin environment variables');
  return null;
};

// Initialize Firebase Admin
let adminAuth: any = null;
let adminDb: any = null;
let adminStorage: any = null;

const serviceAccount = getServiceAccount();

if (!admin.apps.length && serviceAccount) {
  try {
    console.log('🔄 Initializing Firebase Admin...');
    
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'glow-worm-studio.firebasestorage.app'
    });
    
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
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization failed:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
  }
} else if (!serviceAccount) {
  console.error('❌ Cannot initialize Firebase Admin - missing credentials');
} else {
  console.log('🔄 Firebase Admin already initialized, getting existing services...');
  try {
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    adminStorage = admin.storage();
    console.log('✅ Got existing Firebase Admin services');
  } catch (error: any) {
    console.error('❌ Failed to get existing Firebase Admin services:', error.message);
  }
}

// Export services
export { adminAuth, adminDb, adminStorage };

// Check if configured
export const isFirebaseAdminConfigured = () => {
  const configured = !!(admin.apps.length > 0 && adminAuth && adminDb && adminStorage);
  console.log('🔍 Firebase Admin configured:', configured);
  return configured;
};

export default admin;
