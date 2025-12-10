/**
 * Razorpay Webhook Handler
 *
 * Handles incoming webhook events from Razorpay to update payment status
 * in the database. Processes the following events:
 *
 * - payment.captured: Marks booking as paid
 * - payment.failed: Updates booking with failed status
 * - refund.created: Updates booking with refund details
 *
 * Security:
 * - Verifies webhook signature using RAZORPAY_WEBHOOK_SECRET
 * - Returns 400 for invalid signatures
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Keep body parsing enabled for Razorpay webhooks
 */
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  // Verify webhook signature
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Webhook signature verification failed');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    const event = req.body;
    const eventType = event.event;

    switch (eventType) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;
        const paymentId = payment.id;
        const amount = payment.amount / 100; // Convert from paise to rupees

        // Find booking by order ID
        const { data: booking } = await supabase
          .from('bookings')
          .select('id')
          .eq('razorpay_order_id', orderId)
          .single();

        if (booking) {
          // Update booking payment status
          await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              payment_id: paymentId,
              payment_amount: amount,
              payment_date: new Date().toISOString(),
              status: 'confirmed',
            })
            .eq('id', booking.id);

          // Update payment record
          await supabase
            .from('payments')
            .upsert({
              booking_id: booking.id,
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              amount: amount,
              currency: payment.currency,
              status: 'captured',
              customer_email: payment.email,
              customer_phone: payment.contact,
            });

          console.log(`Payment captured for booking ${booking.id}`);
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Find booking by order ID
        const { data: booking } = await supabase
          .from('bookings')
          .select('id')
          .eq('razorpay_order_id', orderId)
          .single();

        if (booking) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'failed',
            })
            .eq('id', booking.id);

          console.log(`Payment failed for booking ${booking.id}`);
        }
        break;
      }

      case 'refund.created': {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;
        const refundAmount = refund.amount / 100;

        // Find booking by payment ID
        const { data: booking } = await supabase
          .from('bookings')
          .select('id')
          .eq('payment_id', paymentId)
          .single();

        if (booking) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'refunded',
              refund_amount: refundAmount,
              refund_id: refund.id,
              refund_date: new Date().toISOString(),
            })
            .eq('id', booking.id);

          // Update payment record
          await supabase
            .from('payments')
            .update({
              status: 'refunded',
              refund_amount: refundAmount,
              refund_id: refund.id,
              refund_date: new Date().toISOString(),
            })
            .eq('razorpay_payment_id', paymentId);

          console.log(`Refund processed for booking ${booking.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
