'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/services/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          {user && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{userProfile?.name || user.displayName || 'User'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

