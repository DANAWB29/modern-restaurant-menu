#!/bin/bash

# Modern Restaurant Menu - Deployment Script
# This script helps you deploy your app to GitHub and Vercel

echo "🍽️  Modern Restaurant Menu - Deployment Helper"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Deploy: Modern Restaurant Menu App"
fi
git commit -m "$commit_message"

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote origin already configured"
    echo "🚀 Pushing to GitHub..."
    git push origin main
else
    echo "🔗 Please add your GitHub repository URL:"
    echo "Example: https://github.com/yourusername/modern-restaurant-menu.git"
    read -p "GitHub repository URL: " repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        git branch -M main
        git push -u origin main
        echo "✅ Successfully pushed to GitHub!"
    else
        echo "❌ No repository URL provided. Skipping GitHub push."
    fi
fi

echo ""
echo "🎉 Deployment Steps Completed!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your repository"
echo "5. Deploy with default settings"
echo ""
echo "🌐 Your app will be live at: https://your-app-name.vercel.app"
echo "🔧 Admin panel: https://your-app-name.vercel.app/admin"
echo "💳 Payment page: https://your-app-name.vercel.app/payment"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🚀 Happy deploying!"