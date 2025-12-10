/**
 * Verify Razorpay Payment API
 *
 * Verifies the payment signature after successful Razorpay checkout.
 * This endpoint is called after user completes payment on Razorpay.
 *
 * Flow:
 * 1. Receives payment details from client
 * 2. Verifies signature using Razorpay secret
 * 3. Updates booking payment status
 * 4. Returns success/failure
 *
 * @method POST
 * @body {razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId}
 * @returns {success: boolean, message: string}
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error('Invalid payment signature');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update booking payment status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        payment_date: new Date().toISOString(),
        status: 'confirmed',
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return res.status(500).json({ error: 'Failed to update booking' });
    }

    // Store payment record
    await supabase.from('payments').insert({
      booking_id: parseInt(bookingId),
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      amount: 0, // Will be updated by webhook with actual amount
      currency: 'INR',
      status: 'captured',
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Payment verification failed'
    });
  }
}
