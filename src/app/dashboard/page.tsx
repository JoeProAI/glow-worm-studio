'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Upload, Image as ImageIcon, Video, File, Sparkles, Play, Download, Trash2, Loader2, LogOut, User } from "lucide-react";
import { MediaService, MediaFile } from "../../../lib/media-service";
import { useAuth } from "../../../lib/auth-context";
import { AuthModal } from "../../../components/auth/auth-modal";

interface GeneratedVideo {
  id: string;
  prompt: string;
  status: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export default function Dashboard() {
  const { user, userProfile, logout, loading } = useAuth();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <User className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-8">
            You need to sign in to access the Glow Studio dashboard and start creating amazing content.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setAuthModalOpen(true)}
              className="w-full bg-white text-black hover:bg-gray-100 font-medium"
            >
              Sign In to Continue
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-900"
            >
              Back to Home
            </Button>
          </div>
        </div>
        
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode="signin"
        />
      </div>
    );
  }

  // Get user ID for file operations
  const userId = user.uid;

  const loadFiles = useCallback(async () => {
    if (!user) return;
    try {
      const userFiles = await MediaService.getFiles(user.uid);
      setFiles(userFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  }, [user]);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        setUploadStatus(`Processing ${file.name}...`);
        
        try {
          const uploadedFile = await MediaService.uploadFile(file, userId);
          setFiles(prev => [uploadedFile, ...prev]);
          setUploadStatus(`✅ ${file.name} uploaded successfully`);
        } catch (fileError) {
          setUploadStatus(`❌ Failed to upload ${file.name}: ${fileError}`);
          console.error(`Failed to process ${file.name}:`, fileError);
        }
      }
    } catch (error) {
      setUploadStatus(`❌ Upload failed: ${error}`);
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(''), 3000);
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

  const generateVideo = async () => {
    if (!videoPrompt.trim()) return;
    
    setGeneratingVideo(true);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt })
      });

      const result = await response.json();
      
      if (result.success) {
        const newVideo: GeneratedVideo = {
          id: result.generationId,
          prompt: videoPrompt,
          status: result.status
        };
        
        setGeneratedVideos(prev => [newVideo, ...prev]);
        setVideoPrompt('');
        
        // Start polling for completion
        pollVideoStatus(result.generationId);
      } else {
        alert('Failed to generate video: ' + result.error);
      }
    } catch (error) {
      console.error('Video generation failed:', error);
      alert('Video generation failed');
    } finally {
      setGeneratingVideo(false);
    }
  };

  const pollVideoStatus = async (generationId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/check-video?id=${generationId}`);
        const result = await response.json();
        
        if (result.success) {
          setGeneratedVideos(prev => 
            prev.map(video => 
              video.id === generationId 
                ? { ...video, status: result.status, videoUrl: result.videoUrl, thumbnailUrl: result.thumbnailUrl }
                : video
            )
          );
          
          if (result.status === 'completed' || result.status === 'failed') {
            return; // Stop polling
          }
        }
        
        // Continue polling if not complete
        setTimeout(poll, 5000);
      } catch (error) {
        console.error('Failed to check video status:', error);
      }
    };
    
    poll();
  };

  const deleteFile = async (fileId: string) => {
    try {
      await MediaService.deleteFile(fileId, userId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* User Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎬 Glow Studio Pro
            </h1>
            <p className="text-slate-300">
              AI-Powered Media Creation & Management Platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{userProfile?.displayName || user.email}</p>
              <p className="text-slate-400 text-sm">{userProfile?.subscription || 'Free'} Plan</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* AI Video Generation */}
        <Card className="mb-8 border-purple-500/20 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Video Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                disabled={generatingVideo}
              />
              <Button
                onClick={generateVideo}
                disabled={generatingVideo || !videoPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generatingVideo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Videos */}
        {generatedVideos.length > 0 && (
          <Card className="mb-8 border-purple-500/20 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Generated Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                  >
                    <div className="mb-3">
                      <p className="text-white font-medium text-sm mb-1">
                        {video.prompt}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          video.status === 'completed' ? 'bg-green-400' :
                          video.status === 'failed' ? 'bg-red-400' :
                          'bg-yellow-400 animate-pulse'
                        }`} />
                        <span className="text-gray-400 text-xs capitalize">
                          {video.status}
                        </span>
                      </div>
                    </div>
                    
                    {video.videoUrl ? (
                      <div className="space-y-2">
                        <video
                          src={video.videoUrl}
                          controls
                          className="w-full h-32 object-cover rounded-md"
                          poster={video.thumbnailUrl}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                            onClick={() => window.open(video.videoUrl, '_blank')}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = video.videoUrl!;
                              a.download = `generated-video-${video.id}.mp4`;
                              a.click();
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-700/50 rounded-md flex items-center justify-center">
                        {video.status === 'failed' ? (
                          <span className="text-red-400 text-sm">Generation failed</span>
                        ) : (
                          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload */}
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
            
            {(uploading || uploadStatus) && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-emerald-400">
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{uploadStatus || 'Uploading files...'}</span>
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {file.type.startsWith('image/') && (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    
                    {file.type.startsWith('video/') && (
                      <video
                        src={file.url}
                        className="w-full h-32 object-cover rounded-md mb-3"
                        controls
                      />
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = file.url;
                          a.download = file.name;
                          a.click();
                        }}
                      >
                        <Download className="w-3 h-3" />
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
              <p className="text-sm">Upload your first file or generate a video to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
