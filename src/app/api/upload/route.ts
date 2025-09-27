import { NextRequest, NextResponse } from 'next/server';
import { adminStorage, adminDb, isFirebaseAdminConfigured } from '../../../../lib/firebase-admin-final';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Upload API called');
    
    // Debug Firebase Admin state
    console.log('🔍 Firebase Admin services:', {
      adminStorage: !!adminStorage,
      adminDb: !!adminDb,
      isConfigured: isFirebaseAdminConfigured()
    });
    
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      console.error('❌ Firebase Admin not configured');
      return NextResponse.json(
        { error: 'Firebase Admin not configured - check server logs' },
        { status: 500 }
      );
    }
    
    console.log('✅ Firebase Admin is configured');

    // Get the uploaded file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileId = uuidv4();
    const fileName = `${userId}/${fileId}_${file.name}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Firebase Storage
    const bucket = adminStorage!.bucket();
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    // Get download URL
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Save file metadata to Firestore
    const fileMetadata = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: downloadURL,
      path: fileName,
      uploadedBy: userId,
      uploadedAt: new Date(),
      tags: [],
      description: '',
    };

    await adminDb!.collection('files').doc(fileId).set(fileMetadata);

    return NextResponse.json({
      success: true,
      file: fileMetadata,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
