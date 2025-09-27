import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Starting Firebase Admin debug...');
    
    // Test 1: Can we import firebase-admin?
    let firebaseAdminImport = null;
    try {
      const admin = await import('firebase-admin');
      firebaseAdminImport = { success: true, hasDefault: !!admin.default, hasApps: Array.isArray(admin.default?.apps) };
      console.log('✅ Firebase Admin imported successfully');
    } catch (error: any) {
      firebaseAdminImport = { success: false, error: error.message };
      console.error('❌ Failed to import firebase-admin:', error);
    }
    
    // Test 2: Environment variables
    const envVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'SET (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'NOT SET',
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    };
    
    // Test 3: Try minimal initialization
    let minimalInit = null;
    if (firebaseAdminImport.success) {
      try {
        const admin = (await import('firebase-admin')).default;
        
        // Check if already initialized
        if (admin.apps.length > 0) {
          minimalInit = { success: true, message: 'Already initialized', appCount: admin.apps.length };
        } else {
          // Try to initialize with minimal config
          const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
          };
          
          const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
          });
          
          minimalInit = { 
            success: true, 
            message: 'Initialized successfully', 
            appName: app.name,
            appCount: admin.apps.length
          };
        }
      } catch (error: any) {
        minimalInit = { 
          success: false, 
          error: error.message,
          code: error.code,
          stack: error.stack?.substring(0, 300)
        };
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tests: {
        firebaseAdminImport,
        environmentVariables: envVars,
        minimalInitialization: minimalInit
      }
    });
    
  } catch (error: any) {
    console.error('❌ Debug test failed:', error);
    return NextResponse.json({
      error: 'Debug test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
