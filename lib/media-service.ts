// Server-side API-based media service - no Firebase client imports

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  tags: string[];
}

export class MediaService {
  static async uploadFile(file: File, userId: string): Promise<MediaFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return result.file;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  static async getFiles(userId: string): Promise<MediaFile[]> {
    try {
      const response = await fetch(`/api/files?userId=${userId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch files');
      }

      const result = await response.json();
      return result.files;
    } catch (error) {
      console.error('Failed to get files:', error);
      throw new Error('Failed to load files');
    }
  }

  static async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/files/${fileId}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  static getFilesByTag(files: MediaFile[], tag: string): MediaFile[] {
    return files.filter(file => file.tags.includes(tag));
  }

  static getAllTags(files: MediaFile[]): string[] {
    const tags = files.flatMap(file => file.tags);
    return [...new Set(tags)];
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
