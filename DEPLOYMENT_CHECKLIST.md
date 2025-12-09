# AaoCab Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` (production Supabase project)
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` (production key)
- [ ] Set `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` (restricted to production domain)
- [ ] Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_*)
- [ ] Set `STRIPE_SECRET_KEY` (sk_live_*)
- [ ] Set `STRIPE_WEBHOOK_SECRET` (production webhook)
- [ ] Set `ADMIN_USERNAME` (strong username)
- [ ] Set `ADMIN_PASSWORD` (strong password, 12+ chars)
- [ ] Set `ADMIN_TOKEN` (random 32+ char string)

### 2. Supabase Setup
- [ ] Create production Supabase project
- [ ] Run database migrations (create bookings table)
- [ ] Enable Row Level Security (RLS) policies
- [ ] Configure authentication settings
- [ ] Set up email templates for verification/reset
- [ ] Test auth flow in production

### 3. Stripe Configuration
- [ ] Switch from test to live mode
- [ ] Update publishable key to live key
- [ ] Update secret key to live key
- [ ] Create production webhook endpoint
- [ ] Add webhook endpoint: `https://yourdomain.com/api/payments/webhook`
- [ ] Subscribe to events:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
- [ ] Copy webhook signing secret
- [ ] Test payment flow with real card

### 4. Google API Configuration
- [ ] Create production API key
- [ ] Restrict to production domains
- [ ] Enable required APIs:
  - Places API
  - Geocoding API
  - Maps JavaScript API
- [ ] Set billing alerts

### 5. Code Quality
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run build` - builds successfully
- [ ] Test all critical flows locally
- [ ] Remove/disable console.logs for production
- [ ] Check for hardcoded test values

### 6. Security
- [ ] Verify no secrets in code
- [ ] Check `.gitignore` includes all env files
- [ ] Validate CORS configuration
- [ ] Review API rate limiting
- [ ] Ensure HTTPS only in production

---

## Vercel Deployment

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository

### Step 2: Configure Project
1. Framework Preset: Next.js (auto-detected)
2. Root Directory: `./` (default)
3. Build Command: `npm run build`
4. Output Directory: `.next` (default)

### Step 3: Add Environment Variables
Add each variable in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
ADMIN_USERNAME=xxx
ADMIN_PASSWORD=xxx
ADMIN_TOKEN=xxx
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Verify deployment URL works

### Step 5: Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatic

---

## Post-Deployment Checklist

### Immediate Verification
- [ ] Home page loads correctly
- [ ] Booking form works
- [ ] Location autocomplete functions
- [ ] User registration works
- [ ] Email verification sent
- [ ] User login works
- [ ] Booking creation works
- [ ] Payment processing works
- [ ] Admin dashboard accessible
- [ ] Admin can view/manage bookings

### Performance Verification
- [ ] Run Lighthouse audit
- [ ] Check mobile responsiveness
- [ ] Verify load times < 3s
- [ ] Test on slow 3G connection

### Security Verification
- [ ] HTTPS redirect working
- [ ] No mixed content warnings
- [ ] API keys not exposed in browser
- [ ] Admin routes protected

### Monitoring Setup
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable Vercel analytics

---

## Rollback Plan

If issues are found:

1. **Quick Rollback**: Use Vercel's instant rollback
   - Go to Deployments
   - Find previous working deployment
   - Click "..." > "Promote to Production"

2. **Code Rollback**: Revert commit and redeploy
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Environment Rollback**: Update env variables in Vercel dashboard

---

## Common Issues & Solutions

### Build Fails
- Check environment variables are set
- Verify `npm run build` works locally
- Check for TypeScript/ESLint errors

### Payment Not Working
- Verify Stripe keys are live mode
- Check webhook endpoint is correct
- Verify webhook signing secret

### Auth Not Working
- Check Supabase URL and key
- Verify email templates are configured
- Check redirect URLs in Supabase

### Maps Not Working
- Verify Google API key is valid
- Check API key restrictions
- Verify billing is enabled

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check payment transactions
- Review booking submissions

### Weekly
- Review performance metrics
- Check for security updates
- Backup database

### Monthly
- Update dependencies
- Review analytics
- Optimize based on usage patterns

---

## Emergency Contacts

- **Vercel Support**: support@vercel.com
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
- **Google Cloud Support**: https://cloud.google.com/support

---

## Version History

| Version | Date | Deployer | Notes |
|---------|------|----------|-------|
| 1.0.0   | TBD  | -        | Initial production release |

---

**Deployment Sign-off**

- [ ] All checklist items completed
- [ ] Production tested and verified
- [ ] Team notified of deployment
- [ ] Documentation updated

Deployed by: _________________ Date: _________________
