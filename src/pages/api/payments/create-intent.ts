import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
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

  try {
    const { bookingId, amount, customerEmail, customerName, description } = req.body;

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

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit (paise)
      currency: 'inr',
      metadata: {
        bookingId: bookingId.toString(),
        customerEmail: customerEmail || booking.email || '',
        customerName: customerName || booking.name || '',
      },
      description: description || `AaoCab Booking #${bookingId}`,
      receipt_email: customerEmail || booking.email,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update booking with payment intent ID
    await supabase
      .from('bookings')
      .update({
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
      })
      .eq('id', bookingId);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    });
  }
}
