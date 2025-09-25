'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useAuth } from "../../../lib/auth-context";
import { Upload, Image as ImageIcon, Video, File, Zap, Grid3X3, List, Search, Filter, Plus, Trash2, Tag } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { MediaService, MediaFile } from "../../../lib/media-service";
import { AIAnalysis } from "../../../lib/ai-service";

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'images' | 'videos' | 'documents'>('all');

  // Load user's media files
  useEffect(() => {
    if (user) {
      loadUserMedia();
    }
  }, [user]);

  const loadUserMedia = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userFiles = await MediaService.getUserMedia(user.uid);
      setFiles(userFiles);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        // First, analyze the file with AI
        const formData = new FormData();
        formData.append('file', file);
        
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          body: formData
        });
        
        let aiAnalysis: AIAnalysis | undefined;
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          aiAnalysis = analysisData.analysis;
        }
        
        // Upload to Firebase with AI analysis
        const uploadedFile = await MediaService.uploadFile(file, user.uid, aiAnalysis);
        
        // Add to local state
        setFiles(prev => [uploadedFile, ...prev]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'audio/*': ['.mp3', '.wav', '.aac']
    }
  });

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'images' && file.type === 'image') ||
                         (selectedFilter === 'videos' && file.type === 'video') ||
                         (selectedFilter === 'documents' && file.type === 'document');
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!user) return;
    
    try {
      await MediaService.deleteFile(fileId, user.uid);
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Please sign in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Media Intelligence</h1>
              <p className="text-gray-400">Welcome back, {userProfile?.displayName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {userProfile?.storageUsed ? formatFileSize(userProfile.storageUsed) : '0 MB'} / {userProfile?.storageLimit ? formatFileSize(userProfile.storageLimit) : '1 GB'}
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full" 
                  style={{ width: `${((userProfile?.storageUsed || 0) / (userProfile?.storageLimit || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragActive 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {isDragActive ? 'Drop files here' : 'Upload your media'}
                  </h3>
                  <p className="text-gray-400">
                    Drag and drop files or click to browse. Supports images, videos, and audio.
                  </p>
                </div>
                {uploading && (
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                    <span>Processing with AI...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by filename or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'images' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('images')}
            >
              Images
            </Button>
            <Button
              variant={selectedFilter === 'videos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('videos')}
            >
              Videos
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="group hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <img 
                    src={file.thumbnailUrl || file.url} 
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                      {getFileIcon(file.type)}
                      <span className="text-xs text-white">{file.type.toUpperCase()}</span>
                    </div>
                  </div>
                  {file.aiAnalysis && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">{Math.round(file.aiAnalysis.confidence * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-2 truncate">{file.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{file.aiAnalysis?.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {file.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md">
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md">
                        +{file.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.uploadedAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="hover:border-emerald-500/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={file.thumbnailUrl || file.url} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getFileIcon(file.type)}
                        <h3 className="font-medium text-white truncate">{file.name}</h3>
                        {file.aiAnalysis && (
                          <div className="bg-emerald-500/20 rounded px-2 py-1 flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">{Math.round(file.aiAnalysis.confidence * 100)}%</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{file.aiAnalysis?.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{formatFileSize(file.size)}</div>
                      <div>{file.uploadedAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No media found</h3>
            <p className="text-gray-400">Upload some files to get started with AI-powered organization.</p>
          </div>
        )}
      </div>
    </div>
  );
}
