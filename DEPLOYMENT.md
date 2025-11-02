# 🚀 Deployment Guide

This guide will help you deploy your Modern Restaurant Menu App to GitHub and Vercel.

## 📋 Prerequisites

- Git installed on your computer
- GitHub account
- Vercel account (free)

## 🔧 Step 1: Prepare for GitHub

### 1.1 Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Modern Restaurant Menu App"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New Repository" (green button)
3. Repository name: `modern-restaurant-menu` (or your preferred name)
4. Description: `Modern responsive restaurant menu web app with admin panel`
5. Keep it **Public** (or Private if you prefer)
6. **Don't** initialize with README (we already have one)
7. Click "Create Repository"

### 1.3 Connect Local Repository to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: (press enter for default or type custom name)
# - In which directory is your code located? ./
# - Want to override settings? N
```

### 2.2 Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

## ⚙️ Step 3: Environment Variables (Optional)

If you want to use environment variables for configuration:

### 3.1 In Vercel Dashboard

1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add variables:
   - `VITE_RESTAURANT_NAME` = `Your Restaurant Name`
   - `VITE_RESTAURANT_PHONE` = `+1 (555) 123-4567`
   - `VITE_TELEBIRR_PHONE` = `0941165124`
   - `VITE_CBE_ACCOUNT` = `1000580304641`
   - `VITE_ADMIN_PASSWORD` = `your-secure-password`

### 3.2 Update Code to Use Environment Variables

The app is already configured to work without environment variables, but you can optionally update `src/data/menuData.js` to use them:

```javascript
export const restaurantConfig = {
  name: import.meta.env.VITE_RESTAURANT_NAME || 'Golden Spoon',
  phone: import.meta.env.VITE_RESTAURANT_PHONE || '+1 (555) 123-4567',
  // ... other config
}
```

## 🔄 Step 4: Continuous Deployment

Once connected, every push to your main branch will automatically deploy to Vercel!

```bash
# Make changes to your code
# Then commit and push
git add .
git commit -m "Update menu items"
git push origin main

# Vercel will automatically deploy the changes
```

## 📱 Step 5: Custom Domain (Optional)

### 5.1 In Vercel Dashboard

1. Go to your project
2. Click "Settings" tab
3. Click "Domains"
4. Add your custom domain
5. Follow DNS configuration instructions

## 🛠️ Troubleshooting

### Build Errors

If you encounter build errors:

1. **Check Node.js version**: Vercel uses Node.js 18.x by default
2. **Clear cache**: In Vercel dashboard, go to Deployments → Click on failed deployment → Redeploy
3. **Check build logs**: Look for specific error messages in the deployment logs

### Common Issues

1. **404 on refresh**: The `vercel.json` file handles this with rewrites
2. **Images not loading**: Make sure image URLs are accessible
3. **Environment variables**: Remember to prefix with `VITE_` for Vite apps

## 📊 Performance Optimization

Your app is already optimized with:

- ✅ **Code splitting** with React Router
- ✅ **Optimized images** with proper sizing
- ✅ **Minimal bundle size** with tree shaking
- ✅ **Fast loading** with Vite's optimization
- ✅ **Caching headers** configured in vercel.json

## 🔒 Security Notes

- Admin panel uses client-side authentication (demo purposes)
- All data stored in localStorage
- No sensitive server-side data
- Perfect for demo and development

## 📈 Analytics (Optional)

Add Vercel Analytics:

1. In Vercel dashboard, go to your project
2. Click "Analytics" tab
3. Enable Web Analytics
4. Add the script to your `index.html` if needed

## 🎉 You're Live!

Your restaurant menu app is now live and accessible worldwide! 

### Next Steps:

1. **Share your URL** with customers
2. **Customize** the menu items and branding
3. **Test** on different devices
4. **Monitor** performance with Vercel Analytics
5. **Update** content through the admin panel

### Example URLs:
- **Production**: `https://your-app-name.vercel.app`
- **Admin Panel**: `https://your-app-name.vercel.app/admin`
- **Payment Page**: `https://your-app-name.vercel.app/payment`

---

**Congratulations! Your modern restaurant menu is now live! 🍽️✨**