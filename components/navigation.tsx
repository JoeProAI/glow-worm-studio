'use client';

import { Button } from "./ui/button";
import { useAuth } from "../lib/auth-context";
import { User, LogOut, Upload, Grid3X3, Sparkles, Home } from "lucide-react";
import Image from 'next/image';

export function Navigation() {
  const { user, userProfile, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg"></div>
            <span className="text-xl font-semibold text-white">
              Glow Worm Studio
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => window.location.href = '/gallery'}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gallery
                </Button>
                
                {/* User Profile */}
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
                  className="text-gray-300 hover:text-white"
                  onClick={() => window.location.href = '/gallery'}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gallery
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Pricing
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
