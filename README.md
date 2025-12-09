# AaoCab - Premium Advance Booking Cab Service

A full-stack, production-ready, mobile-first cab booking platform built with Next.js, TypeScript, Tailwind CSS, Supabase, and Stripe.

![AaoCab](public/Aao_Logo_Final_Aao_Cab_Colour.jpg)

## Features

### Booking System
- **Advance Cab Bookings** - Book rides in advance with date/time selection
- **Multiple Vehicle Types** - Sedan, Sedan XL, SUV, Innova, Tempo Traveller, Mini Bus
- **Trip Types** - One-way, Round trip, Rental packages
- **Special Requirements** - Baby on board, Patient on board, Pet on board options
- **Google Places Integration** - Autocomplete for pickup and drop locations
- **Distance & Fare Calculation** - Automatic fare estimation based on route

### User Authentication
- **Email/Password Registration** - Secure account creation with email verification
- **Social Login Ready** - Supabase Auth supports OAuth providers
- **Password Recovery** - Forgot password with email reset link
- **Profile Management** - Update personal details and change password
- **Protected Routes** - Secure pages that require authentication
- **Session Management** - Persistent login with "Remember me" option

### Payment Integration
- **Stripe Payments** - Secure payment processing with Stripe Elements
- **Multiple Payment Methods** - Cards, UPI, and more via Stripe
- **Payment Status Tracking** - Track pending, paid, and refunded bookings
- **Receipt Generation** - Download payment receipts
- **Refund Support** - Admin-initiated refunds through dashboard
- **Webhook Handling** - Real-time payment status updates

### User Dashboard
- **My Bookings** - View all past and upcoming bookings
- **Booking Details** - Detailed view of each booking with payment status
- **Cancel Bookings** - Cancel bookings up to 4 hours before trip
- **Pay Online** - Complete pending payments for bookings

### Admin Dashboard
- **Booking Management** - View, filter, and manage all bookings
- **Status Updates** - Update booking status (pending, confirmed, cancelled)
- **CSV Export** - Export booking data for reporting
- **Mobile Responsive** - Card-based view on mobile devices
- **Refund Processing** - Process refunds for paid bookings

### Corporate Bookings
- **Bulk Inquiries** - Special form for corporate and group bookings
- **Contact Options** - WhatsApp and phone integration

### Additional Features
- **Toast Notifications** - User feedback for all actions
- **Loading States** - Spinners and skeleton screens
- **Error Handling** - Graceful error messages and offline detection
- **Offline Banner** - Notify users when connection is lost
- **Mobile-First Design** - Optimized for all screen sizes
- **SEO Optimized** - Meta tags and structured data
- **Legal Compliance** - Privacy Policy, Terms of Service, Refund Policy
- **Cookie Consent** - GDPR-compliant cookie banner
- **Accessibility** - WCAG 2.1 AA compliant

## Tech Stack

### Frontend
- **Next.js 15.2** - React framework with Pages Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v3** - Utility-first CSS framework
- **Shadcn/UI** - Accessible component library
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Next.js API Routes** - Serverless API endpoints

### Payments
- **Stripe** - Payment processing
- **@stripe/react-stripe-js** - React components for Stripe Elements
- **stripe** - Node.js Stripe SDK

### Maps & Location
- **Google Places API** - Location autocomplete
- **@react-google-maps/api** - Google Maps React wrapper

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- Google Cloud account (for Places API)

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd aao-clone
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure environment variables** (see Environment Variables section below)

5. **Set up Supabase database:**

Create a `bookings` table in Supabase with the following schema:
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  trip_date DATE NOT NULL,
  return_date DATE,
  trip_time TIME NOT NULL,
  trip_type VARCHAR(50) NOT NULL,
  car_type VARCHAR(50) NOT NULL,
  passengers INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  distance_km DECIMAL(10,2),
  baby_on_board BOOLEAN DEFAULT FALSE,
  patient_on_board BOOLEAN DEFAULT FALSE,
  pet_on_board BOOLEAN DEFAULT FALSE,
  rental_package VARCHAR(100),
  waiting_time VARCHAR(50),
  price_metadata JSONB,
  admin_notes TEXT,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

6. **Run the development server:**
```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000)**

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Google Places API
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Admin Dashboard Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"
ADMIN_TOKEN="your-secure-token"
```

### Getting API Keys

**Supabase:**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy the Project URL and anon/public key

**Google Places API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Places API
4. Create credentials (API Key)
5. Restrict the key to your domains

**Stripe:**
1. Create an account at [stripe.com](https://stripe.com)
2. Go to Developers > API Keys
3. Copy publishable and secret keys
4. For webhooks, go to Developers > Webhooks
5. Add endpoint: `https://yourdomain.com/api/payments/webhook`
6. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

## Project Structure

```
aao-clone/
├── public/                     # Static assets and images
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── AuthNav.tsx       # Authentication navigation
│   │   ├── BookingForm.tsx   # Main booking form
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   ├── OfflineBanner.tsx # Offline notification
│   │   ├── PaymentForm.tsx   # Stripe payment form
│   │   └── ProtectedRoute.tsx # Auth route wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── hooks/
│   │   ├── use-toast.ts      # Toast notifications
│   │   └── useNetworkStatus.ts # Network detection
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── errors.ts         # Error handling utilities
│   │   └── utils.ts          # General utilities
│   ├── pages/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Auth endpoints
│   │   │   ├── payments/     # Payment endpoints
│   │   │   └── bookings.ts   # Booking endpoints
│   │   ├── admin/            # Admin dashboard
│   │   ├── booking/          # Booking details
│   │   ├── payment/          # Payment pages
│   │   ├── index.tsx         # Homepage
│   │   ├── login.tsx         # Login page
│   │   ├── register.tsx      # Registration page
│   │   ├── profile.tsx       # User profile
│   │   ├── my-bookings.tsx   # User bookings
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   ├── corporate.tsx     # Corporate bookings
│   │   ├── privacy.tsx       # Privacy policy
│   │   ├── terms.tsx         # Terms of service
│   │   ├── refund.tsx        # Refund policy
│   │   └── accessibility.tsx # Accessibility statement
│   ├── styles/
│   │   └── globals.css       # Global styles
│   └── types/
│       └── booking.ts        # TypeScript types
├── .env.local                 # Environment variables
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

### Stripe Webhook Setup for Production

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings` - Update booking status

### Payments
- `POST /api/payments/create-intent` - Create Stripe PaymentIntent
- `POST /api/payments/webhook` - Handle Stripe webhooks
- `POST /api/payments/refund` - Process refund (admin)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 5+)

## Performance Targets

- **Performance**: >= 70 (mobile)
- **Accessibility**: >= 90
- **Best Practices**: >= 90
- **SEO**: >= 90

## Contact & Support

- **Phone**: +91 78903 02302
- **WhatsApp**: +91 78903 02302

## License

Copyright 2025 AaoCab. All rights reserved.

---

**Built with Next.js, Supabase, and Stripe**
