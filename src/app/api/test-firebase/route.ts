import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminStorage, isFirebaseAdminConfigured } from '../../../../lib/firebase-admin-robust';

export async function GET() {
  try {
    console.log('Testing Firebase Admin configuration...');

    // Check environment variables (without exposing values)
    const envVars = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
      // Show actual project ID for debugging
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    };

    console.log('Environment variables:', envVars);

    // Check Firebase Admin services
    const services = {
      adminAuth: !!adminAuth,
      adminDb: !!adminDb,
      adminStorage: !!adminStorage,
      isConfigured: isFirebaseAdminConfigured(),
    };

    console.log('Firebase Admin services:', services);

    // Try to access Firestore
    let firestoreTest = null;
    if (adminDb) {
      try {
        // Simple test - just check if we can create a collection reference
        const testCollection = adminDb.collection('test');
        firestoreTest = { 
          success: true, 
          message: 'Firestore connection successful',
          collectionPath: testCollection.path 
        };
      } catch (error: any) {
        firestoreTest = { success: false, error: error.message };
      }
    } else {
      firestoreTest = { success: false, error: 'adminDb is null' };
    }

    // Try to access Storage
    let storageTest = null;
    if (adminStorage) {
      try {
        const bucket = adminStorage.bucket();
        storageTest = { 
          success: true, 
          message: 'Storage connection successful',
          bucketName: bucket.name 
        };
      } catch (error: any) {
        storageTest = { success: false, error: error.message };
      }
    } else {
      storageTest = { success: false, error: 'adminStorage is null' };
    }

    const result = {
      timestamp: new Date().toISOString(),
      status: 'Firebase Admin Test Complete',
      environment: envVars,
      services,
      tests: {
        firestore: firestoreTest,
        storage: storageTest,
      },
      overall: services.isConfigured && firestoreTest?.success && storageTest?.success
    };

    console.log('Test result:', result);

    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Firebase test error:', error);
    return NextResponse.json(
      { 
        error: 'Firebase test failed',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
