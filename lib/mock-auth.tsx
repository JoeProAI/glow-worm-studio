'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  subscription: 'free' | 'pro' | 'team' | 'enterprise';
  storageUsed: number;
  storageLimit: number;
}

interface MockAuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    const savedProfile = localStorage.getItem('mockUserProfile');
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setUserProfile(JSON.parse(savedProfile));
    }
    
    setLoading(false);
  }, []);

  const createMockUser = (email: string, displayName: string): { user: User; profile: UserProfile } => {
    const uid = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: User = {
      uid,
      email,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`
    };

    const profile: UserProfile = {
      uid,
      email,
      displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      subscription: 'free',
      storageUsed: 0,
      storageLimit: 1024 * 1024 * 1024 // 1GB
    };

    return { user, profile };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (password.length < 6) {
      setLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

    const { user, profile } = createMockUser(email, email.split('@')[0]);
    
    setUser(user);
    setUserProfile(profile);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserProfile', JSON.stringify(profile));
    
    setLoading(false);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (password.length < 6) {
      setLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

    const { user, profile } = createMockUser(email, displayName);
    
    setUser(user);
    setUserProfile(profile);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserProfile', JSON.stringify(profile));
    
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { user, profile } = createMockUser(
      'demo@google.com', 
      'Demo User (Google)'
    );
    
    setUser(user);
    setUserProfile(profile);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserProfile', JSON.stringify(profile));
    
    setLoading(false);
  };

  const signInWithGithub = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { user, profile } = createMockUser(
      'demo@github.com', 
      'Demo User (GitHub)'
    );
    
    setUser(user);
    setUserProfile(profile);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserProfile', JSON.stringify(profile));
    
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setUserProfile(null);
    
    // Clear localStorage
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserProfile');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    const updatedProfile = { ...userProfile, ...data };
    setUserProfile(updatedProfile);
    
    // Update localStorage
    localStorage.setItem('mockUserProfile', JSON.stringify(updatedProfile));
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    logout,
    updateUserProfile,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}
