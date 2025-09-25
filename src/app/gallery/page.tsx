'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useAuth } from "../../../lib/auth-context";
import { MediaService, MediaFile } from "../../../lib/media-service";
import { 
  Sparkles, 
  Palette, 
  Clock, 
  Network, 
  Grid3X3, 
  Zap,
  Eye,
  Heart,
  Share2,
  Download,
  Filter,
  Search
} from "lucide-react";
import { Input } from "../../../components/ui/input";

type GalleryView = 'constellation' | 'timeline' | 'mood' | 'neural' | 'mosaic';

export default function Gallery() {
  const { user } = useAuth();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<GalleryView>('constellation');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadUserMedia();
    }
  }, [user]);

  const loadUserMedia = async () => {
    if (!user) return;
    
    try {
      const userFiles = await MediaService.getUserMedia(user.uid);
      setFiles(userFiles);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = selectedMood === 'all' || file.aiAnalysis?.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const getUniqueColors = () => {
    const colors = new Set<string>();
    files.forEach(file => {
      file.aiAnalysis?.colors.forEach(color => colors.add(color));
    });
    return Array.from(colors);
  };

  const getUniqueMoods = () => {
    const moods = new Set<string>();
    files.forEach(file => {
      if (file.aiAnalysis?.mood) moods.add(file.aiAnalysis.mood);
    });
    return Array.from(moods);
  };

  const ConstellationView = () => (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0">
        {filteredFiles.map((file, index) => {
          const x = Math.random() * 80 + 10; // 10-90%
          const y = Math.random() * 80 + 10; // 10-90%
          const size = 120 + (file.aiAnalysis?.confidence || 0.5) * 80; // 120-200px based on confidence
          
          return (
            <div
              key={file.id}
              className="absolute group cursor-pointer transition-all duration-500 hover:scale-110 hover:z-10"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              <div className="relative w-full h-full">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle, ${file.aiAnalysis?.colors[0] || '#10b981'}, transparent)`
                  }}
                ></div>
                
                {/* Image */}
                <img
                  src={file.thumbnailUrl || file.url}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-full border-2 border-white/20 group-hover:border-emerald-400/50 transition-all duration-300"
                />
                
                {/* AI confidence indicator */}
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {Math.round((file.aiAnalysis?.confidence || 0) * 100)}%
                </div>
                
                {/* Hover info */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm whitespace-nowrap">
                  <div className="font-medium">{file.originalName}</div>
                  <div className="text-gray-300 text-xs">{file.aiAnalysis?.mood}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Connecting lines between related images */}
      <svg className="absolute inset-0 pointer-events-none opacity-20">
        {filteredFiles.slice(0, 10).map((file, i) => 
          filteredFiles.slice(i + 1, i + 3).map((otherFile, j) => (
            <line
              key={`${file.id}-${otherFile.id}`}
              x1={`${Math.random() * 80 + 10}%`}
              y1={`${Math.random() * 80 + 10}%`}
              x2={`${Math.random() * 80 + 10}%`}
              y2={`${Math.random() * 80 + 10}%`}
              stroke="url(#gradient)"
              strokeWidth="1"
              className="animate-pulse"
            />
          ))
        )}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const TimelineView = () => (
    <div className="space-y-8 p-8">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-cyan-500"></div>
        
        {filteredFiles.map((file, index) => (
          <div key={file.id} className="relative flex items-center mb-12">
            {/* Timeline dot */}
            <div className="absolute left-6 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black z-10"></div>
            
            {/* Content */}
            <div className="ml-20 flex-1">
              <Card className="group hover:border-emerald-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={file.thumbnailUrl || file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{file.originalName}</h3>
                        <span className="text-sm text-gray-400">
                          {file.uploadedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{file.aiAnalysis?.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {file.tags.slice(0, 5).map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>{Math.round((file.aiAnalysis?.confidence || 0) * 100)}% confidence</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Palette className="w-4 h-4 text-cyan-400" />
                          <span>{file.aiAnalysis?.mood}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MoodSpectrumView = () => {
    const colors = getUniqueColors();
    const moods = getUniqueMoods();
    
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {moods.map(mood => {
            const moodFiles = filteredFiles.filter(f => f.aiAnalysis?.mood === mood);
            return (
              <div key={mood} className="space-y-4">
                <h3 className="text-xl font-semibold text-white capitalize mb-4 flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    mood === 'peaceful' ? 'bg-green-500' :
                    mood === 'energetic' ? 'bg-orange-500' :
                    mood === 'professional' ? 'bg-blue-500' :
                    mood === 'creative' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  {mood} ({moodFiles.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {moodFiles.slice(0, 8).map(file => (
                    <div key={file.id} className="group relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={file.thumbnailUrl || file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                          <div className="text-sm font-medium">{file.originalName}</div>
                          <div className="text-xs text-gray-300">{Math.round((file.aiAnalysis?.confidence || 0) * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MosaicView = () => (
    <div className="p-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {filteredFiles.map(file => {
          const height = 200 + Math.random() * 200; // Random height between 200-400px
          return (
            <div key={file.id} className="break-inside-avoid group cursor-pointer">
              <Card className="overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
                <div className="relative" style={{ height: `${height}px` }}>
                  <img
                    src={file.thumbnailUrl || file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-medium mb-1 truncate">{file.originalName}</h3>
                      <p className="text-sm text-gray-200 line-clamp-2">{file.aiAnalysis?.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-xs">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>{Math.round((file.aiAnalysis?.confidence || 0) * 100)}%</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:text-emerald-400">
                            <Heart className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:text-emerald-400">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Gallery Access</h2>
            <p className="text-gray-400">Please sign in to view your AI-powered gallery.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Gallery</h1>
              <p className="text-gray-400">Immersive views powered by artificial intelligence</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Mood Filter */}
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Moods</option>
                {getUniqueMoods().map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* View Selector */}
          <div className="flex items-center space-x-2 mt-4">
            <Button
              variant={currentView === 'constellation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('constellation')}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Constellation</span>
            </Button>
            <Button
              variant={currentView === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('timeline')}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
            </Button>
            <Button
              variant={currentView === 'mood' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('mood')}
              className="flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Mood Spectrum</span>
            </Button>
            <Button
              variant={currentView === 'mosaic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('mosaic')}
              className="flex items-center space-x-2"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Mosaic</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Views */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your AI-powered gallery...</p>
          </div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No media found</h3>
            <p className="text-gray-400">Upload some files to see them in these amazing AI-powered views.</p>
          </div>
        </div>
      ) : (
        <>
          {currentView === 'constellation' && <ConstellationView />}
          {currentView === 'timeline' && <TimelineView />}
          {currentView === 'mood' && <MoodSpectrumView />}
          {currentView === 'mosaic' && <MosaicView />}
        </>
      )}
    </div>
  );
}
