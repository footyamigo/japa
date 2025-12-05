/**
 * Firebase service for web - adapted from mobile app
 * Uses browser-based Firebase auth instead of native
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;

// ==================== Types ====================

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age?: string;
  education?: string;
  country?: string;
  profileCompleted?: boolean;
  createdAt: string;
  savedVisas: string[];
  favorites: string[];
  userType?: string;
  purchasedCountries?: string[];
  hasChatSubscription?: boolean;
  chatSubscriptionExpiry?: string | null;
  freeChatsRemaining?: number;
  chatUsageThisMonth?: number;
  chatUsageResetDate?: string;
  hasCourseAccess?: boolean; // For web course access
  dailyChatUsage?: number; // Daily chat usage for web (5 per day)
  dailyChatResetDate?: string; // Date when daily usage resets
}

// ==================== Authentication ====================

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    // Create user profile in Firestore
    const now = new Date();
    const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: data.name,
      email: data.email,
      createdAt: now.toISOString(),
      savedVisas: [],
      favorites: [],
      userType: 'free',
      purchasedCountries: [],
      hasChatSubscription: false,
      chatSubscriptionExpiry: null,
      freeChatsRemaining: 0,
      chatUsageThisMonth: 0,
      chatUsageResetDate: firstOfNextMonth.toISOString(),
    });
    
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign in with Google (web popup)
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create user profile if it doesn't exist
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      const now = new Date();
      const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'User',
        email: user.email || '',
        createdAt: now.toISOString(),
        savedVisas: [],
        favorites: [],
        userType: 'free',
        purchasedCountries: [],
        hasChatSubscription: false,
        chatSubscriptionExpiry: null,
        freeChatsRemaining: 0,
        chatUsageThisMonth: 0,
        chatUsageResetDate: firstOfNextMonth.toISOString(),
      });
    }
    
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ==================== User Profile ====================

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      return null;
    }
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
}

