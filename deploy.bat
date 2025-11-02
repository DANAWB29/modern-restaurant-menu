@echo off
REM Modern Restaurant Menu - Deployment Script for Windows
REM This script helps you deploy your app to GitHub and Vercel

echo 🍽️  Modern Restaurant Menu - Deployment Helper
echo ==============================================

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Deploy: Modern Restaurant Menu App
git commit -m "%commit_message%"

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Remote origin already configured
    echo 🚀 Pushing to GitHub...
    git push origin main
) else (
    echo 🔗 Please add your GitHub repository URL:
    echo Example: https://github.com/yourusername/modern-restaurant-menu.git
    set /p repo_url="GitHub repository URL: "
    
    if not "%repo_url%"=="" (
        git remote add origin "%repo_url%"
        git branch -M main
        git push -u origin main
        echo ✅ Successfully pushed to GitHub!
    ) else (
        echo ❌ No repository URL provided. Skipping GitHub push.
    )
)

echo.
echo 🎉 Deployment Steps Completed!
echo ================================
echo.
echo 📋 Next Steps:
echo 1. Go to https://vercel.com
echo 2. Sign in with GitHub
echo 3. Click 'New Project'
echo 4. Import your repository
echo 5. Deploy with default settings
echo.
echo 🌐 Your app will be live at: https://your-app-name.vercel.app
echo 🔧 Admin panel: https://your-app-name.vercel.app/admin
echo 💳 Payment page: https://your-app-name.vercel.app/payment
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
echo.
echo 🚀 Happy deploying!
pause