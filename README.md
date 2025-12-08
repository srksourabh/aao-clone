
# AaoCab - Premium Advance Booking Cab Service

A full-stack, production-ready, mobile-first website for AaoCab, an advance-booking ride-hailing service built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Advance Cab Bookings**: Inline booking form with WhatsApp integration
- **Multiple Vehicle Types**: Sedan, Sedan XL, SUV, Innova, Tempo Traveller, Mini Bus, Custom
- **Special Requirements**: Baby on board, Patient on board, Pet on board options
- **Corporate & Group Bookings**: Dedicated page for large-scale transportation
- **Admin Dashboard**: Booking management with authentication and CSV export
- **Legal Compliance**: Privacy Policy, Terms of Service, Refund Policy, Accessibility Statement
- **Cookie Consent**: GDPR-compliant cookie banner

### Technical Features
- **Next.js 15.2** with Pages Router
- **TypeScript** for type safety
- **Tailwind CSS v3** for responsive design
- **Shadcn/UI** component library
- **Mobile-first responsive design** (360px to 1440px+)
- **localStorage backup** for booking forms
- **Accessibility compliance** (WCAG 2.1 AA)
- **SEO optimized** with proper meta tags

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aaocab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Admin Dashboard Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_TOKEN=your-secure-token-here

# Optional: Analytics, monitoring, etc.
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
aaocab/
├── public/                          # Static assets
│   ├── Aao_Cab_mnemonic_Colour_3x.png
│   ├── Aao_Logo_Final_Aao_Cab_Colour.jpg
│   ├── Aao_Logo_Final_Aao_Cab_White.jpg
│   └── [car images]
├── src/
│   ├── components/                  # React components
│   │   ├── ui/                     # Shadcn/UI components
│   │   ├── BookingForm.tsx         # Main booking form
│   │   └── CookieConsent.tsx       # Cookie consent banner
│   ├── pages/                       # Next.js pages
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Authentication
│   │   │   └── bookings.ts         # Booking management
│   │   ├── admin/                  # Admin dashboard
│   │   ├── index.tsx               # Homepage
│   │   ├── corporate.tsx           # Corporate bookings
│   │   ├── privacy.tsx             # Privacy policy
│   │   ├── terms.tsx               # Terms of service
│   │   ├── refund.tsx              # Refund policy
│   │   └── accessibility.tsx       # Accessibility statement
│   ├── styles/
│   │   └── globals.css             # Global styles and theme
│   ├── types/
│   │   └── booking.ts              # TypeScript types
│   └── lib/
│       └── utils.ts                # Utility functions
├── .env.local                       # Environment variables (not in repo)
├── next.config.mjs                  # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies
```

## 🎨 Brand Colors

The website uses AaoCab's official brand colors:

- **Primary**: HSL(250, 70%, 55%) - Purple/Blue
- **Secondary**: HSL(260, 60%, 45%) - Darker Purple
- **Accent**: HSL(280, 50%, 60%) - Lighter Purple
- **Light**: HSL(250, 100%, 97%) - Very Light Background
- **Dark**: HSL(250, 50%, 20%) - Dark Text

## 📱 Key Pages & Routes

### Public Pages
- `/` - Homepage with booking form
- `/corporate` - Corporate & group bookings
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/refund` - Refund & Cancellation Policy
- `/accessibility` - Accessibility Statement

### Admin Pages
- `/admin` - Admin dashboard (requires authentication)

### API Routes
- `/api/auth/login` - Admin authentication
- `/api/bookings` - Booking management (GET/POST)

## 🔐 Admin Dashboard

**Default Credentials** (change in production):
- Username: `admin`
- Password: `AaoCab@2025`

**Features:**
- View all bookings
- Export bookings to CSV
- Filter and search bookings
- View booking details and special requirements

**Security:**
- Token-based authentication
- Environment variable credentials
- Session management with localStorage

## 📞 Contact Integration

### WhatsApp Integration
Primary contact method: WhatsApp
- Number: +91 78903 02302
- Auto-generates pre-filled messages with booking details
- Fallback to phone call if WhatsApp unavailable

### Phone Integration
Fallback contact method: Direct call
- tel: +917890302302
- Automatically opens phone dialer on mobile

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## ✅ Accessibility Compliance

The website meets WCAG 2.1 Level AA standards:

- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ High contrast colors (4.5:1 minimum)
- ✅ Descriptive alt text for images
- ✅ ARIA labels and landmarks
- ✅ Responsive design across devices
- ✅ Reduced motion support
- ✅ Form labels and error handling

## 🧪 Testing

### Manual Testing Checklist
- [ ] Booking form validation
- [ ] WhatsApp link generation
- [ ] Phone fallback functionality
- [ ] localStorage persistence
- [ ] Admin authentication
- [ ] CSV export
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Accessibility with screen readers
- [ ] Cookie consent functionality

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 5+)

## 📊 Performance Targets

### Lighthouse Scores
- **Performance**: ≥ 70 (mobile)
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (recommended)
- Double quotes for strings
- Named exports for components

## 🌐 Environment Variables

Required environment variables:

```env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ADMIN_TOKEN=your-secure-token

# Optional
NEXT_PUBLIC_GA_ID=your-ga-id
```

## 📝 License

© 2025 AaoCab. All rights reserved.

## 🤝 Support

For technical support or questions:
- Email: support@aaocab.com (if available)
- Phone: +91 78903 02302
- WhatsApp: +91 78903 02302

## 🔄 Version History

### v1.0.0 (November 2025)
- Initial production release
- Core booking functionality
- Admin dashboard
- Legal compliance pages
- Cookie consent
- Corporate booking page
- Mobile-first responsive design
- WCAG 2.1 AA accessibility

## 🚧 Future Enhancements

Potential features for future releases:
- Real-time booking status updates
- SMS notifications
- Payment gateway integration
- Driver tracking
- Multi-language support
- Native mobile apps
- Advanced analytics dashboard

## 📖 Documentation

For detailed component documentation and API references, see:
- [Components Documentation](./docs/components.md) (to be created)
- [API Documentation](./docs/api.md) (to be created)
- [Deployment Guide](./docs/deployment.md) (to be created)

---

**Built with ❤️ for AaoCab by Softgen**
