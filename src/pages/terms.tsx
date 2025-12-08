
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service - AaoCab</title>
        <meta name="description" content="AaoCab Terms of Service - Rules and regulations for using our cab booking services" />
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

          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: November 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AaoCab's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p>
                AaoCab provides advance booking cab services for corporate events, outstation trips, and daily transportation needs. We connect customers with professional drivers and quality vehicles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Booking and Payment</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bookings are subject to availability and confirmation</li>
                <li>Advance bookings require minimum 2 hours notice</li>
                <li>Payment terms will be communicated at the time of booking</li>
                <li>Prices are subject to change based on distance, time, and vehicle type</li>
                <li>Additional charges may apply for waiting time, tolls, and parking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate booking information</li>
                <li>Be present at the pickup location at the scheduled time</li>
                <li>Treat drivers and vehicles with respect</li>
                <li>Not engage in illegal activities during the ride</li>
                <li>Comply with vehicle capacity limits</li>
                <li>Not consume alcohol or smoke inside the vehicle without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cancellation Policy</h2>
              <p>
                Cancellations must be made according to our Refund & Cancellation Policy. Late cancellations may incur charges. Please refer to our dedicated cancellation policy page for complete details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p>
                AaoCab acts as an intermediary between customers and drivers. While we ensure quality standards, we are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delays due to traffic, weather, or unforeseen circumstances</li>
                <li>Loss or damage to personal belongings</li>
                <li>Indirect or consequential damages</li>
              </ul>
              <p className="mt-4">
                Our total liability is limited to the amount paid for the specific booking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Safety and Insurance</h2>
              <p>
                All our vehicles are properly insured and maintained. Drivers undergo background verification and training. However, users are advised to take reasonable precautions for their safety.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <p>
                All content, trademarks, and intellectual property on our website and app are owned by AaoCab. Unauthorized use is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Dispute Resolution</h2>
              <p>
                Any disputes arising from these terms will be governed by the laws of India. We encourage users to contact us directly to resolve issues amicably before pursuing legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li>Phone: +91 78903 02302</li>
                <li>WhatsApp: +91 78903 02302</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
