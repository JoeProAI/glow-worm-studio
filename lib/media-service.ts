import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { storage, db } from './firebase';
import { AIAnalysis } from './ai-service';

export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'audio' | 'document';
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  userId: string;
  tags: string[];
  aiAnalysis?: AIAnalysis;
  folder?: string;
  isPublic: boolean;
}

export class MediaService {
  static async uploadFile(
    file: File, 
    userId: string, 
    aiAnalysis?: AIAnalysis,
    folder?: string
  ): Promise<MediaFile> {
    if (!storage || !db) {
      throw new Error('Firebase not initialized');
    }

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = folder ? `${userId}/${folder}/${fileName}` : `${userId}/${fileName}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // Determine file type
      const type = this.getFileType(file.type);

      // Create media document
      const mediaData = {
        name: fileName,
        originalName: file.name,
        type,
        mimeType: file.type,
        size: file.size,
        url,
        uploadedAt: new Date(),
        userId,
        tags: aiAnalysis?.tags || [],
        aiAnalysis: aiAnalysis || null,
        folder: folder || null,
        isPublic: false
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'media'), mediaData);

      return {
        id: docRef.id,
        ...mediaData
      } as MediaFile;

    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  static async getUserMedia(userId: string): Promise<MediaFile[]> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const q = query(
        collection(db, 'media'),
        where('userId', '==', userId),
        orderBy('uploadedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const files: MediaFile[] = [];

      querySnapshot.forEach((doc) => {
        files.push({
          id: doc.id,
          ...doc.data()
        } as MediaFile);
      });

      return files;
    } catch (error) {
      console.error('Failed to fetch media:', error);
      return [];
    }
  }

  static async deleteFile(fileId: string, userId: string): Promise<void> {
    if (!storage || !db) {
      throw new Error('Firebase not initialized');
    }

    try {
      // Get file document
      const docRef = doc(db, 'media', fileId);
      
      // Delete from Storage
      // Note: In a real app, you'd want to get the file path from the document
      // For now, we'll skip the storage deletion in this demo
      
      // Delete from Firestore
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Delete failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  static async updateTags(fileId: string, tags: string[]): Promise<void> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docRef = doc(db, 'media', fileId);
      await updateDoc(docRef, { tags });
    } catch (error) {
      console.error('Tag update failed:', error);
      throw new Error('Failed to update tags');
    }
  }

  static async searchMedia(userId: string, query: string): Promise<MediaFile[]> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      // Get all user media first (Firestore doesn't support full-text search natively)
      const allMedia = await this.getUserMedia(userId);
      
      // Filter by query
      const searchTerm = query.toLowerCase();
      return allMedia.filter(file => 
        file.name.toLowerCase().includes(searchTerm) ||
        file.originalName.toLowerCase().includes(searchTerm) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        file.aiAnalysis?.description.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  private static getFileType(mimeType: string): 'image' | 'video' | 'audio' | 'document' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  static generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(''); // No thumbnail for non-images
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set thumbnail size
        const maxSize = 200;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
