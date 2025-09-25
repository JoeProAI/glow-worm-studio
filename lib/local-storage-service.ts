/**
 * Local Storage Service - Browser-based file storage using IndexedDB
 * Provides persistent storage without external dependencies
 */

export interface StoredFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'audio' | 'document';
  mimeType: string;
  size: number;
  data: ArrayBuffer; // Store actual file data
  uploadedAt: Date;
  userId: string;
  tags: string[];
  isPublic: boolean;
  analysis?: {
    description: string;
    objects: string[];
    colors: string[];
    mood: string;
    confidence: number;
    tags: string[];
  };
}

class LocalStorageService {
  private dbName = 'GlowWormStudio';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create files store
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'id' });
          filesStore.createIndex('userId', 'userId', { unique: false });
          filesStore.createIndex('uploadedAt', 'uploadedAt', { unique: false });
        }
      };
    });
  }

  async uploadFile(file: File, userId: string): Promise<StoredFile> {
    if (!this.db) await this.initialize();

    // Convert file to ArrayBuffer for storage
    const arrayBuffer = await file.arrayBuffer();
    
    const storedFile: StoredFile = {
      id: Date.now().toString() + Math.random().toString(36),
      name: file.name,
      originalName: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'document',
      mimeType: file.type,
      size: file.size,
      data: arrayBuffer,
      uploadedAt: new Date(),
      userId,
      tags: [file.type.split('/')[1] || 'file', 'uploaded'],
      isPublic: false
    };

    // Store in IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.add(storedFile);

      request.onsuccess = () => resolve(storedFile);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserFiles(userId: string): Promise<StoredFile[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const files = request.result.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        resolve(files);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(fileId: string): Promise<StoredFile | null> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(fileId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.delete(fileId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  createFileURL(storedFile: StoredFile): string {
    // Create blob URL from stored data
    const blob = new Blob([storedFile.data], { type: storedFile.mimeType });
    return URL.createObjectURL(blob);
  }

  async getStorageUsage(userId: string): Promise<number> {
    const files = await this.getUserFiles(userId);
    return files.reduce((total, file) => total + file.size, 0);
  }

  // Convert StoredFile to MediaFile format for compatibility
  toMediaFile(storedFile: StoredFile): any {
    return {
      id: storedFile.id,
      name: storedFile.name,
      originalName: storedFile.originalName,
      type: storedFile.type,
      mimeType: storedFile.mimeType,
      size: storedFile.size,
      url: this.createFileURL(storedFile),
      uploadedAt: storedFile.uploadedAt,
      userId: storedFile.userId,
      tags: storedFile.tags,
      isPublic: storedFile.isPublic,
      analysis: storedFile.analysis
    };
  }
}

export const localStorageService = new LocalStorageService();
