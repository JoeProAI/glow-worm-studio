'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Zap, 
  Cloud, 
  Cpu, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Server
} from "lucide-react";

export interface ProcessingStatus {
  fileName: string;
  fileSize: number;
  status: 'analyzing' | 'uploading' | 'completed' | 'error';
  processingMethod?: 'local' | 'sandbox';
  complexity?: 'simple' | 'medium' | 'complex' | 'enterprise';
  processingTime?: number;
  sandboxId?: string;
  progress: number;
  error?: string;
}

interface ProcessingStatusProps {
  files: ProcessingStatus[];
  onComplete?: (fileName: string) => void;
}

export function ProcessingStatusPanel({ files, onComplete }: ProcessingStatusProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const getStatusIcon = (status: string, processingMethod?: string) => {
    switch (status) {
      case 'analyzing':
        return processingMethod === 'sandbox' ? 
          <Server className="w-4 h-4 text-blue-400 animate-pulse" /> :
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />;
      case 'uploading':
        return <Cloud className="w-4 h-4 text-cyan-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing': return 'bg-blue-500/20 text-blue-300';
      case 'uploading': return 'bg-cyan-500/20 text-cyan-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'error': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'complex': return 'bg-orange-500/20 text-orange-300';
      case 'enterprise': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatProcessingTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (files.length === 0) return null;

  return (
    <Card className="mb-6 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-emerald-400" />
            AI Processing Status
          </h3>
          <Badge variant="outline" className="text-gray-300">
            {files.filter(f => f.status !== 'completed' && f.status !== 'error').length} active
          </Badge>
        </div>

        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={`${file.fileName}-${index}`} className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(file.status, file.processingMethod)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.processingMethod && (
                    <Badge 
                      variant="outline" 
                      className={file.processingMethod === 'sandbox' ? 'text-blue-300 border-blue-500' : 'text-emerald-300 border-emerald-500'}
                    >
                      {file.processingMethod === 'sandbox' ? '🏗️ Sandbox' : '⚡ Local'}
                    </Badge>
                  )}
                  
                  {file.complexity && (
                    <Badge variant="outline" className={getComplexityColor(file.complexity)}>
                      {file.complexity}
                    </Badge>
                  )}

                  <Badge className={getStatusColor(file.status)}>
                    {file.status}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <Progress 
                  value={file.progress} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{file.progress}%</span>
                  {file.processingTime && (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatProcessingTime(file.processingTime)}
                    </span>
                  )}
                </div>
              </div>

              {/* Expandable Details */}
              {(file.sandboxId || file.error) && (
                <div className="mt-2">
                  <button
                    onClick={() => setExpandedFile(expandedFile === file.fileName ? null : file.fileName)}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {expandedFile === file.fileName ? '▼ Hide Details' : '▶ Show Details'}
                  </button>
                  
                  {expandedFile === file.fileName && (
                    <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs space-y-1">
                      {file.sandboxId && (
                        <div className="flex items-center text-blue-300">
                          <Server className="w-3 h-3 mr-1" />
                          Sandbox ID: <code className="ml-1 bg-gray-700 px-1 rounded">{file.sandboxId}</code>
                        </div>
                      )}
                      {file.error && (
                        <div className="flex items-center text-red-300">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error: {file.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing processing status
export function useProcessingStatus() {
  const [processingFiles, setProcessingFiles] = useState<ProcessingStatus[]>([]);

  const addFile = (fileName: string, fileSize: number) => {
    const newFile: ProcessingStatus = {
      fileName,
      fileSize,
      status: 'analyzing',
      progress: 0
    };
    setProcessingFiles(prev => [...prev, newFile]);
  };

  const updateFile = (fileName: string, updates: Partial<ProcessingStatus>) => {
    setProcessingFiles(prev => 
      prev.map(file => 
        file.fileName === fileName 
          ? { ...file, ...updates }
          : file
      )
    );
  };

  const removeFile = (fileName: string) => {
    setProcessingFiles(prev => prev.filter(file => file.fileName !== fileName));
  };

  const clearCompleted = () => {
    setProcessingFiles(prev => prev.filter(file => file.status !== 'completed'));
  };

  return {
    processingFiles,
    addFile,
    updateFile,
    removeFile,
    clearCompleted
  };
}
