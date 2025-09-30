'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { useAuth } from "../../../../lib/auth-context";
import { MediaService, MediaFile } from "../../../../lib/media-service";
import { 
  ArrowLeft,
  Download,
  Heart,
  Tag,
  Zap,
  Palette,
  Eye,
  FileText,
  Sparkles,
  Copy,
  Check
} from "lucide-react";

export default function MediaDetail() {
  const params = useParams();
  const { user } = useAuth();
  const [file, setFile] = useState<MediaFile | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    score: number;
    reason: string;
    file: MediaFile;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const loadFileDetails = useCallback(async () => {
    if (!user) return;
    
    try {
      // Get all user files to find the specific one and generate recommendations
      const allFiles = await MediaService.getUserMedia(user.uid);
      const currentFile = allFiles.find(f => f.id === params.id);
      
      if (currentFile) {
        setFile(currentFile);
        
        // Get recommendations
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId: currentFile.id,
            files: allFiles
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      }
    } catch (error) {
      console.error('Failed to load file details:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, params.id]);

  useEffect(() => {
    if (user && params.id) {
      loadFileDetails();
    }
  }, [user, params.id, loadFileDetails]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading media details...</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">File Not Found</h2>
            <p className="text-gray-400 mb-6">The requested media file could not be found.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{file.originalName}</h1>
                <p className="text-gray-400">Uploaded {file.uploadedAt.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={liked ? 'text-red-400 border-red-400' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className={copied ? 'text-green-400 border-green-400' : ''}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Media Display */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-contain"
                    />
                  ) : file.type === 'video' ? (
                    <video
                      src={file.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">{file.originalName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {file.aiAnalysis && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-emerald-400" />
                    AI Analysis
                    <span className="ml-auto text-sm font-normal text-gray-400">
                      {Math.round(file.aiAnalysis.confidence * 100)}% confidence
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                    <p className="text-white">{file.aiAnalysis.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Objects Detected
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {file.aiAnalysis.objects.map((object: string) => (
                          <span key={object} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            {object}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Palette className="w-4 h-4 mr-1" />
                        Colors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {file.aiAnalysis.colors.map((color: string) => (
                          <span key={color} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Mood</h4>
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm capitalize">
                      {file.aiAnalysis.mood}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  File Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">{file.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white">{file.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uploaded</span>
                  <span className="text-white">{file.uploadedAt.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {file.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Similar Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {recommendations.slice(0, 6).map((rec) => (
                      <div 
                        key={rec.id} 
                        className="group cursor-pointer"
                        onClick={() => window.location.href = `/media/${rec.id}`}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-2">
                          <img
                            src={rec.file.thumbnailUrl || rec.file.url}
                            alt={rec.file.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs text-gray-400 truncate">{rec.file.originalName}</p>
                        <p className="text-xs text-emerald-400">{Math.round(rec.score * 100)}% match</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
