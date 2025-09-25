'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../lib/auth-context';
import { Github, Mail, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, signInWithGoogle, signInWithGithub } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      onClose();
    } catch (error: unknown) {
      setError((error as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');

    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
      onClose();
    } catch (error: unknown) {
      setError((error as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Sign in to your Glow Worm Studio account' 
                : 'Start organizing your media with AI intelligence'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            {/* Social Auth Buttons */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth('github')}
                disabled={loading}
              >
                <Github className="w-4 h-4 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                disabled={loading}
              >
                {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center text-sm">
              <span className="text-gray-400">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
