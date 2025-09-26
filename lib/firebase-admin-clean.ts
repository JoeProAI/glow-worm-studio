// CLEAN FIREBASE ADMIN SETUP - NO SECRETS IN CODE
import admin from 'firebase-admin';

// Get service account from environment variables
const getServiceAccount = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (projectId && clientEmail && privateKey) {
    console.log('✅ Firebase Admin environment variables found');
    return {
      type: "service_account",
      project_id: projectId,
      private_key: privateKey,
      client_email: clientEmail,
    };
  }
  
  console.error('❌ Missing Firebase Admin environment variables:', {
    hasProjectId: !!projectId,
    hasClientEmail: !!clientEmail,
    hasPrivateKey: !!privateKey
  });
  return null;
};

// Initialize Firebase Admin
let adminAuth: any = null;
let adminDb: any = null;
let adminStorage: any = null;

const serviceAccount = getServiceAccount();

if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'glow-worm-studio.firebasestorage.app'
    });
    
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    adminStorage = admin.storage();
    
    console.log('🔥 Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
  }
} else if (!serviceAccount) {
  console.error('❌ Cannot initialize Firebase Admin - missing credentials');
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
