import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Users,
  Phone,
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Home,
  RefreshCw,
} from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  from_location: string;
  to_location: string;
  trip_date: string;
  trip_time: string;
  trip_type: string;
  car_type: string;
  passengers: number;
  status: string;
  total_amount: number;
  distance_km: number;
  created_at: string;
  baby_on_board: boolean;
  patient_on_board: boolean;
  pet_on_board: boolean;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" />, label: 'Pending' },
  confirmed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" />, label: 'Confirmed' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" />, label: 'Cancelled' },
  pending_confirmation: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-3 w-3" />, label: 'Awaiting Confirmation' },
  call_requested: { color: 'bg-purple-100 text-purple-800', icon: <Phone className="h-3 w-3" />, label: 'Call Requested' },
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data || []);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/my-bookings');
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, router, fetchBookings]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setCancellingId(selectedBooking.id);

    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', selectedBooking.id);

      if (updateError) throw updateError;

      setBookings(bookings.map(b =>
        b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
      ));
      setShowCancelDialog(false);
      setSelectedBooking(null);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const canCancel = (booking: Booking) => {
    if (booking.status === 'cancelled') return false;
    if (booking.status === 'confirmed') {
      // Allow cancellation up to 4 hours before trip
      const tripDateTime = new Date(`${booking.trip_date}T${booking.trip_time}`);
      const now = new Date();
      const hoursUntilTrip = (tripDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilTrip > 4;
    }
    return true;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>My Bookings - AaoCab</title>
        <meta name="description" content="View and manage your AaoCab bookings" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                AaoCab
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-700">My Bookings</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
            </h2>
            <p className="text-gray-600">Manage your cab bookings and view trip history</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mb-6">
            <Link href="/#booking">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Book a New Ride
              </Button>
            </Link>
            <Button variant="outline" onClick={fetchBookings} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven&apos;t made any bookings yet. Book your first ride now!
                </p>
                <Link href="/#booking">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Book Your First Ride
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${status.color} flex items-center gap-1`}>
                              {status.icon}
                              {status.label}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              #{booking.id}
                            </span>
                          </div>

                          {/* Route */}
                          <div className="flex items-start gap-2 mb-3">
                            <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {booking.from_location}
                              </p>
                              <p className="text-gray-500 text-sm line-clamp-1">
                                → {booking.to_location}
                              </p>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {formatDate(booking.trip_date)}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              {formatTime(booking.trip_time)}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Car className="h-4 w-4" />
                              {booking.car_type}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Users className="h-4 w-4" />
                              {booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}
                            </div>
                          </div>

                          {/* Special Requirements */}
                          {(booking.baby_on_board || booking.patient_on_board || booking.pet_on_board) && (
                            <div className="flex gap-2 mt-2">
                              {booking.baby_on_board && (
                                <Badge variant="secondary" className="text-xs">Baby</Badge>
                              )}
                              {booking.patient_on_board && (
                                <Badge variant="secondary" className="text-xs">Patient</Badge>
                              )}
                              {booking.pet_on_board && (
                                <Badge variant="secondary" className="text-xs">Pet</Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                          {booking.total_amount && (
                            <div className="text-right">
                              <p className="text-2xl font-bold text-purple-600">
                                ₹{Math.round(booking.total_amount)}
                              </p>
                              {booking.distance_km && (
                                <p className="text-xs text-gray-500">
                                  {booking.distance_km} km
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Link href={`/booking/${booking.id}`}>
                              <Button variant="outline" size="sm">
                                Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                            {canCancel(booking) && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelDialog(true);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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

          {selectedBooking && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{selectedBooking.from_location}</p>
                <p className="text-gray-500 text-sm">→ {selectedBooking.to_location}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {formatDate(selectedBooking.trip_date)} at {formatTime(selectedBooking.trip_time)}
                </p>
              </div>
            </div>
          )}

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
