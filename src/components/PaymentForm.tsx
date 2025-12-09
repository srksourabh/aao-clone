import { useState } from 'react';
import Link from 'next/link';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  bookingId: number;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Note: onSuccess is handled by redirect to success page after Stripe payment
export function PaymentForm({ bookingId, amount, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?bookingId=${bookingId}`,
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Booking Total</span>
          <span className="text-2xl font-bold text-purple-600">₹{amount.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-xs text-gray-500">
          * Includes all taxes and fees
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
        disabled={!stripe || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            Pay ₹{amount.toLocaleString('en-IN')}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span>Secured by Stripe</span>
      </div>

      <p className="text-xs text-center text-gray-400">
        By proceeding, you agree to our{' '}
        <Link href="/refund" className="text-purple-600 hover:underline">
          Refund Policy
        </Link>
      </p>
    </form>
  );
}

export default PaymentForm;
