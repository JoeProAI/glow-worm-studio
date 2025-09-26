'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Upload, Image as ImageIcon, Video, File } from "lucide-react";
import { MediaService, MediaFile } from "../../../lib/media-service";

// Simple mock user for demo
const mockUser = {
  uid: 'demo-user-123',
  email: 'demo@example.com',
  displayName: 'Demo User'
};

export default function Dashboard() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        console.log(`⚡ Processing ${file.name}`);
        
        try {
          const uploadedFile = await MediaService.uploadFile(file, mockUser.uid);
          setFiles(prev => [uploadedFile, ...prev]);
          console.log(`🔥 File uploaded: ${file.name}`);
        } catch (fileError) {
          console.error(`Failed to process ${file.name}:`, fileError);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'audio/*': ['.mp3', '.wav', '.aac']
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🪱 Glow Worm Studio
          </h1>
          <p className="text-gray-300">
            Professional Media Management Platform
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8 border-emerald-500/20 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-gray-600 hover:border-emerald-500/50 hover:bg-emerald-500/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-emerald-400 text-lg">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-white text-lg mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports images, videos, and audio files
                  </p>
                </div>
              )}
            </div>
            
            {uploading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-emerald-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                  Uploading files...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files Grid */}
        {files.length > 0 && (
          <Card className="border-emerald-500/20 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">
                Your Files ({files.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    {file.type.startsWith('image/') && (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {files.length === 0 && !uploading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No files uploaded yet</p>
              <p className="text-sm">Upload your first file to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
