# 🚀 TrustyLads E-commerce - Deployment Guide

## 📋 Overview
This guide will help you deploy the TrustyLads e-commerce application to production. The application consists of:
- **Frontend**: React + TypeScript + Vite (Deploy to Vercel)
- **Backend**: Node.js + Express + TypeScript (Deploy to Render/Railway/Heroku)
- **Database**: MongoDB Atlas (Cloud)

## 🎯 Quick Start

### 1. **Prepare Your Repository**
```bash
# Files to include in GitHub repo
✅ Include:
├── frontend/
│   ├── src/                    # Source code
│   ├── public/                 # Public assets
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite config
│   ├── vercel.json            # Vercel deployment config
│   └── .gitignore             # Git ignore file
└── backend/
    ├── src/                   # Source code
    ├── package.json          # Dependencies
    ├── tsconfig.json         # TypeScript config
    └── .gitignore            # Git ignore file

❌ DON'T include:
├── node_modules/             # Dependencies (auto-installed)
├── dist/                     # Build output (auto-generated)
├── .env                      # Environment variables (sensitive)
└── uploads/                  # Uploaded files
```

### 2. **Environment Variables Setup**

#### **Frontend (.env)**
```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com

# Google OAuth (if using)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Razorpay (if using)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id

# Environment
VITE_NODE_ENV=production
```

#### **Backend (.env)**
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustylads?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-make-it-long-and-random
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
JWT_REFRESH_EXPIRES_IN=7d

# Admin Default Credentials
ADMIN_EMAIL=admin@trustylads.com
ADMIN_PASSWORD=your-secure-admin-password

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
FRONTEND_URL_PROD=https://your-frontend-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-domain.com/auth/callback

# Email Service (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Razorpay (if using)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Cloudinary (if using for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🌐 Deployment Platforms

### **Frontend: Vercel (Recommended)**

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from the Frontend .env section above

4. **Deploy**
   - Click "Deploy"
   - Your site will be available at `https://your-project.vercel.app`

### **Backend: Render (Recommended)**

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `trustylads-backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

3. **Environment Variables**
   - Go to Environment → Environment Variables
   - Add all variables from the Backend .env section above

4. **Deploy**
   - Click "Create Web Service"
   - Your API will be available at `https://your-service.onrender.com`

## 🔧 Database Setup

### **MongoDB Atlas**

1. **Create Cluster**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free account
   - Create new cluster (M0 Free tier)

2. **Configure Database**
   - Create database user
   - Get connection string
   - Add to backend environment variables

3. **Network Access**
   - Allow access from anywhere (0.0.0.0/0) for development
   - Restrict to specific IPs for production

## 📧 Email Service Setup

### **Gmail SMTP**

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA

2. **Generate App Password**
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Use this password in SMTP_PASS

3. **Configure Backend**
   - Add SMTP settings to backend environment variables

## 🔐 Security Checklist

- [ ] **Environment Variables**: All secrets in .env files
- [ ] **HTTPS**: Enable SSL certificates
- [ ] **CORS**: Configure for your domains only
- [ ] **Rate Limiting**: Already implemented
- [ ] **Input Validation**: Already implemented
- [ ] **Password Hashing**: Already implemented
- [ ] **JWT Security**: HTTP-only cookies
- [ ] **Database**: Use MongoDB Atlas (cloud)

## 🚀 Deployment Steps

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### **Step 2: Deploy Backend**
1. Connect repository to Render
2. Add environment variables
3. Deploy and get URL

### **Step 3: Deploy Frontend**
1. Connect repository to Vercel
2. Add environment variables (update VITE_API_URL with backend URL)
3. Deploy

### **Step 4: Test Everything**
- [ ] User registration/login
- [ ] Google OAuth
- [ ] Password reset
- [ ] Admin panel
- [ ] Product management
- [ ] Payment flow
- [ ] Order management

## 🔍 Troubleshooting

### **Common Issues**

1. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly in backend
   - Check if frontend URL matches exactly

2. **Database Connection**
   - Verify MONGODB_URI is correct
   - Check network access in MongoDB Atlas

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check if 2FA is enabled for Gmail
   - Use app password, not regular password

4. **Build Failures**
   - Check if all dependencies are in package.json
   - Verify TypeScript compilation

### **Logs and Debugging**

- **Vercel**: Check deployment logs in dashboard
- **Render**: Check logs in service dashboard
- **Backend**: Check console logs in Render dashboard

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test locally first to isolate issues
4. Check the troubleshooting section above

## 🎉 Success!

Once deployed, your TrustyLads e-commerce application will be:
- ✅ Fully functional with authentication
- ✅ Secure with proper JWT handling
- ✅ Responsive and mobile-friendly
- ✅ Production-ready with error handling
- ✅ Integrated with payment gateway
- ✅ Complete admin panel functionality

**Live URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-service.onrender.com`
- Admin Panel: `https://your-project.vercel.app/admin`

Happy selling! 🛍️
