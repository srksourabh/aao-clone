
# AaoCab Deployment Guide

This guide will walk you through deploying the AaoCab website to production using Vercel (recommended) or other hosting platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the recommended hosting platform for Next.js applications, offering:
- Zero-config deployments
- Automatic HTTPS
- Global CDN
- Serverless functions
- Preview deployments for every push

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Vercel account (free tier available)

### Step 1: Push to Git Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - AaoCab website"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/aaocab.git

# Push to main branch
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js configuration
5. Add environment variables (see below)
6. Click "Deploy"

### Step 3: Configure Environment Variables

In Vercel dashboard, go to Project Settings > Environment Variables and add:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
ADMIN_TOKEN=your_secure_token_here
```

**Important**: Use strong, unique values for production!

### Step 4: Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain (e.g., aaocab.com)
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)

## 🔧 Alternative Deployment Options

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Set environment variables in Netlify dashboard

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and create project:
```bash
railway login
railway init
```

3. Add environment variables:
```bash
railway variables set ADMIN_USERNAME=admin
railway variables set ADMIN_PASSWORD=your_password
railway variables set ADMIN_TOKEN=your_token
```

4. Deploy:
```bash
railway up
```

### Manual VPS Deployment (Ubuntu/Debian)

1. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Clone repository:
```bash
git clone https://github.com/yourusername/aaocab.git
cd aaocab
```

3. Install dependencies:
```bash
npm install
```

4. Create .env.local:
```bash
nano .env.local
# Add your environment variables
```

5. Build project:
```bash
npm run build
```

6. Install PM2 (process manager):
```bash
sudo npm install -g pm2
```

7. Start application:
```bash
pm2 start npm --name "aaocab" -- start
pm2 save
pm2 startup
```

8. Configure Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name aaocab.com www.aaocab.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. Get SSL certificate with Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d aaocab.com -d www.aaocab.com
```

## 🔐 Security Checklist

Before going to production:

- [ ] Change default admin credentials
- [ ] Generate strong, unique admin token
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up HSTS headers
- [ ] Configure CSP headers (if needed)
- [ ] Enable rate limiting on API routes
- [ ] Review and update CORS settings
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure backup strategy
- [ ] Test all API endpoints
- [ ] Verify environment variables are set correctly

## 📊 Post-Deployment

### Verify Deployment

1. Test booking form functionality
2. Test WhatsApp integration
3. Test admin dashboard login
4. Verify all pages load correctly
5. Test mobile responsiveness
6. Run Lighthouse audit
7. Test on multiple browsers
8. Verify analytics tracking (if configured)

### Monitoring

Set up monitoring with:
- **Vercel Analytics** (built-in with Vercel)
- **Google Analytics 4** (add GA_ID to env vars)
- **Sentry** for error tracking
- **Uptime Robot** for uptime monitoring

### Performance Optimization

- Enable Vercel Image Optimization
- Configure caching headers
- Enable compression
- Use CDN for static assets
- Monitor Core Web Vitals

## 🔄 Continuous Deployment

With Vercel/Netlify, every push to main branch triggers:
1. Automatic build
2. Run tests (if configured)
3. Deploy to production
4. Invalidate CDN cache

For preview deployments:
- Every PR creates a preview URL
- Test changes before merging
- Share with stakeholders

## 📝 Rollback Strategy

### Vercel
1. Go to Deployments in dashboard
2. Find previous working deployment
3. Click "Promote to Production"

### Manual
```bash
git revert <commit-hash>
git push origin main
```

## 🆘 Troubleshooting

### Build Fails
- Check build logs for errors
- Verify all dependencies are listed in package.json
- Ensure Node.js version matches development

### Environment Variables Not Working
- Restart deployment after adding env vars
- Check variable names match exactly
- Ensure no trailing spaces in values

### Images Not Loading
- Verify images are in public folder
- Check file paths are correct
- Enable Vercel Image Optimization

### API Routes Failing
- Check serverless function logs
- Verify API route file naming
- Test locally with `npm run build && npm start`

## 📞 Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Railway: [railway.app/help](https://railway.app/help)

---

**Last Updated**: November 2025  
**Next Review**: February 2026
