import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, ArrowLeft, Briefcase, Users, Calendar, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CorporatePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    numberOfVehicles: "",
    additionalDetails: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const message = encodeURIComponent(
      `Hi AaoCab — Corporate/Group Booking Request\n\nCompany: ${formData.companyName}\nContact Person: ${formData.contactPerson}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nEvent Type: ${formData.eventType}\nEvent Date: ${formData.eventDate}\nNumber of Vehicles: ${formData.numberOfVehicles}\n\nAdditional Details:\n${formData.additionalDetails}`
    );

    // Simulate brief delay for UX
    setTimeout(() => {
      window.open(`https://wa.me/917890302302?text=${message}`, "_blank");
      setLoading(false);
      toast({
        title: "Request Sent!",
        description: "Our team will contact you shortly.",
      });
    }, 500);
  };

  return (
    <>
      <Head>
        <title>Corporate & Group Bookings - AaoCab</title>
        <meta name="description" content="Corporate transportation solutions and group bookings for conferences, events, and business travel" />
      </Head>

      <main className="min-h-screen bg-white">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Aao_Cab_mnemonic_Colour_3x.png"
                alt="AaoCab Logo"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <Image
                src="/Aao_Logo_Final_Aao_Cab_Colour.jpg"
                alt="AaoCab"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Corporate & Group Bookings</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional transportation solutions for conferences, corporate events, and large-scale operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            <Card className="card-interactive group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <Briefcase className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Corporate Events</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Professional transportation for business meetings and conferences</p>
              </CardContent>
            </Card>
            <Card className="card-interactive group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <Users className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Group Travel</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Coordinated fleet for large groups and delegations</p>
              </CardContent>
            </Card>
            <Card className="card-interactive group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <Calendar className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Event Management</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Complete logistics for conferences and exhibitions</p>
              </CardContent>
            </Card>
            <Card className="card-interactive group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Reliable Service</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Dedicated account managers and 24/7 support</p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Request a Quote</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Input
                      id="eventType"
                      placeholder="e.g., Conference, Wedding, Corporate Meeting"
                      required
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="numberOfVehicles">Estimated Number of Vehicles *</Label>
                    <Input
                      id="numberOfVehicles"
                      placeholder="e.g., 5 sedans, 2 mini buses"
                      required
                      value={formData.numberOfVehicles}
                      onChange={(e) => setFormData({ ...formData, numberOfVehicles: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="additionalDetails">Additional Details</Label>
                    <Textarea
                      id="additionalDetails"
                      rows={4}
                      placeholder="Route details, special requirements, number of passengers, etc."
                      value={formData.additionalDetails}
                      onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:shadow-lg"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Send via WhatsApp
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-4">Or contact us directly:</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="tel:+917890302302">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      +91 78903 02302
                    </Button>
                  </a>
                  <a href="https://wa.me/917890302302" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
