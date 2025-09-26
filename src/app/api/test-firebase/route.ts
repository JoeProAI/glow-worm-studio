import { NextRequest, NextResponse } from 'next/server';
import { adminStorage, adminDb, adminAuth, isFirebaseAdminConfigured } from '../../../../lib/firebase-admin';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing Firebase Admin configuration...');
  
  const status = {
    adminAuth: !!adminAuth,
    adminDb: !!adminDb,
    adminStorage: !!adminStorage,
    isConfigured: isFirebaseAdminConfigured(),
    timestamp: new Date().toISOString()
  };
  
  console.log('🧪 Firebase Admin status:', status);
  
  return NextResponse.json({
    success: true,
    firebase: status,
    message: status.isConfigured ? 'Firebase Admin is working!' : 'Firebase Admin failed to initialize'
  });
}
