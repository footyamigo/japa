'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signIn, SignInData } from '@/lib/services/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, SIZES, SPACING } from '@/lib/constants/theme';

export default function LoginPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      await refreshProfile();
      router.replace('/');
    } catch (error: any) {
      console.error('[Google Login] Error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Image Section - Top */}
      <div className="relative flex-[0.5] w-full bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
        
        {/* App Icon - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-10 z-[5]">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-white/70 via-white/30 to-transparent z-[1]" />
      </div>

      {/* White Card Section - Bottom */}
      <div className="flex-[0.5] bg-white rounded-t-[30px] -mt-10 px-8 pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Welcome Back</h1>
          <p className="text-base text-gray-600">Sign in to continue your journey</p>
        </div>

        <div className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`flex items-center justify-center bg-black text-white py-4 rounded-2xl gap-4 font-semibold shadow-lg hover:bg-gray-800 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging you in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-600">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Sign in with Email Button */}
          <button
            onClick={() => router.push('/auth/email-login')}
            className="flex items-center justify-center bg-gray-600 text-white py-4 rounded-2xl gap-4 font-semibold shadow-md hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Sign in with Email</span>
          </button>

          <div className="flex justify-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <button onClick={() => router.push('/auth/signup')} className="text-indigo-600 font-bold ml-1">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

