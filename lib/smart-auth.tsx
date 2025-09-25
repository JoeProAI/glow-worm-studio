'use client';

import React from 'react';
import { AuthProvider } from './auth-context';
import { MockAuthProvider } from './mock-auth';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
};

export function SmartAuthProvider({ children }: { children: React.ReactNode }) {
  const useFirebase = isFirebaseConfigured();
  
  console.log(`🔐 Using ${useFirebase ? 'Firebase' : 'Mock'} authentication`);
  
  if (useFirebase) {
    return <AuthProvider>{children}</AuthProvider>;
  } else {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }
}

// Export a unified hook that works with both providers
export function useSmartAuth() {
  const useFirebase = isFirebaseConfigured();
  
  if (useFirebase) {
    const { useAuth } = require('./auth-context');
    return useAuth();
  } else {
    const { useMockAuth } = require('./mock-auth');
    return useMockAuth();
  }
}
