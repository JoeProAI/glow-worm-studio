import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Complete Firebase service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: "glow-worm-studio",
  private_key_id: "5f5ffea4e92f949cefecbe77847be1912b93f888",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCEJ1Tu5hHVLxXM\npZhQEoDwD+80JvVbOtNVz1POViLWE5hzP0Fb6/9eSS0B2Lvr7okPO7ro5yYnORFd\nhW+LeCQ+1s0NGQ/wl22mf42kKOtMVw5MAU6t3xP76Szi2nspK+MuB9Jg9MYj4KsT\n4lR7E24d4/hz/gXc6q4bAZrkvnfrE4Aiyz64QhMoTwqoM6/DMp4AC23O27IzqaPX\ncJSXQ/M2M5GKegQCnmB0sdhtoFsopXBJ0ckSagws1b+Js+8mBCwLim3BlT3gHQwC\nJDMZp+piOJYt0ZfmxpMnjTkpGH4lWbVXhsdDP2oyYv1uIi1BBs7ewkmACMlZAcjG\ngP2kZ59vAgMBAAECggEABjv4xMBebP59+nEsFfLu2Y8Bi3tJrdZrloEOWg3e3Ncr\nJPIB+lJ6xzmP1vt2JLN/DGnr77Af26Up4uM4QjhrtU8wIy2108rA+yQfTB7mDWw5\n729MWpAgguIazPozlIX5Kfhn000Yynkpzj6qGkLuD0OW5USW2uId+TDX3BykJEHD\nj0hvjoB7XV5yAcqdRW5YHTmLYFCDLbKPXZLF4xmMi2SSz+pTDDrImsewIpOhebQL\nmDMYE88aqXZGMKhKH1gjVeweZ6jlg7qgwYDADq6dJ1ULdSPtncJUREp0Rrps19rd\nMtNRl/L9xXPxNS1f1mWC89PN+PIoXsqogNHWj7z+OQKBgQC5OwOr0W+aICw14oj4\nBGx7lCvUjzzVf7fHrbRGv8l7njfVeqnxlfKhfHsEqFMs3G0ODNl71g2UDnAgmcvx\nUlv0XiDC3PETv2zSDtV2PaII8b2lZ1kZDqTt95sO0+iyjpqctmeBqhgAgDCXSx0M\npupTtnHFrw27cmuE4m/grv/QzQKBgQC2pPw//kCVo4u9Q5Y0eIGAKai7rcIRYECZ\nxXobLTn3HZASzJCz9JCgujKqn4j14Y3eAjunKwpRJ4K2rgKlEH7z6WhQy0A79h2f\n3tAyErNIwTJsG/Jm6ZRvnhHcEY+pZUEe1nW2Gw0o6DxkHK3EysxalnaCtJGCWpeJ\nvLwR+xnBKwKBgDs8Ehp6KXRiYYEB5sdZss96POIGxG+KHl1uwT32yxoLKNPOHFaz\nmxnlUvnUUnUAMKfTmCEv/LuiOl1SkZOkwN9O0q8+NKIaD1TFhaIAZ7bwh7NDb4zB\n0CCBlEaTodCoJe2Dr2oZ2P8f/2oCjVGkdz86Evwi1QNivduLBjgV/pzpAoGAdaJ5\nnTXCnx5AyFuZiJ38unEabhaRoeNeeCvKY2qTpOdzfcgnguAHrp1+OIqcCdGGL/E8\nPoToFjDebY5RwcKIIcy5FSBzdKsllWxKp5WHx1o3gY3WaBYVNnaWhikBYFcIxDXY\nhruRlEFPdCNMgC0lxUqXdcOa3FxAscPPVb1mbxUCgYAtrm6VqBzICdq5BEeOfRe+\nmZvp02rBzTM0rSSXxuhL2zAAA9Y10shQVG7FcC2SrYErx9VHDeQwBGGtjjGGxhJo\nRj7dDcD4oL6Y50a1e0eKUCiYkD9cXZdKcbnkV7zXiAtYPPqhOjbts7kzUY41LaaX\nitZBi5ufwy3S+04RJD+Dfg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@glow-worm-studio.iam.gserviceaccount.com",
  client_id: "106669859274138345220",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40glow-worm-studio.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Firebase Admin configuration
const firebaseAdminConfig = {
  credential: cert(serviceAccount as any),
  storageBucket: 'glow-worm-studio.firebasestorage.app',
};

// Initialize Firebase Admin (server-side only)
let app: any = null;
let adminAuth: any = null;
let adminDb: any = null;
let adminStorage: any = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseAdminConfig);
    console.log('🔥 Firebase Admin initialized successfully');
  } else {
    app = getApps()[0];
    console.log('🔥 Firebase Admin already initialized');
  }

  // Initialize services
  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
  adminStorage = getStorage(app);
  
  console.log('✅ Firebase Admin services ready:', {
    auth: !!adminAuth,
    db: !!adminDb,
    storage: !!adminStorage
  });
  
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error);
  app = null;
  adminAuth = null;
  adminDb = null;
  adminStorage = null;
}

// Export Firebase Admin services
export { adminAuth, adminDb, adminStorage };

// Helper function to check if Firebase Admin is configured
export const isFirebaseAdminConfigured = () => {
  const configured = !!(adminAuth && adminDb && adminStorage);
  console.log('🔍 Firebase Admin configured:', configured);
  return configured;
};

export default app;
