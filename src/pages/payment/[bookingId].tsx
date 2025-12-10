/**
 * Payment Page
 *
 * Handles payment flow using Razorpay checkout.
 * Creates order and displays PaymentForm component.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { PaymentForm } from '@/components/PaymentForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Car,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  from_location: string;
  to_location: string;
  trip_date: string;
  trip_time: string;
  car_type: string;
  total_amount: number;
  payment_status: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { bookingId } = router.query;
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingAndCreateOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBookingAndCreateOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch booking details
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError || !bookingData) {
        throw new Error('Booking not found');
      }

      // Check if already paid
      if (bookingData.payment_status === 'paid') {
        setError('This booking has already been paid');
        setBooking(bookingData);
        setLoading(false);
        return;
      }

      // Verify user owns this booking (if logged in)
      if (user && bookingData.email !== user.email) {
        throw new Error('You are not authorized to pay for this booking');
      }

      setBooking(bookingData);

      // Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.id,
          amount: bookingData.total_amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      setOrderData({
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        keyId: data.keyId,
        customerName: data.customerName || bookingData.name,
        customerEmail: data.customerEmail || bookingData.email,
        customerPhone: data.customerPhone || bookingData.phone,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful!',
      description: 'Your booking has been confirmed.',
    });
  };

  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: 'Payment Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && booking?.payment_status === 'paid') {
    return (
      <>
        <Head>
          <title>Already Paid - AaoCab</title>
        </Head>
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
          <div className="container mx-auto max-w-lg py-12">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Already Paid</CardTitle>
                <CardDescription>This booking has already been paid</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Link href={`/booking/${bookingId}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    View Booking Details
                  </Button>
                </Link>
                <Link href="/my-bookings">
                  <Button variant="outline" className="w-full">
                    Go to My Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Head>
          <title>Payment Error - AaoCab</title>
        </Head>
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
          <div className="container mx-auto max-w-lg py-12">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Payment Error</CardTitle>
                <CardDescription>{error || 'Unable to load booking'}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Complete Payment - AaoCab</title>
        <meta name="description" content="Complete your cab booking payment" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link href={`/booking/${bookingId}`} className="flex items-center text-gray-600 hover:text-purple-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Link>

          <div className="grid gap-6">
            {/* Booking Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
                <CardDescription>Booking #{booking.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">{booking.from_location}</p>
                    <p className="text-gray-500">→ {booking.to_location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{booking.trip_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{booking.trip_time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{booking.car_type}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            {orderData ? (
              <PaymentForm
                bookingId={booking.id}
                amount={orderData.amount}
                orderId={orderData.orderId}
                keyId={orderData.keyId}
                customerName={orderData.customerName}
                customerEmail={orderData.customerEmail}
                customerPhone={orderData.customerPhone}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to initialize payment. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {/* Security Notice */}
            <p className="text-xs text-center text-gray-500">
              Your payment is processed securely through Razorpay. We never store your card details.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
