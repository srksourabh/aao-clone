/**
 * Razorpay Payment Form Component
 *
 * Handles payment flow using Razorpay checkout.
 * Opens Razorpay modal for payment processing.
 */

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentFormProps {
  bookingId: number;
  amount: number;
  orderId: string;
  keyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentForm({
  bookingId,
  amount,
  orderId,
  keyId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setError('Payment system is loading. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options: RazorpayOptions = {
        key: keyId,
        amount: amount, // Amount is already in paise from API
        currency: 'INR',
        name: 'AaoCab',
        description: `Booking #${bookingId}`,
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#9333ea', // Purple-600
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onSuccess?.();
              // Redirect to success page
              router.push(`/payment/success?bookingId=${bookingId}&paymentId=${response.razorpay_payment_id}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
            setError(errorMessage);
            onError?.(errorMessage);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment';
      setError(errorMessage);
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError('Failed to load payment system')}
      />

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Payment Details</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Name</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{customerEmail}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium">{customerPhone}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-medium">#{bookingId}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Booking Total</span>
            <span className="text-2xl font-bold text-purple-600">
              ₹{(amount / 100).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-gray-500">* Includes all taxes and fees</p>
        </div>

        <Button
          onClick={handlePayment}
          className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
          disabled={loading || !scriptLoaded}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : !scriptLoaded ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>Pay ₹{(amount / 100).toLocaleString('en-IN')}</>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Secured by Razorpay</span>
        </div>

        <p className="text-xs text-center text-gray-400">
          By proceeding, you agree to our{' '}
          <Link href="/refund" className="text-purple-600 hover:underline">
            Refund Policy
          </Link>
        </p>
      </div>
    </>
  );
}

export default PaymentForm;
