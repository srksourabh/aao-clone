
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <>
      <Head>
        <title>Accessibility Statement - AaoCab</title>
        <meta name="description" content="AaoCab Accessibility Statement - Our commitment to making our services accessible to everyone" />
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

          <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: November 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p>
                AaoCab is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Conformance Status</h2>
              <p>
                We strive to meet WCAG 2.1 Level AA standards. Our website is designed to be perceivable, operable, understandable, and robust for all users, including those using assistive technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
              <p>Our website includes the following accessibility features:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Semantic HTML structure for screen reader compatibility</li>
                <li>Keyboard navigation support throughout the site</li>
                <li>High contrast color schemes meeting WCAG AA standards</li>
                <li>Descriptive alt text for all images</li>
                <li>ARIA labels and landmarks for better navigation</li>
                <li>Responsive design that works across devices and screen sizes</li>
                <li>Skip navigation links for keyboard users</li>
                <li>Reduced motion support for users with vestibular disorders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Physical Accessibility</h2>
              <p>Our cab services include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vehicles with wheelchair access available upon request</li>
                <li>Trained drivers to assist passengers with disabilities</li>
                <li>Patient transport options for medical appointments</li>
                <li>Flexible pickup and drop-off arrangements</li>
                <li>Baby seats and special equipment available on request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Known Limitations</h2>
              <p>
                Despite our efforts, some content may not yet be fully accessible. We are aware of the following limitations and are working to address them:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some third-party embedded content may have accessibility issues</li>
                <li>Certain interactive features may require additional assistive technology support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Feedback and Contact</h2>
              <p>
                We welcome your feedback on the accessibility of our website and services. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li>Phone: +91 78903 02302</li>
                <li>WhatsApp: +91 78903 02302</li>
              </ul>
              <p className="mt-4">
                We aim to respond to accessibility feedback within 3 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Technical Specifications</h2>
              <p>
                Our website relies on the following technologies to work with the particular combination of web browser and assistive technologies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript</li>
                <li>ARIA (Accessible Rich Internet Applications)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Assessment Approach</h2>
              <p>
                AaoCab assessed the accessibility of this website through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Self-evaluation using automated accessibility testing tools</li>
                <li>Manual testing with keyboard navigation</li>
                <li>Screen reader testing</li>
                <li>Review against WCAG 2.1 guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Continuous Improvement</h2>
              <p>
                We are committed to ongoing accessibility improvements. This statement will be updated as we make enhancements to our website and services. We conduct regular accessibility audits and implement improvements based on user feedback and evolving best practices.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
