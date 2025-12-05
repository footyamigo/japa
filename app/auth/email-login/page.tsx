'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, SignInData } from '@/lib/services/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function EmailLoginPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signIn({ email, password } as SignInData);
      await refreshProfile();
      router.replace('/');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-12 left-6 z-10 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

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
      <div className="flex-[0.5] bg-white rounded-t-[30px] -mt-10 overflow-y-auto">
        <div className="px-8 pt-8 pb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Sign in with Email</h1>
            <p className="text-base text-gray-600">Enter your email and password</p>
          </div>

          <div className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Email Input */}
            <div className="flex items-center bg-gray-100 rounded-2xl border border-gray-300 px-4">
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-4 text-black text-base outline-none bg-transparent placeholder-gray-500"
                autoCapitalize="none"
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center bg-gray-100 rounded-2xl border border-gray-300 px-4">
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-4 text-black text-base outline-none bg-transparent placeholder-gray-500"
                autoCapitalize="none"
              />
            </div>

            <button className="text-indigo-600 text-sm text-right self-end">
              Forgot Password?
            </button>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`bg-black text-white py-4 rounded-2xl font-bold text-base mt-2 shadow-lg hover:bg-gray-800 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

