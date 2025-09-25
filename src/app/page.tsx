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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg"></div>
              <span className="text-xl font-semibold text-white">
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
                      <Button variant="ghost" className="text-gray-300 hover:text-white">
                        Features
                      </Button>
                      <Button variant="ghost" className="text-gray-300 hover:text-white">
                        Pricing
                      </Button>
                      <Button
                        onClick={() => handleAuthClick('signin')}
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => handleAuthClick('signup')}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
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
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Media
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
              Professional media management powered by advanced categorization, 
              intelligent organization, and immersive gallery experiences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-10 py-4"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Media
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 border-gray-700 text-gray-300 hover:bg-gray-900 hover:border-gray-600"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  My Galleries
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-10 py-4"
                  onClick={() => handleAuthClick('signup')}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-10 py-4 border-gray-700 text-gray-300 hover:bg-gray-900 hover:border-gray-600">
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  Explore Galleries
                </Button>
              </>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto border border-emerald-500/20">
                <Database className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Smart Organization</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced categorization and tagging system that automatically organizes your content with precision and intelligence.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto border border-blue-500/20">
                <Grid3X3 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Immersive Galleries</h3>
              <p className="text-gray-400 leading-relaxed">
                Revolutionary gallery experiences including constellation views, timeline flows, and interactive 3D environments.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto border border-purple-500/20">
                <Video className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Content Generation</h3>
              <p className="text-gray-400 leading-relaxed">
                Integrated creation tools with professional video generation and enhancement capabilities for complete workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Workflow
          </h2>
          <p className="text-xl text-gray-400 mb-10 font-light">
            Professional media management designed for creators, teams, and enterprises.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-12 py-4"
            onClick={() => handleAuthClick('signup')}
          >
            Start Free Trial
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
