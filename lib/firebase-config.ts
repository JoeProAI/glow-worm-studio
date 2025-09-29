// CLIENT-SIDE FIREBASE - LAZY INITIALIZATION
// Only initialize when actually needed to prevent startup errors

// Disable Firestore and Storage on client-side to prevent 400 errors
// All data operations go through server-side APIs
export const db = null;
export const storage = null;

// Lazy initialization variables
let auth: any = null;
let app: any = null;
let initPromise: Promise<boolean> | null = null;

export const initializeFirebaseServices = () => {
  // Return existing promise if initialization is in progress
  if (initPromise) {
    return initPromise;
  }

  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  initPromise = (async () => {
    try {
      // Dynamic imports to prevent SSR issues
      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      // Check if we have the required config
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.log('ℹ️ Firebase client config missing - running in server-only mode');
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
  })();

  return initPromise;
};

export const isFirebaseConfigured = () => {
  return !!auth;
};

// Export auth with getter to ensure it's available after initialization
export { auth };
export default app;
