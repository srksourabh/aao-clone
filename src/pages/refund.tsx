
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <>
      <Head>
        <title>Refund & Cancellation Policy - AaoCab</title>
        <meta name="description" content="AaoCab Refund and Cancellation Policy - Terms for booking cancellations and refunds" />
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

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: November 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Cancellation by Customer</h2>
              <p>Customers may cancel bookings according to the following terms:</p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">1.1 Advance Bookings</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>24+ hours before pickup:</strong> Full refund (100%)</li>
                <li><strong>12-24 hours before pickup:</strong> 75% refund</li>
                <li><strong>6-12 hours before pickup:</strong> 50% refund</li>
                <li><strong>2-6 hours before pickup:</strong> 25% refund</li>
                <li><strong>Less than 2 hours before pickup:</strong> No refund</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">1.2 Corporate/Group Bookings</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>7+ days before event:</strong> Full refund (100%)</li>
                <li><strong>3-7 days before event:</strong> 80% refund</li>
                <li><strong>1-3 days before event:</strong> 50% refund</li>
                <li><strong>Less than 24 hours:</strong> No refund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How to Cancel</h2>
              <p>To cancel your booking:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact us via WhatsApp: +91 78903 02302</li>
                <li>Call us: +91 78903 02302</li>
                <li>Provide your booking reference number</li>
                <li>Cancellation confirmation will be sent within 2 hours</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Refund Processing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds are processed within 5-7 business days</li>
                <li>Refunds are credited to the original payment method</li>
                <li>Bank processing may take additional 2-3 business days</li>
                <li>You will receive a refund confirmation email/SMS</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Cancellation by AaoCab</h2>
              <p>We may cancel bookings in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vehicle breakdown or unavailability</li>
                <li>Driver unavailability due to emergency</li>
                <li>Extreme weather conditions affecting safety</li>
                <li>Government restrictions or unforeseen circumstances</li>
              </ul>
              <p className="mt-4">
                <strong>In case of cancellation by AaoCab:</strong> You will receive a full refund (100%) or alternative arrangement at no extra cost.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. No-Show Policy</h2>
              <p>
                If you are not present at the pickup location within 15 minutes of the scheduled time and do not respond to driver contact attempts, the booking will be considered a no-show. No refund will be issued for no-shows.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Modification of Bookings</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Booking modifications (date/time/location) are subject to availability</li>
                <li>Modifications requested 6+ hours in advance: No extra charge</li>
                <li>Modifications requested less than 6 hours: Subject to cancellation policy</li>
                <li>Contact us to request modifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Partial Service Completion</h2>
              <p>
                If service is partially completed due to customer request to end trip early, charges will be calculated based on actual distance/time used. No refund for unused portion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Force Majeure</h2>
              <p>
                No refunds are provided for cancellations due to acts of God, natural disasters, pandemics, government orders, or other force majeure events beyond our control. Alternative arrangements will be offered when possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Disputes</h2>
              <p>
                If you dispute a charge or cancellation fee, please contact us within 7 days of the booking date. We will review your case and respond within 3-5 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact for Cancellations</h2>
              <p>
                For all cancellation requests and refund inquiries:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li>Phone: +91 78903 02302</li>
                <li>WhatsApp: +91 78903 02302</li>
                <li>Available: 24/7</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
