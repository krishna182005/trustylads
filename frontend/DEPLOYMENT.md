# TrustyLads E-commerce Platform - Deployment Guide

## 🚀 Complete Deployment Guide

This guide covers deploying both the frontend and backend of the TrustyLads e-commerce platform with all the new features including Telegram alerts, review system, and improved UI.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account
- Google Cloud Console account
- Telegram Bot (for alerts)
- Razorpay account (for payments)

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend Repository

```bash
# Clone your repository
git clone <your-repo-url>
cd backend-main/backend-main

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Environment Variables for Backend

Create a `.env` file in the backend root with these variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustylads?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-2024
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-2024
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email Service (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Telegram Alerts
TELEGRAM_BOT_TOKEN=8406648065:AAE16UTyXOQ0dbDyOfNNrPdWfODoWvpxAyM
TELEGRAM_CHAT_ID=your-chat-id

# URLs
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.onrender.com

# Admin
ADMIN_EMAIL=admin@trustylads.com
ADMIN_PASSWORD=secure-admin-password

# Environment
NODE_ENV=production
```

### 3. Deploy to Render

1. **Connect Repository**: Link your GitHub repository to Render
2. **Create Web Service**:
   - **Name**: `trustylads-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all variables from step 2

3. **Advanced Settings**:
   - **Auto-Deploy**: Enabled
   - **Health Check Path**: `/api/health`

### 4. Verify Backend Deployment

```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Test Telegram connection
curl -X POST https://your-backend.onrender.com/api/health/test-telegram
```

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Frontend Repository

```bash
cd trustylads-main/frontend

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Environment Variables for Frontend

Create a `.env.local` file in the frontend root:

```env
# API Configuration
VITE_API_URL=https://your-backend.onrender.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Environment
VITE_ENV=production
```

### 3. Deploy to Vercel

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `trustylads-main/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**: Add all variables from step 2

4. **Deploy Settings**:
   - **Auto-Deploy**: Enabled
   - **Branch**: `main`

### 4. Configure Vercel Rewrites

Create `vercel.json` in the frontend root:

```json
{
  "rewrites": [
    {
      "source": "/auth/google/callback",
      "destination": "/index.html"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

## 🔐 Security Configuration

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:3000`
   - `https://your-frontend.vercel.app`
6. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
   - `https://your-backend.onrender.com/auth/google/callback`

### 2. Telegram Bot Setup

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot: `/newbot`
3. Get the bot token
4. Add the bot to your chat/group
5. Get the chat ID by messaging the bot and checking:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

### 3. Razorpay Setup

1. Create a Razorpay account
2. Get test/live API keys
3. Configure webhook URL: `https://your-backend.onrender.com/api/payment/razorpay/webhook`
4. Set webhook secret

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create database user
3. Get connection string
4. Add IP whitelist (0.0.0.0/0 for Render)

## 📧 Email Service Setup

### Gmail SMTP Configuration

1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `SMTP_PASS`

## 🧪 Testing Deployment

### 1. Test Backend Endpoints

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Test Telegram
curl -X POST https://your-backend.onrender.com/api/health/test-telegram

# Test products
curl https://your-backend.onrender.com/api/products

# Test categories
curl https://your-backend.onrender.com/api/categories
```

### 2. Test Frontend Features

1. **Homepage**: Check if products load
2. **Product Details**: Verify images, reviews, add to cart
3. **Authentication**: Test Google login
4. **Cart**: Add items and checkout
5. **Orders**: Place COD and online orders
6. **Reviews**: Submit and view reviews
7. **Admin Panel**: Access with admin credentials

### 3. Test Telegram Alerts

1. Place a COD order
2. Complete an online payment
3. Check Telegram for alerts

## 🔄 Database Setup

### 1. Seed Initial Data

```bash
# Run on your local machine or Render console
cd backend-main/backend-main

# Seed categories
npm run seed-categories

# Seed products
npm run seed-products

# Update product categories
npm run update-categories
```

### 2. Create Indexes

```bash
# Create text indexes for search
node create-text-index.js

# Check all indexes
node check-all-indexes.js
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check frontend URL in backend CORS config
   - Verify environment variables

2. **Google OAuth Errors**:
   - Verify client ID and secret
   - Check redirect URIs
   - Ensure cookies are enabled

3. **Telegram Not Working**:
   - Verify bot token and chat ID
   - Check if bot is added to chat
   - Test with `/test-telegram` endpoint

4. **Database Connection**:
   - Check MongoDB URI
   - Verify network access
   - Check database user permissions

5. **Build Errors**:
   - Check Node.js version (use 18+)
   - Verify all dependencies installed
   - Check TypeScript compilation

### Debug Commands

```bash
# Check backend logs
# In Render dashboard → Logs

# Check frontend build
npm run build

# Test API locally
npm run dev

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI
```

## 📊 Monitoring

### 1. Backend Monitoring

- **Render Dashboard**: Monitor logs, performance
- **MongoDB Atlas**: Database performance
- **Telegram**: Order alerts

### 2. Frontend Monitoring

- **Vercel Analytics**: Page views, performance
- **Console Logs**: Browser developer tools

## 🔄 Updates and Maintenance

### 1. Backend Updates

```bash
# Push to GitHub
git add .
git commit -m "Update backend"
git push origin main

# Render will auto-deploy
```

### 2. Frontend Updates

```bash
# Push to GitHub
git add .
git commit -m "Update frontend"
git push origin main

# Vercel will auto-deploy
```

### 3. Database Backups

- MongoDB Atlas provides automatic backups
- Export data periodically: `mongodump`

## 🎯 Production Checklist

- [ ] All environment variables set
- [ ] Google OAuth configured
- [ ] Telegram bot working
- [ ] Razorpay webhooks configured
- [ ] Email service working
- [ ] Database seeded with products
- [ ] Admin panel accessible
- [ ] SSL certificates active
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Performance optimized
- [ ] Security headers set
- [ ] Rate limiting enabled

## 📞 Support

For issues or questions:
- **Email**: support@trustylads.com
- **WhatsApp**: +91 6369360104
- **Telegram**: @trustylads_support

---

**TrustyLads E-commerce Platform** - Ready for Production! 🚀
