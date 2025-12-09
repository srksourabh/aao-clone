import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
          // Update booking payment status
          await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              payment_id: paymentIntent.id,
              payment_amount: paymentIntent.amount / 100,
              payment_date: new Date().toISOString(),
              status: 'confirmed',
            })
            .eq('id', bookingId);

          // Store payment record
          await supabase.from('payments').insert({
            booking_id: parseInt(bookingId),
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: 'succeeded',
            customer_email: paymentIntent.metadata.customerEmail,
            customer_name: paymentIntent.metadata.customerName,
            receipt_url: paymentIntent.charges?.data?.[0]?.receipt_url || null,
          });

          console.log(`Payment succeeded for booking ${bookingId}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'failed',
            })
            .eq('id', bookingId);

          console.log(`Payment failed for booking ${bookingId}`);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        // Find booking by payment intent
        const { data: booking } = await supabase
          .from('bookings')
          .select('id')
          .eq('payment_intent_id', paymentIntentId)
          .single();

        if (booking) {
          const refundAmount = charge.amount_refunded / 100;
          const isFullRefund = charge.refunded;

          await supabase
            .from('bookings')
            .update({
              payment_status: isFullRefund ? 'refunded' : 'partially_refunded',
              refund_amount: refundAmount,
              refund_date: new Date().toISOString(),
            })
            .eq('id', booking.id);

          // Update payment record
          await supabase
            .from('payments')
            .update({
              status: isFullRefund ? 'refunded' : 'partially_refunded',
              refund_amount: refundAmount,
              refund_date: new Date().toISOString(),
            })
            .eq('payment_intent_id', paymentIntentId);

          console.log(`Refund processed for booking ${booking.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
