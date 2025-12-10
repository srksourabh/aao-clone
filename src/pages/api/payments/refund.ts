/**
 * Razorpay Refund API
 *
 * Processes refunds for paid bookings (admin only).
 * Supports full and partial refunds.
 *
 * @method POST
 * @body {bookingId: number, amount?: number, reason?: string}
 * @returns {success: boolean, refund: object}
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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

  // Check admin authorization
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { bookingId, amount, reason } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Get booking with payment info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!booking.payment_id) {
      return res.status(400).json({ error: 'No payment found for this booking' });
    }

    if (booking.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Booking is not paid or already refunded' });
    }

    // Create refund params
    interface RefundParams {
      amount?: number;
      speed?: string;
      notes?: {
        bookingId: string;
        reason: string;
      };
    }

    const refundParams: RefundParams = {
      speed: 'normal',
      notes: {
        bookingId: bookingId.toString(),
        reason: reason || 'Customer requested',
      },
    };

    // If partial refund amount specified (in paise)
    if (amount && amount < booking.payment_amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    // Create refund via Razorpay
    const refund = await razorpay.payments.refund(booking.payment_id, refundParams);

    // Update booking status
    const refundAmount = refund.amount / 100;
    const isFullRefund = refundAmount >= booking.payment_amount;

    await supabase
      .from('bookings')
      .update({
        payment_status: isFullRefund ? 'refunded' : 'partially_refunded',
        refund_amount: refundAmount,
        refund_id: refund.id,
        refund_date: new Date().toISOString(),
        refund_reason: reason || 'Customer requested',
        status: 'cancelled',
      })
      .eq('id', bookingId);

    res.status(200).json({
      success: true,
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: refund.status,
        isFullRefund,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process refund'
    });
  }
}
