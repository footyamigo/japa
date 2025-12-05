import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { getPaymentByTxRef, updatePaymentStatus, createPaymentRecord } from '@/lib/payments';
import { generateSecurePassword, createCourseAccessAccount } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { transactionId, txRef, email, firstName, lastName, phone, userId } = await request.json();

    // Verify payment with Flutterwave
    const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    
    if (!flutterwaveSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Payment verification not configured' },
        { status: 500 }
      );
    }

    // Check if payment record already exists
    let paymentRecord = await getPaymentByTxRef(txRef);
    
    // If payment record doesn't exist, create it
    if (!paymentRecord) {
      const createResult = await createPaymentRecord(
        email,
        firstName || '',
        lastName || '',
        phone || '',
        txRef,
        67000, // Default amount
        'NGN',
        userId
      );
      
      if (!createResult.success) {
        console.error('Failed to create payment record:', createResult.error);
      }
    }

    // Verify transaction with Flutterwave API
    const verifyResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${flutterwaveSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
      // Update payment record status to completed
      const updateResult = await updatePaymentStatus(txRef, transactionId, 'completed');
      if (!updateResult.success) {
        console.error('Failed to update payment status:', updateResult.error);
      }

      // Generate password and create course access account
      let generatedPassword = '';
      try {
        generatedPassword = generateSecurePassword();
        const accountResult = await createCourseAccessAccount(
          email,
          generatedPassword,
          firstName || '',
          lastName || ''
        );
        
        if (!accountResult.success && accountResult.error !== 'Account already exists') {
          console.error('Failed to create course access account:', accountResult.error);
          // Continue anyway - account might already exist
        }
      } catch (accountError: any) {
        console.error('Error creating course access account:', accountError);
        // Continue - we'll still send email and return success
      }

      // Payment is verified - send order confirmation email with password
      try {
        await sendOrderConfirmationEmail({
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          phone: phone || '',
          transactionId,
          txRef,
          amount: verifyData.data.amount || 67000,
          currency: verifyData.data.currency || 'NGN',
          password: generatedPassword || undefined,
        });
      } catch (emailError: any) {
        // Log email error but don't fail the payment verification
        console.error('Failed to send order confirmation email:', emailError);
        // Payment is still successful, just email failed
      }
      
      return NextResponse.json({
        success: true,
        transaction: verifyData.data,
        email,
        password: generatedPassword || undefined,
      });
    } else {
      // Update payment status to failed
      await updatePaymentStatus(txRef, transactionId, 'failed');
      
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}

