import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Car,
  Download,
  Home,
  CalendarCheck,
} from 'lucide-react';

interface Booking {
  id: number;
  from_location: string;
  to_location: string;
  trip_date: string;
  trip_time: string;
  car_type: string;
  total_amount: number;
  payment_status: string;
  payment_id: string;
  name: string;
  email: string;
  phone: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { bookingId, payment_intent } = router.query;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!error && data) {
        setBooking(data);
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Generate a simple receipt
    const receiptContent = `
AAOCAB - PAYMENT RECEIPT
========================

Booking ID: #${booking?.id}
Payment ID: ${payment_intent || booking?.payment_id || 'N/A'}
Date: ${new Date().toLocaleDateString('en-IN')}

TRIP DETAILS
------------
From: ${booking?.from_location}
To: ${booking?.to_location}
Date: ${booking?.trip_date}
Time: ${booking?.trip_time}
Vehicle: ${booking?.car_type}

CUSTOMER
--------
Name: ${booking?.name}
Phone: ${booking?.phone}
Email: ${booking?.email}

PAYMENT
-------
Amount Paid: ₹${booking?.total_amount?.toLocaleString('en-IN')}
Status: PAID

Thank you for choosing AaoCab!
For support: +91 78903 02302
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AaoCab_Receipt_${booking?.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Successful - AaoCab</title>
        <meta name="description" content="Your payment was successful" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-12 px-4">
        <div className="container mx-auto max-w-lg">
          <Card className="overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-green-100">Your booking has been confirmed</p>
            </div>

            <CardContent className="p-6 space-y-6">
              {booking && (
                <>
                  {/* Booking Reference */}
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                    <p className="text-2xl font-bold text-purple-600">#{booking.id}</p>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Trip Details</h3>

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
                  </div>

                  {/* Amount Paid */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Amount Paid</span>
                      <span className="text-2xl font-bold text-green-700">
                        ₹{booking.total_amount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Confirmation Message */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      A confirmation email has been sent to <strong>{booking.email}</strong>.
                      Our driver will contact you before the pickup time.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleDownloadReceipt}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>

                    <Link href={`/booking/${booking.id}`} className="block">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        View Booking Details
                      </Button>
                    </Link>

                    <Link href="/" className="block">
                      <Button variant="ghost" className="w-full">
                        <Home className="h-4 w-4 mr-2" />
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Support Info */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? Contact us at{' '}
            <a href="tel:+917890302302" className="text-purple-600 hover:underline">
              +91 78903 02302
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
