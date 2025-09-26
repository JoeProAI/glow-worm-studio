import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Hard-coded Firebase Admin credentials (for immediate fix)
const serviceAccount = {
  projectId: 'glow-worm-studio',
  clientEmail: 'firebase-adminsdk-fbsvc@glow-worm-studio.iam.gserviceaccount.com',
  privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCEJ1Tu5hHVLxXM
pZhQEoDwD+80JvVbOtNVz1POViLWE5hzP0Fb6/9eSS0B2Lvr7okPO7ro5yYnORFd
hW+LeCQ+1s0NGQ/wl22mf42kKOtMVw5MAU6t3xP76Szi2nspK+MuB9Jg9MYj4KsT
4lR7E24d4/hz/gXc6q4bAZrkvnfrE4Aiyz64QhMoTwqoM6/DMp4AC23O27IzqaPX
cJSXQ/M2M5GKegQCnmB0sdhtoFsopXBJ0ckSagws1b+Js+8mBCwLim3BlT3gHQwC
JDMZp+piOJYt0ZfmxpMnjTkpGH4lWbVXhsdDP2oyYv1uIi1BBs7ewkmACMlZAcjG
gP2kZ59vAgMBAAECggEABjv4xMBebP59+nEsFfLu2Y8Bi3tJrdZrloEOWg3e3Ncr
JPIB+lJ6xzmP1vt2JLN/DGnr77Af26Up4uM4QjhrtU8wIy2108rA+yQfTB7mDWw5
729MWpAgguIazPozlIX5Kfhn000Yynkpzj6qGkLuD0OW5USW2uId+TDX3BykJEHD
j0hvjoB7XV5yAcqdRW5YHTmLYFCDLbKPXZLF4xmMi2SSz+pTDDrImsewIpOhebQL
mDMYE88aqXZGMKhKH1gjVeweZ6jlg7qgwYDADq6dJ1ULdSPtncJUREp0Rrps19rd
MtNRl/L9xXPxNS1f1mWC89PN+PIoXsqogNHWj7z+OQKBgQC5OwOr0W+aICw14oj4
BGx7lCvUjzzVf7fHrbRGv8l7njfVeqnxlfKhfHsEqFMs3G0ODNl71g2UDnAgmcvx
Ulv0XiDC3PETv2zSDtV2PaII8b2lZ1kZDqTt95sO0+iyjpqctmeBqhgAgDCXSx0M
pupTtnHFrw27cmuE4m/grv/QzQKBgQC2pPw//kCVo4u9Q5Y0eIGAKai7rcIRYECZ
xXobLTn3HZASzJCz9JCgujKqn4j14Y3eAjunKwpRJ4K2rgKlEH7z6WhQy0A79h2f
3tAyErNIwTJsG/Jm6ZRvnhHcEY+pZUEe1nW2Gw0o6DxkHK3EysxalnaCtJGCWpeJ
vLwR+xnBKwKBgDs8Ehp6KXRiYYEB5sdZss96POIGxG+KHl1uwT32yxoLKNPOHFaz
mxnlUvnUUnUAMKfTmCEv/LuiOl1SkZOkwN9O0q8+NKIaD1TFhaIAZ7bwh7NDb4zB
0CCBlEaTodCoJe2Dr2oZ2P8f/2oCjVGkdz86Evwi1QNivduLBjgV/pzpAoGAdaJ5
nTXCnx5AyFuZiJ38unEabhaRoeNeeCvKY2qTpOdzfcgnguAHrp1+OIqcCdGGL/E8
PoToFjDebY5RwcKIIcy5FSBzdKsllWxKp5WHx1o3gY3WaBYVNnaWhikBYFcIxDXY
hruRlEFPdCNMgC0lxUqXdcOa3FxAscPPVb1mbxUCgYAtrm6VqBzICdq5BEeOfRe+
mZvp02rBzTM0rSSXxuhL2zAAA9Y10shQVG7FcC2SrYErx9VHDeQwBGGtjjGGxhJo
Rj7dDcD4oL6Y50a1e0eKUCiYkD9cXZdKcbnkV7zXiAtYPPqhOjbts7kzUY41LaaX
itZBi5ufwy3S+04RJD+Dfg==
-----END PRIVATE KEY-----`
};

// Firebase Admin configuration
const firebaseAdminConfig = {
  credential: cert(serviceAccount),
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
