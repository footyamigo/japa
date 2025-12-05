/**
 * Flutterwave Webhook Handler
 * Handles payment notifications from Flutterwave
 * This is called by Flutterwave when payment status changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPaymentByTxRef, updatePaymentStatus, createPaymentRecord } from '@/lib/payments';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { generateSecurePassword, createCourseAccessAccount } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Flutterwave webhook structure
    const { event, data } = body;
    
    // Only process successful payment events
    if (event === 'charge.completed' && data?.status === 'successful') {
      const txRef = data.tx_ref;
      const transactionId = data.id?.toString();
      const amount = data.amount;
      const currency = data.currency || 'NGN';
      const customer = data.customer || {};
      
      console.log('[Webhook] Processing successful payment:', { txRef, transactionId });

      // Check if payment record exists
      let paymentRecord = await getPaymentByTxRef(txRef);
      
      if (!paymentRecord) {
        // Create payment record if it doesn't exist
        const createResult = await createPaymentRecord(
          customer.email || '',
          customer.name?.split(' ')[0] || '',
          customer.name?.split(' ').slice(1).join(' ') || '',
          customer.phone_number || '',
          txRef,
          amount,
          currency
        );
        
        if (!createResult.success) {
          console.error('[Webhook] Failed to create payment record:', createResult.error);
          return NextResponse.json(
            { success: false, error: 'Failed to create payment record' },
            { status: 500 }
          );
        }
        
        paymentRecord = await getPaymentByTxRef(txRef);
      }

      if (!paymentRecord) {
        return NextResponse.json(
          { success: false, error: 'Payment record not found' },
          { status: 404 }
        );
      }

      // Check if already processed
      if (paymentRecord.status === 'completed') {
        console.log('[Webhook] Payment already processed:', txRef);
        return NextResponse.json({ success: true, message: 'Payment already processed' });
      }

      // Update payment status
      const updateResult = await updatePaymentStatus(txRef, transactionId || '', 'completed');
      if (!updateResult.success) {
        console.error('[Webhook] Failed to update payment status:', updateResult.error);
        return NextResponse.json(
          { success: false, error: 'Failed to update payment status' },
          { status: 500 }
        );
      }

      // Generate password and create course access account
      let generatedPassword = '';
      try {
        generatedPassword = generateSecurePassword();
        const accountResult = await createCourseAccessAccount(
          paymentRecord.email,
          generatedPassword,
          paymentRecord.firstName,
          paymentRecord.lastName
        );
        
        if (!accountResult.success && accountResult.error !== 'Account already exists') {
          console.error('[Webhook] Failed to create course access account:', accountResult.error);
          // Continue anyway - account might already exist
        }
      } catch (accountError: any) {
        console.error('[Webhook] Error creating course access account:', accountError);
        // Continue - we'll still send email
      }

      // Send order confirmation email with password
      try {
        await sendOrderConfirmationEmail({
          email: paymentRecord.email,
          firstName: paymentRecord.firstName,
          lastName: paymentRecord.lastName,
          phone: paymentRecord.phone,
          transactionId: transactionId || '',
          txRef,
          amount,
          currency,
          password: generatedPassword || undefined,
        });
      } catch (emailError: any) {
        console.error('[Webhook] Failed to send email:', emailError);
        // Don't fail webhook if email fails
      }

      console.log('[Webhook] Payment processed successfully:', txRef);
      return NextResponse.json({ success: true, message: 'Payment processed successfully' });
    }

    // For other events, just acknowledge
    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification (Flutterwave may ping the endpoint)
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Flutterwave webhook endpoint is active' });
}

