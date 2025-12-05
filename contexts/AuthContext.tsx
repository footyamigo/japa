'use client';

/**
 * Authentication context for managing user state
 * Adapted from mobile app for web
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthChange, 
  getCurrentUser, 
  getUserProfile,
  UserProfile as FirebaseUserProfile 
} from '@/lib/services/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: FirebaseUserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error: any) {
        // Silently handle permission errors - profile might not exist yet or rules not set up
        if (error.code !== 'permission-denied') {
          console.error('Error refreshing profile:', error);
        }
        setUserProfile(null);
      }
    }
  };

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const profile = await getUserProfile(authUser.uid);
          setUserProfile(profile);
        } catch (error: any) {
          // Handle permission errors gracefully
          if (error.code === 'permission-denied') {
            console.log('[AuthContext] User profile not found or permission denied - will be created on first update');
            setUserProfile(null);
          } else {
            console.error('Error getting user profile:', error);
            setUserProfile(null);
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

