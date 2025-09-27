import { NextRequest, NextResponse } from 'next/server';
import { adminStorage, adminDb, isFirebaseAdminConfigured } from '../../../../../lib/firebase-admin-final';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 500 }
      );
    }

    const fileId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get file metadata from Firestore
    const fileDoc = await adminDb!.collection('files').doc(fileId).get();
    
    if (!fileDoc.exists) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const fileData = fileDoc.data();
    
    // Verify user owns the file
    if (fileData?.uploadedBy !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete from Firebase Storage
    const bucket = adminStorage!.bucket();
    const fileRef = bucket.file(fileData.path);
    
    try {
      await fileRef.delete();
    } catch (storageError) {
      console.warn('Storage deletion failed:', storageError);
      // Continue with Firestore deletion even if storage fails
    }

    // Delete from Firestore
    await adminDb!.collection('files').doc(fileId).delete();

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
