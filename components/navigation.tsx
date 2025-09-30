'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import { useAuth } from "../lib/auth-context";
import { User, LogOut, Upload, FolderOpen, Home } from "lucide-react";
import { AuthModal } from "./auth/auth-modal";

export function Navigation() {
  const { user, userProfile, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-semibold text-gray-900">
                Glow Worm Studio
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => window.location.href = '/'}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Gallery
                  </Button>
                  
                  {/* User Profile */}
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userProfile?.displayName || user.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    Gallery
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => handleAuthClick('signin')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAuthClick('signup')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
