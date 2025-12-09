import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home, Phone, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found - AaoCab</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <span className="text-[150px] font-bold text-purple-100 leading-none">404</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-purple-600 text-white rounded-full p-6">
                  <Search className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            It might have been moved, deleted, or never existed.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/#booking" className="text-purple-600 hover:underline">
                Book a Ride
              </Link>
              <Link href="/my-bookings" className="text-purple-600 hover:underline">
                My Bookings
              </Link>
              <Link href="/corporate" className="text-purple-600 hover:underline">
                Corporate Bookings
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <a
              href="tel:+917890302302"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call +91 7890 302 302
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
