/**
 * Create Razorpay Order API
 *
 * Creates a Razorpay order for a booking payment.
 * This endpoint is called when a user initiates payment for their booking.
 *
 * Flow:
 * 1. Validates required fields (bookingId, amount)
 * 2. Verifies booking exists and isn't already paid
 * 3. Creates Razorpay order with booking metadata
 * 4. Updates booking with order_id
 * 5. Returns order details for Razorpay checkout
 *
 * @method POST
 * @body {bookingId: number, amount: number}
 * @returns {orderId: string, amount: number, currency: string, keyId: string}
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify booking exists and get details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if already paid
    if (booking.payment_status === 'paid') {
      return res.status(400).json({ error: 'Booking already paid' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay uses paise (smallest currency unit)
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        customerEmail: booking.email || '',
        customerName: booking.name || '',
      },
    });

    // Update booking with order ID
    await supabase
      .from('bookings')
      .update({
        razorpay_order_id: order.id,
        payment_status: 'pending',
      })
      .eq('id', bookingId);

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: bookingId,
      customerName: booking.name,
      customerEmail: booking.email,
      customerPhone: booking.phone,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create order'
    });
  }
}
