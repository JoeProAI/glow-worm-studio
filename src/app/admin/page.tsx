'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useAuth } from "../../../lib/auth-context";
import { 
  Server, 
  Activity, 
  Clock, 
  Zap, 
  TrendingUp, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface SandboxMetrics {
  totalSandboxes: number;
  activeSandboxes: number;
  completedSandboxes: number;
  failedSandboxes: number;
  averageProcessingTime: number;
  totalProcessingTime: number;
  sandboxesByComplexity: {
    simple: number;
    medium: number;
    complex: number;
    enterprise: number;
  };
  recentActivity: SandboxActivity[];
}

interface SandboxActivity {
  id: string;
  fileName: string;
  userId: string;
  processingMethod: 'local' | 'sandbox';
  complexity: 'simple' | 'medium' | 'complex' | 'enterprise';
  status: 'completed' | 'failed' | 'running';
  processingTime: number;
  timestamp: Date;
  sandboxId?: string;
  error?: string;
}

export default function AdminPanel() {
  const { user, userProfile } = useAuth();
  const [metrics, setMetrics] = useState<SandboxMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMetrics = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Mock data for demonstration - in production, this would come from your backend
      const mockMetrics: SandboxMetrics = {
        totalSandboxes: 247,
        activeSandboxes: 3,
        completedSandboxes: 231,
        failedSandboxes: 13,
        averageProcessingTime: 45000, // 45 seconds
        totalProcessingTime: 11385000, // ~3 hours
        sandboxesByComplexity: {
          simple: 89,
          medium: 102,
          complex: 45,
          enterprise: 11
        },
        recentActivity: [
          {
            id: '1',
            fileName: 'large_video_4k.mp4',
            userId: 'user_123',
            processingMethod: 'sandbox',
            complexity: 'enterprise',
            status: 'completed',
            processingTime: 180000,
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            sandboxId: 'sb_abc123'
          },
          {
            id: '2',
            fileName: 'photo_batch_50.zip',
            userId: 'user_456',
            processingMethod: 'sandbox',
            complexity: 'complex',
            status: 'running',
            processingTime: 0,
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            sandboxId: 'sb_def456'
          },
          {
            id: '3',
            fileName: 'presentation.pdf',
            userId: 'user_789',
            processingMethod: 'local',
            complexity: 'simple',
            status: 'completed',
            processingTime: 3000,
            timestamp: new Date(Date.now() - 10 * 60 * 1000)
          },
          {
            id: '4',
            fileName: 'corrupted_file.mov',
            userId: 'user_321',
            processingMethod: 'sandbox',
            complexity: 'medium',
            status: 'failed',
            processingTime: 15000,
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            sandboxId: 'sb_ghi789',
            error: 'File format not supported'
          }
        ]
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const refreshMetrics = async () => {
    setRefreshing(true);
    await loadMetrics();
    setRefreshing(false);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-500/20 text-green-300 border-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 'complex': return 'bg-orange-500/20 text-orange-300 border-orange-500';
      case 'enterprise': return 'bg-red-500/20 text-red-300 border-red-500';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
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
            <p className="text-gray-400">Admin access required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin metrics...</p>
        </div>
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
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Server className="w-6 h-6 mr-3 text-emerald-400" />
                Daytona Admin Panel
              </h1>
              <p className="text-gray-400">Monitor sandbox usage and AI processing metrics</p>
            </div>
            <Button 
              onClick={refreshMetrics} 
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Sandboxes</p>
                  <p className="text-2xl font-bold text-white">{metrics?.totalSandboxes}</p>
                </div>
                <Server className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Now</p>
                  <p className="text-2xl font-bold text-white">{metrics?.activeSandboxes}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics ? Math.round((metrics.completedSandboxes / metrics.totalSandboxes) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Avg Processing</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics ? formatDuration(metrics.averageProcessingTime) : '0s'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complexity Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-emerald-400" />
              Processing Complexity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics && Object.entries(metrics.sandboxesByComplexity).map(([complexity, count]) => (
                <div key={complexity} className="text-center">
                  <Badge variant="outline" className={getComplexityColor(complexity)}>
                    {complexity}
                  </Badge>
                  <p className="text-2xl font-bold text-white mt-2">{count}</p>
                  <p className="text-sm text-gray-400">
                    {Math.round((count / metrics.totalSandboxes) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-400" />
              Recent Processing Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-white">{activity.fileName}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{activity.timestamp.toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>User: {activity.userId.slice(0, 8)}...</span>
                        {activity.sandboxId && (
                          <>
                            <span>•</span>
                            <span>Sandbox: {activity.sandboxId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={activity.processingMethod === 'sandbox' ? 'text-blue-300 border-blue-500' : 'text-emerald-300 border-emerald-500'}
                    >
                      {activity.processingMethod === 'sandbox' ? '🏗️ Sandbox' : '⚡ Local'}
                    </Badge>
                    
                    <Badge variant="outline" className={getComplexityColor(activity.complexity)}>
                      {activity.complexity}
                    </Badge>

                    <div className="text-sm text-gray-400 min-w-0">
                      {activity.status === 'running' ? 'Processing...' : formatDuration(activity.processingTime)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
