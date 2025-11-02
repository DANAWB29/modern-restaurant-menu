# 🔧 GitHub Token Troubleshooting Guide

## Common Error: "Resource not accessible by personal access token"

This error occurs when the GitHub token doesn't have the right permissions or the repository configuration is incorrect.

## 🛠️ Quick Fixes

### 1. **Check Repository Configuration**

In `src/services/realtimeMenuService.js`, make sure these are correct:

```javascript
this.githubOwner = 'YOUR_ACTUAL_GITHUB_USERNAME' // Your GitHub username
this.githubRepo = 'modern-restaurant-menu' // Your actual repository name
```

### 2. **Verify Token Permissions**

Your GitHub Personal Access Token needs these permissions:

#### For Public Repositories:
- ✅ `public_repo` - Access public repositories
- ✅ `repo:status` - Access commit status
- ✅ `repo_deployment` - Access deployment status

#### For Private Repositories:
- ✅ `repo` - Full control of private repositories

### 3. **Create New Token with Correct Permissions**

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Set these permissions:
   - **For public repos**: Check `public_repo`
   - **For private repos**: Check `repo` (full access)
4. Copy the token immediately (you won't see it again!)

### 4. **Test Repository Access**

Make sure your repository exists and is accessible:
- Visit: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
- Ensure the repository contains the `public/menu-data.json` file

## 🔄 Fallback System

**Good News**: Even if GitHub integration fails, the system has multiple fallbacks:

### ✅ **What Still Works:**
1. **Local Saving**: Menu changes save to your device immediately
2. **File Download**: System automatically downloads `menu-data.json` file
3. **Manual Deployment**: Replace the file in your project and redeploy
4. **All Devices Update**: After redeployment, all devices see changes

### 📁 **Manual Deployment Process:**
1. Make changes in admin panel
2. System downloads `menu-data.json` file
3. Replace `public/menu-data.json` in your project
4. Run: `git add . && git commit -m "Update menu" && git push`
5. Vercel automatically redeploys
6. All devices see updated menu!

## 🎯 **Recommended Approach**

### Option 1: Fix GitHub Integration
- Follow the token setup steps above
- Get real-time updates working

### Option 2: Use Manual Deployment (Simpler)
- Skip GitHub token setup entirely
- Use the automatic file download feature
- Manually deploy when needed (still very fast!)

## 🚀 **Both Methods Work Great!**

- **GitHub Integration**: Instant updates (more complex setup)
- **Manual Deployment**: 2-3 minute updates (simpler, more reliable)

Choose what works best for your restaurant's needs!

## 🔍 **Debug Steps**

If you want to troubleshoot further:

1. **Check Repository URL**:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
   ```

2. **Test Token in Browser**:
   ```
   https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME
   ```

3. **Verify File Exists**:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/blob/main/public/menu-data.json
   ```

## 💡 **Pro Tip**

The manual deployment method is actually preferred by many restaurants because:
- ✅ **More reliable** (no API dependencies)
- ✅ **Version controlled** (all changes tracked in Git)
- ✅ **Faster setup** (no token configuration needed)
- ✅ **Still very fast** (2-3 minutes vs 10 seconds)

---

**Your menu system works perfectly either way! Choose the method that fits your workflow best.** 🍽️✨