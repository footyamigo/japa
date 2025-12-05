/**
 * Payment Management Service for Web
 * Handles payment records in Firestore and user access management
 */

import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export interface PaymentRecord {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  transactionId: string;
  txRef: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: any;
  completedAt: any | null;
  product: string;
  userId?: string; // Optional: if user is logged in
}

/**
 * Create a payment record in Firestore
 */
export async function createPaymentRecord(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  txRef: string,
  amount: number,
  currency: string = 'NGN',
  userId?: string
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    const paymentData = {
      email,
      firstName,
      lastName,
      phone,
      txRef,
      amount,
      currency,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      completedAt: null,
      product: 'UK & Canada Visa Guides + 24/7 Support Group',
      userId: userId || null,
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    
    return {
      success: true,
      paymentId: docRef.id,
    };
  } catch (error: any) {
    console.error('[Payment] Error creating payment record:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment record',
    };
  }
}

/**
 * Get payment record by transaction reference
 */
export async function getPaymentByTxRef(
  txRef: string
): Promise<PaymentRecord | null> {
  try {
    const q = query(
      collection(db, 'payments'),
      where('txRef', '==', txRef)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as PaymentRecord;
  } catch (error: any) {
    console.error('[Payment] Error getting payment record:', error);
    return null;
  }
}

/**
 * Get payment record by transaction ID
 */
export async function getPaymentByTransactionId(
  transactionId: string
): Promise<PaymentRecord | null> {
  try {
    const q = query(
      collection(db, 'payments'),
      where('transactionId', '==', transactionId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as PaymentRecord;
  } catch (error: any) {
    console.error('[Payment] Error getting payment record:', error);
    return null;
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  txRef: string,
  transactionId: string,
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  try {
    const q = query(
      collection(db, 'payments'),
      where('txRef', '==', txRef)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Payment record not found' };
    }

    const docRef = snapshot.docs[0].ref;
    const updateData: any = {
      status,
      transactionId, // Update transaction ID if not set
    };

    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(docRef, updateData);
    
    return { success: true };
  } catch (error: any) {
    console.error('[Payment] Error updating payment status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update payment status',
    };
  }
}

/**
 * Check if user has paid (by email)
 */
export async function checkUserHasPaid(email: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'payments'),
      where('email', '==', email.toLowerCase()),
      where('status', '==', 'completed')
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error: any) {
    console.error('[Payment] Error checking payment status:', error);
    return false;
  }
}

/**
 * Get all payments for a user (by email)
 */
export async function getUserPayments(email: string): Promise<PaymentRecord[]> {
  try {
    const q = query(
      collection(db, 'payments'),
      where('email', '==', email.toLowerCase())
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentRecord[];
  } catch (error: any) {
    console.error('[Payment] Error getting user payments:', error);
    return [];
  }
}

