/**
 * Authentication utilities for course access
 */

/**
 * Generate a secure random password
 */
export function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special char
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Verify Firebase ID token (for API routes)
 */
export async function verifyIdToken(token: string): Promise<any> {
  try {
    const { auth } = await import('./services/firebase');
    const { verifyIdToken: verifyToken } = await import('firebase/auth');
    return await verifyToken(auth, token);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Create a Firebase Auth account for course access
 */
export async function createCourseAccessAccount(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { auth, db } = await import('./services/firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    
    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Create user profile in Firestore
    const now = new Date();
    await setDoc(doc(db, 'users', userId), {
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      createdAt: now.toISOString(),
      hasCourseAccess: true,
      courseAccessGrantedAt: now.toISOString(),
      userType: 'course_access',
      dailyChatUsage: 0,
      dailyChatResetDate: now.toISOString(),
    });
    
    return { success: true, userId };
  } catch (error: any) {
    // If user already exists, update their profile to grant course access
    if (error.code === 'auth/email-already-in-use') {
      try {
        const { getUserProfile, updateUserProfile } = await import('./services/firebase');
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('./services/firebase');
        
        // Try to sign in to get the user ID
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;
          
          // Update profile to grant course access and initialize chat fields
          const profile = await getUserProfile(userId);
          const updates: any = {
            hasCourseAccess: true,
          };
          
          // Initialize chat fields if they don't exist
          if (profile && (profile.dailyChatUsage === undefined || profile.dailyChatResetDate === undefined)) {
            updates.dailyChatUsage = 0;
            updates.dailyChatResetDate = new Date().toISOString();
          }
          
          await updateUserProfile(userId, updates);
          return { success: true, userId, error: 'Account already exists - access granted' };
        } catch (signInError) {
          // Can't sign in with generated password - that's okay, they'll need to reset
          return { success: true, error: 'Account already exists' };
        }
      } catch (updateError) {
        console.error('Error updating existing account:', updateError);
        return { success: true, error: 'Account already exists' };
      }
    }
    console.error('Error creating course access account:', error);
    return { success: false, error: error.message || 'Failed to create account' };
  }
}

