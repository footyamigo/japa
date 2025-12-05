/**
 * Chat Usage Service (Web)
 * Manages daily chat usage limits (5 questions per day)
 */

import { getUserProfile, updateUserProfile } from './firebase';
import { User } from 'firebase/auth';

const DAILY_QUESTION_LIMIT = 5;

/**
 * Check if usage needs to be reset (new day)
 */
function shouldResetDailyUsage(lastResetDate: string | undefined): boolean {
  if (!lastResetDate) return true;
  const lastReset = new Date(lastResetDate);
  const now = new Date();
  
  // Reset if it's a different day
  return (
    lastReset.getDate() !== now.getDate() ||
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  );
}

/**
 * Get today's date as ISO string (for reset date)
 */
function getTodayDate(): string {
  return new Date().toISOString();
}

/**
 * Check if user can use chat (5 questions per day)
 * Returns: { canChat: boolean, reason?: string, remainingQuestions?: number }
 */
export async function checkChatAccess(user: User): Promise<{
  canChat: boolean;
  reason?: string;
  remainingQuestions?: number;
}> {
  try {
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      return { canChat: false, reason: 'User profile not found', remainingQuestions: 0 };
    }

    // Check if user has course access (hasCourseAccess from payment)
    if (!profile.hasCourseAccess) {
      return { 
        canChat: false, 
        reason: 'Please purchase the course to access chat features',
        remainingQuestions: 0 
      };
    }

    // Check if usage needs to be reset (new day)
    if (shouldResetDailyUsage(profile.dailyChatResetDate)) {
      await updateUserProfile(user.uid, {
        dailyChatUsage: 0,
        dailyChatResetDate: getTodayDate(),
      });
      return {
        canChat: true,
        remainingQuestions: DAILY_QUESTION_LIMIT,
        reason: `You have ${DAILY_QUESTION_LIMIT} questions remaining today`
      };
    }

    // Check daily usage
    const usedToday = profile.dailyChatUsage || 0;
    const remaining = DAILY_QUESTION_LIMIT - usedToday;

    if (remaining > 0) {
      return {
        canChat: true,
        remainingQuestions: remaining,
        reason: `You have ${remaining} question${remaining === 1 ? '' : 's'} remaining today`
      };
    } else {
      return {
        canChat: false,
        remainingQuestions: 0,
        reason: `You've used all ${DAILY_QUESTION_LIMIT} questions for today. Your limit will reset tomorrow.`
      };
    }
  } catch (error) {
    console.error('[Chat Usage] Error checking access:', error);
    return { canChat: false, reason: 'Error checking chat access', remainingQuestions: 0 };
  }
}

/**
 * Record a chat usage (call this after each AI response)
 */
export async function recordChatUsage(user: User): Promise<void> {
  try {
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      throw new Error('User profile not found');
    }

    // Check if usage needs to be reset (new day)
    if (shouldResetDailyUsage(profile.dailyChatResetDate)) {
      await updateUserProfile(user.uid, {
        dailyChatUsage: 1,
        dailyChatResetDate: getTodayDate(),
      });
      return;
    }

    // Increment daily usage
    const currentUsage = profile.dailyChatUsage || 0;
    await updateUserProfile(user.uid, {
      dailyChatUsage: currentUsage + 1,
    });
  } catch (error) {
    console.error('[Chat Usage] Error recording usage:', error);
    throw error;
  }
}

