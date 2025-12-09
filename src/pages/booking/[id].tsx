import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Baby,
  Heart,
  PawPrint,
  IndianRupee,
  Route,
  FileText,
  CreditCard,
} from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  from_location: string;
  to_location: string;
  trip_date: string;
  return_date: string | null;
  trip_time: string;
  trip_type: string;
  car_type: string;
  passengers: number;
  status: string;
  total_amount: number;
  distance_km: number;
  created_at: string;
  updated_at: string;
  baby_on_board: boolean;
  patient_on_board: boolean;
  pet_on_board: boolean;
  rental_package: string | null;
  waiting_time: string | null;
  price_metadata: Record<string, unknown> | null;
  admin_notes: string | null;
  payment_status?: string;
  payment_id?: string;
  payment_date?: string;
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  pending: { color: 'text-yellow-800', bgColor: 'bg-yellow-100', icon: <Clock className="h-5 w-5" />, label: 'Pending' },
  confirmed: { color: 'text-green-800', bgColor: 'bg-green-100', icon: <CheckCircle className="h-5 w-5" />, label: 'Confirmed' },
  cancelled: { color: 'text-red-800', bgColor: 'bg-red-100', icon: <XCircle className="h-5 w-5" />, label: 'Cancelled' },
  pending_confirmation: { color: 'text-blue-800', bgColor: 'bg-blue-100', icon: <Clock className="h-5 w-5" />, label: 'Awaiting Confirmation' },
  call_requested: { color: 'text-purple-800', bgColor: 'bg-purple-100', icon: <Phone className="h-5 w-5" />, label: 'Call Requested' },
};

const tripTypeLabels: Record<string, string> = {
  oneway: 'One Way',
  roundtrip: 'Round Trip',
  rental: 'Rental',
  package: 'Package',
};

export default function BookingDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!user?.email || !id) return;

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .eq('email', user.email)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Booking not found or you do not have permission to view it.');
        } else {
          throw fetchError;
        }
        return;
      }

      setBooking(data);
    } catch (err) {
      setError('Failed to load booking details. Please try again.');
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email, id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/booking/${id}`);
      return;
    }

    if (user && id) {
      fetchBooking();
    }
  }, [user, authLoading, id, router, fetchBooking]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    setCancellingId(booking.id);

    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      setBooking({ ...booking, status: 'cancelled' });
      setShowCancelDialog(false);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (booking: Booking) => {
    if (booking.status === 'cancelled') return false;
    if (booking.status === 'confirmed') {
      const tripDateTime = new Date(`${booking.trip_date}T${booking.trip_time}`);
      const now = new Date();
      const hoursUntilTrip = (tripDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilTrip > 4;
    }
    return true;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error && !booking) {
    return (
      <>
        <Head>
          <title>Booking Not Found - AaoCab</title>
        </Head>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/my-bookings">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Back to My Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  if (!booking) return null;

  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <>
      <Head>
        <title>Booking #{booking.id} - AaoCab</title>
        <meta name="description" content={`View details for booking #${booking.id}`} />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/my-bookings" className="inline-flex items-center text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Bookings
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Status Banner */}
          <div className={`${status.bgColor} rounded-lg p-4 mb-6 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={status.color}>{status.icon}</div>
              <div>
                <p className={`font-semibold ${status.color}`}>Booking {status.label}</p>
                <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
              </div>
            </div>
            {canCancel(booking) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Booking
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Trip Route */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-purple-600" />
                    Trip Route
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <div className="w-0.5 h-12 bg-gray-300" />
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Pickup</p>
                          <p className="font-medium">{booking.from_location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Drop</p>
                          <p className="font-medium">{booking.to_location}</p>
                        </div>
                      </div>
                    </div>

                    {booking.distance_km && (
                      <div className="pt-4 border-t flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Estimated Distance: {booking.distance_km} km</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Trip Type</p>
                      <p className="font-medium">{tripTypeLabels[booking.trip_type] || booking.trip_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trip Date</p>
                      <p className="font-medium">{formatDate(booking.trip_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Time</p>
                      <p className="font-medium">{formatTime(booking.trip_time)}</p>
                    </div>
                    {booking.return_date && (
                      <div>
                        <p className="text-sm text-gray-500">Return Date</p>
                        <p className="font-medium">{formatDate(booking.return_date)}</p>
                      </div>
                    )}
                    {booking.rental_package && (
                      <div>
                        <p className="text-sm text-gray-500">Rental Package</p>
                        <p className="font-medium">{booking.rental_package}</p>
                      </div>
                    )}
                    {booking.waiting_time && booking.waiting_time !== '0' && (
                      <div>
                        <p className="text-sm text-gray-500">Waiting Time</p>
                        <p className="font-medium">{booking.waiting_time} hours</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle & Passengers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-purple-600" />
                    Vehicle & Passengers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Type</p>
                      <p className="font-medium">{booking.car_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passengers</p>
                      <p className="font-medium">{booking.passengers}</p>
                    </div>
                  </div>

                  {(booking.baby_on_board || booking.patient_on_board || booking.pet_on_board) && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">Special Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.baby_on_board && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Baby className="h-3 w-3" />
                            Child on board
                          </Badge>
                        )}
                        {booking.patient_on_board && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            Patient on board
                          </Badge>
                        )}
                        {booking.pet_on_board && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <PawPrint className="h-3 w-3" />
                            Pet on board
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-600" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{booking.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${booking.phone}`} className="text-purple-600 hover:underline">
                        {booking.phone}
                      </a>
                    </div>
                    {booking.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${booking.email}`} className="text-purple-600 hover:underline">
                          {booking.email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-purple-600" />
                    Price Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {booking.total_amount ? (
                    <div className="text-center">
                      <p className="text-4xl font-bold text-purple-600">
                        ₹{Math.round(booking.total_amount)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Total Fare</p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Price will be confirmed</p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {booking.payment_status === 'paid' ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-semibold text-green-700">Payment Complete</p>
                      {booking.payment_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paid on {formatDateTime(booking.payment_date)}
                        </p>
                      )}
                      {booking.payment_id && (
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {booking.payment_id.slice(0, 16)}...
                        </p>
                      )}
                    </div>
                  ) : booking.payment_status === 'refunded' ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <IndianRupee className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="font-semibold text-blue-700">Refunded</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Amount has been refunded
                      </p>
                    </div>
                  ) : booking.status === 'cancelled' ? (
                    <div className="text-center">
                      <p className="text-gray-500">Booking cancelled</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <p className="font-semibold text-yellow-700">Payment Pending</p>
                      <p className="text-xs text-gray-500 mt-2 mb-4">
                        Complete your payment to confirm
                      </p>
                      {booking.total_amount > 0 && booking.status !== 'cancelled' && (
                        <Link href={`/payment/${booking.id}`}>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay ₹{Math.round(booking.total_amount)}
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Booking Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Booked On</p>
                    <p className="font-medium">{formatDateTime(booking.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDateTime(booking.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6 text-center">
                  <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-900">Need Help?</p>
                  <p className="text-sm text-purple-700 mb-3">Our team is here to assist</p>
                  <a href="tel:+917890302302">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Call +91 7890 302 302
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{booking.from_location}</p>
              <p className="text-gray-500 text-sm">→ {booking.to_location}</p>
              <p className="text-sm text-gray-600 mt-2">
                {formatDate(booking.trip_date)} at {formatTime(booking.trip_time)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={cancellingId !== null}
            >
              {cancellingId !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
