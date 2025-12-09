import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Download, Loader2, RefreshCw, Calendar, MapPin, User, Car, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  carType: string;
  name: string;
  phone: string;
  babyOnBoard: boolean;
  patientOnBoard: boolean;
  petOnBoard: boolean;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function AdminPage() {
  useRouter(); // Needed for Next.js client-side navigation
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("aaocab-admin-token");
    if (token) {
      setIsAuthenticated(true);
      fetchBookings(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("aaocab-admin-token", data.token);
        setIsAuthenticated(true);
        fetchBookings(data.token);
        toast({
          title: "Welcome!",
          description: "Successfully logged in to admin panel.",
        });
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (token: string, showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const response = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        if (showRefreshing) {
          toast({
            title: "Refreshed",
            description: "Bookings list updated.",
          });
        }
      }
    } catch {
      console.error("Failed to fetch bookings");
      if (showRefreshing) {
        toast({
          title: "Refresh Failed",
          description: "Unable to fetch bookings.",
          variant: "destructive",
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    const token = localStorage.getItem("aaocab-admin-token");
    if (token) {
      fetchBookings(token, true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("aaocab-admin-token");
    setIsAuthenticated(false);
    setBookings([]);
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    });
  };

  const exportToCSV = () => {
    const headers = ["ID", "From", "To", "Date", "Time", "Passengers", "Car Type", "Name", "Phone", "Status", "Options"];
    const rows = bookings.map((booking) => {
      const options = [];
      if (booking.babyOnBoard) options.push("Baby");
      if (booking.patientOnBoard) options.push("Patient");
      if (booking.petOnBoard) options.push("Pet");
      
      return [
        booking.id,
        booking.from,
        booking.to,
        booking.date,
        booking.time,
        booking.passengers,
        booking.carType,
        booking.name,
        booking.phone,
        booking.status,
        options.join(", "),
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aaocab-bookings-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - AaoCab</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <main className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">AaoCab Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - AaoCab</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-purple-600">AaoCab Admin</h1>
              <div className="flex items-center gap-2 sm:gap-4">
                <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button onClick={exportToCSV} variant="outline" size="sm" disabled={bookings.length === 0}>
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export CSV</span>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">Bookings ({bookings.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileX className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-500 max-w-sm">
                    When customers make bookings, they will appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="space-y-4 md:hidden">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-500">#{booking.id}</span>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "cancelled"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-medium">{booking.from}</div>
                            <div className="text-gray-500">→ {booking.to}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{booking.date} {booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span>{booking.carType}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <User className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <span className="font-medium">{booking.name}</span>
                            <span className="text-gray-500 ml-2">{booking.phone}</span>
                          </div>
                        </div>

                        {(booking.babyOnBoard || booking.patientOnBoard || booking.petOnBoard) && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {booking.babyOnBoard && <Badge variant="secondary" className="text-xs">Baby</Badge>}
                            {booking.patientOnBoard && <Badge variant="secondary" className="text-xs">Patient</Badge>}
                            {booking.petOnBoard && <Badge variant="secondary" className="text-xs">Pet</Badge>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>From → To</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Passengers</TableHead>
                          <TableHead>Car Type</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{booking.from}</div>
                                <div className="text-gray-500">→ {booking.to}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{booking.date}</div>
                                <div className="text-gray-500">{booking.time}</div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.passengers}</TableCell>
                            <TableCell>{booking.carType}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{booking.name}</div>
                                <div className="text-gray-500">{booking.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {booking.babyOnBoard && <Badge variant="secondary" className="text-xs">Baby</Badge>}
                                {booking.patientOnBoard && <Badge variant="secondary" className="text-xs">Patient</Badge>}
                                {booking.petOnBoard && <Badge variant="secondary" className="text-xs">Pet</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "cancelled"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
