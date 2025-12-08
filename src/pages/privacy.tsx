
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - AaoCab</title>
        <meta name="description" content="AaoCab Privacy Policy - How we collect, use, and protect your personal information" />
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

          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: November 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                AaoCab ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cab booking services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (name, phone number)</li>
                <li>Booking details (pickup/drop locations, date, time, passenger count)</li>
                <li>Special requirements (baby on board, patient on board, pet on board)</li>
                <li>Device information and usage data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and manage your cab bookings</li>
                <li>Communicate with you about your bookings</li>
                <li>Improve our services and customer experience</li>
                <li>Comply with legal obligations</li>
                <li>Send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. Your data is stored securely using industry-standard encryption protocols. We use localStorage for temporary booking data storage on your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Drivers assigned to your booking</li>
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
              </ul>
              <p className="mt-4">We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. For more details, see our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us:
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
