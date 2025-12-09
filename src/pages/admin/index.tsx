
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Download } from "lucide-react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("aaocab-admin-token");
    if (token) {
      setIsAuthenticated(true);
      fetchBookings(token);
    }
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
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (token: string) => {
    try {
      const response = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch {
      console.error("Failed to fetch bookings");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("aaocab-admin-token");
    setIsAuthenticated(false);
    setBookings([]);
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
                <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
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
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-primary">AaoCab Admin</h1>
            <div className="flex items-center gap-4">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Bookings ({bookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No bookings yet</p>
              ) : (
                <div className="overflow-x-auto">
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
                        <TableRow key={booking.id}>
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
