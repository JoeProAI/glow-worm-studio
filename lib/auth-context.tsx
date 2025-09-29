'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { auth, isFirebaseConfigured, initializeFirebaseServices } from './firebase-config';

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

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user profile via server-side API
  const createUserProfile = useCallback(async (user: User, additionalData?: Record<string, unknown>) => {
    try {
      // Create a basic profile locally since we're not using client-side Firestore
      const basicProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        subscription: 'free',
        storageUsed: 0,
        storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
        ...additionalData
      };
      setUserProfile(basicProfile);
    } catch (error) {
      console.error('Failed to create user profile:', error);
    }
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    await initializeFirebaseServices();
    if (!auth) throw new Error('Authentication not available - please check Firebase configuration');
    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    await initializeFirebaseServices();
    if (!auth) throw new Error('Authentication not available - please check Firebase configuration');
    setLoading(true);
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      await createUserProfile(user, { displayName });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    await initializeFirebaseServices();
    if (!auth) throw new Error('Authentication not available - please check Firebase configuration');
    setLoading(true);
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign in with GitHub
  const signInWithGithub = async () => {
    await initializeFirebaseServices();
    if (!auth) throw new Error('Authentication not available - please check Firebase configuration');
    setLoading(true);
    try {
      const { signInWithPopup, GithubAuthProvider } = await import('firebase/auth');
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    if (!auth) {
      // If auth is not available, just clear local state
      setUser(null);
      setUserProfile(null);
      return;
    }
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Update profile locally since we're not using client-side Firestore
      if (userProfile) {
        setUserProfile({ ...userProfile, ...data });
      }
    } catch (error) {
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Try to initialize Firebase services
        const initialized = await initializeFirebaseServices();
        
        if (!initialized || !auth) {
          console.log('ℹ️ Firebase Auth not available - check configuration');
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        // Import onAuthStateChanged dynamically
        const { onAuthStateChanged } = await import('firebase/auth');

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!isMounted) return;
          
          try {
            if (user) {
              setUser(user);
              await createUserProfile(user);
            } else {
              setUser(null);
              setUserProfile(null);
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [createUserProfile]);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
