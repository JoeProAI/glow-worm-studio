'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "../../components/ui/button";
import { Upload, Database, Grid3X3, Video, User, LogOut } from "lucide-react";
import { AuthModal } from "../../components/auth/auth-modal";
import { useAuth } from "../../lib/auth-context";

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, userProfile, logout, loading } = useAuth();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-white/4 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/3 rounded-full blur-xl animate-pulse" style={{animationDelay: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/2 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
              <span className="text-xl font-medium text-white">
                Glow Worm Studio
              </span>
            </div>
            <div className="flex items-center space-x-6">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-gray-300 hover:text-white"
                        onClick={() => window.location.href = '/dashboard'}
                      >
                        Dashboard
                      </Button>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
                            {userProfile?.photoURL ? (
                              <Image 
                                src={userProfile.photoURL} 
                                alt="Profile" 
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full" 
                              />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-gray-300">{userProfile?.displayName}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={logout}
                          className="text-gray-400 hover:text-white"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-white hover:text-gray-300 font-medium"
                        onClick={() => window.location.href = '/gallery'}
                      >
                        Gallery
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-white hover:text-gray-300 font-medium"
                      >
                        Pricing
                      </Button>
                      <Button
                        onClick={() => handleAuthClick('signin')}
                        variant="ghost"
                        className="text-white hover:text-gray-300 font-medium"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => handleAuthClick('signup')}
                        className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 tracking-tight text-white">
              Media management
              <br />
              for modern teams
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Organize, search, and present your digital assets with enterprise-grade tools 
              designed for professional workflows.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-900 hover:border-gray-500 font-medium px-8 py-3"
                  onClick={() => window.location.href = '/gallery'}
                >
                  View Gallery
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3"
                  onClick={() => handleAuthClick('signup')}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-900 hover:border-gray-500 font-medium px-8 py-3"
                  onClick={() => window.location.href = '/gallery'}
                >
                  View Demo
                </Button>
              </>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative z-10">
            <div className="text-left">
              <h3 className="text-xl font-medium text-white mb-3">Asset Management</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Centralized storage and organization system for all your digital assets with advanced search and filtering capabilities.
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-xl font-medium text-white mb-3">Gallery Views</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Multiple presentation formats including grid, timeline, and custom layouts optimized for different content types.
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-xl font-medium text-white mb-3">Workflow Tools</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Integrated processing pipeline with batch operations, metadata management, and export functionality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-800 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-medium text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-500 mb-8">
            Join teams at leading companies who trust our platform for their media workflows.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3"
            onClick={() => handleAuthClick('signup')}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
