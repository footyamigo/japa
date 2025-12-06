'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackPurchase } from '@/lib/gtm';
import { trackMetaPurchase } from '@/lib/metaPixel';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get credentials from localStorage (set by checkout page)
    const storedEmail = localStorage.getItem('payment_email');
    const storedPassword = localStorage.getItem('payment_password');
    
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setLoading(false);
      
      // Track purchase completion
      trackPurchase({
        transaction_id: `txn_${Date.now()}`,
        value: 67000,
        currency: 'NGN',
        items: [{
          item_id: 'japa-course',
          item_name: 'Japa Course - UK & Canada Visa Guide',
          price: 67000,
          quantity: 1,
        }],
      });
      
      // Track Meta Pixel purchase
      trackMetaPurchase({
        value: 67000,
        currency: 'NGN',
        content_name: 'Japa Course - UK & Canada Visa Guide',
        content_ids: ['japa-course'],
      });
    } else {
      // If no credentials found, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    alert('Email copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Your course access has been activated</p>
        </div>

        {/* Credentials Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Course Access Credentials</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created! Save these credentials securely. You'll need them to access your course.
          </p>
          
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={email}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm text-gray-900"
                />
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy email"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm text-gray-900"
                />
                <button
                  onClick={handleCopyPassword}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy password"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please save these credentials in a secure place. You'll need them every time you want to access your course.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/guides/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Access Your Course Now
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>An email with these credentials has been sent to <strong>{email}</strong></p>
          <p className="mt-2">You can always come back to <Link href="/guides/login" className="text-indigo-600 hover:underline">login</Link> to access your course</p>
        </div>
      </div>
    </div>
  );
}

