
# AaoCab - Quick Start Guide

Get your AaoCab website up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeThisPassword123!
ADMIN_TOKEN=change-this-secure-token-123
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website!

## 📋 What You Get

### ✅ Live Website Features
- **Homepage** with booking form
- **WhatsApp integration** (+91 78903 02302)
- **Corporate booking page**
- **Photo gallery** with car images
- **Testimonials carousel**
- **Legal pages** (Privacy, Terms, Refund, Accessibility)
- **Cookie consent banner**
- **Mobile responsive design**

### 🔐 Admin Dashboard
Access at: [http://localhost:3000/admin](http://localhost:3000/admin)

**Default Login:**
- Username: `admin`
- Password: `AaoCab@2025`

**Admin Features:**
- View all bookings
- Export to CSV
- Booking management

## 📱 Test the Booking Flow

1. Fill out the booking form on homepage
2. Click "Book Now"
3. WhatsApp opens with pre-filled message
4. Booking saved to admin dashboard

## 🎨 Brand Colors Used

The website uses AaoCab's brand colors from the provided logos:
- Primary: Purple/Blue (#6366f1 equivalent)
- Clean, modern design
- Mobile-first approach

## 🔧 Common Tasks

### Change Admin Password
Edit `.env.local`:
```env
ADMIN_PASSWORD=YourNewSecurePassword
```

### Deploy to Vercel
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/aaocab.git
git push -u origin main

# Then import on vercel.com
```

### Run Production Build
```bash
npm run build
npm start
```

## 📞 Contact Information

All contact links point to:
- **Phone**: +91 78903 02302
- **WhatsApp**: +91 78903 02302
- **Facebook**: facebook.com/aaocab

## 🎯 Next Steps

1. **Test Everything**: Try all features in the preview
2. **Customize Content**: Update text, images as needed
3. **Deploy**: Push to Vercel for production
4. **Monitor**: Set up analytics and monitoring

## 📚 Full Documentation

- [README.md](./README.md) - Complete project documentation
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md) - Accessibility compliance
- [TESTING_REPORT.md](./TESTING_REPORT.md) - Testing documentation

## 🆘 Troubleshooting

### Preview not loading?
```bash
# Restart the server
pm2 restart all
# Or click "Restart Server" in Softgen settings
```

### Admin login not working?
Check `.env.local` file exists and has correct credentials.

### WhatsApp not opening?
Make sure the phone number format is correct: `+917890302302`

## ✨ That's It!

Your AaoCab website is ready to use. The preview should show a fully functional website with:
- Booking form that opens WhatsApp
- Beautiful design matching AaoCab brand
- All pages and features working
- Mobile-responsive layout
- Admin dashboard ready to use

**Need help?** Check the full documentation or test all features in the preview!

---

**Built with Softgen** 🚀
