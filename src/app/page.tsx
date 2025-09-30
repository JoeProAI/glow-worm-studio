'use client';

import { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { 
  Upload, 
  FolderOpen,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Users,
  CheckCircle2
} from "lucide-react";
import { Navigation } from "../../components/navigation";
import { AuthModal } from "../../components/auth/auth-modal";
import { useAuth } from "../../lib/auth-context";

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
            <span className="text-blue-600 text-sm font-semibold">Professional Media Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Media management<br />
            <span className="text-blue-600">for modern teams</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Organize, search, and present your digital assets with enterprise-grade tools 
            designed for professional workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:shadow-blue-600/30"
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-50 text-gray-900 px-8 py-6 text-lg rounded-xl"
              onClick={() => window.location.href = '/gallery'}
            >
              View Gallery
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Trusted by Teams</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage media
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features for teams of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 border-2 border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Asset Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Centralized storage and organization system for all your digital assets with advanced search and filtering capabilities.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 border-2 border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gallery Views</h3>
              <p className="text-gray-600 leading-relaxed">
                Multiple presentation formats including grid, timeline, and custom layouts optimized for different content types.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 border-2 border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Workflow Tools</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrated processing pipeline with batch operations, metadata management, and export functionality.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join teams at leading companies who trust our platform for their media workflows.
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl shadow-2xl font-semibold"
            onClick={handleGetStarted}
          >
            {user ? 'Go to Dashboard' : 'Start Free Trial'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">
            © 2025 Glow Worm Studio. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
