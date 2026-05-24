#!/bin/bash

# QR Code Generator - GitHub Pages Deployment Script
# This script helps you deploy the QR Code Generator to GitHub Pages

echo "🚀 QR Code Generator - GitHub Pages Deployment"
echo "============================================"
echo ""

# Check if git is configured
if ! git config user.name >/dev/null 2>&1; then
    echo "❌ Git is not configured. Please set up git first:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "README.md" ]; then
    echo "❌ Not in the QR Code Generator directory."
    echo "   Please run this script from the project root."
    exit 1
fi

echo "✅ Git configuration found."
echo "✅ Project files detected."

# Check git status
echo ""
echo "📁 Checking git status..."
git_status=$(git status --porcelain)
if [ -n "$git_status" ]; then
    echo "⚠️  You have uncommitted changes:"
    echo "$git_status"
    echo ""
    read -p "Do you want to commit these changes? (y/n): " commit_changes
    if [ "$commit_changes" = "y" ]; then
        echo "💬 Enter commit message:"
        read commit_message
        git add .
        git commit -m "$commit_message"
        echo "✅ Changes committed."
    else
        echo "❌ Please commit your changes before deploying."
        exit 1
    fi
fi

echo ""
echo "📤 Pushing changes to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub successfully!"
else
    echo "❌ Failed to push to GitHub. Please check your connection and credentials."
    exit 1
fi

echo ""
echo "📋 Manual Steps Required:"
echo "========================"
echo ""
echo "1. Make your repository public:"
echo "   - Go to: https://github.com/tabascohonigs-commits/qr-code-generator"
echo "   - Click Settings > Danger Zone"
echo "   - Click 'Change repository visibility'"
echo "   - Select 'Public' > Type 'public' > Confirm"
echo ""
echo "2. Enable GitHub Pages:"
echo "   - Go to Settings > Pages"
echo "   - Under 'Build and deployment':"
echo "     - Source: Deploy from a branch"
echo "     - Branch: main"
echo "     - Folder: / (root)"
echo "   - Click Save"
echo ""
echo "3. Wait for deployment:"
echo "   - GitHub will automatically build and deploy your site"
echo "   - This usually takes 1-2 minutes"
echo ""
echo "4. Your live site will be at:"
echo "   https://tabascohonigs-commits.github.io/qr-code-generator"
echo ""
echo "🎉 Deployment setup complete!"
echo ""
echo "💡 Pro tips:"
echo "- The GitHub Actions workflow (.github/workflows/gh-pages.yml)"
echo "  will automatically deploy every time you push to main"
echo "- You can deploy the enhanced version by accessing index-enhanced.html"
echo "- Test your site thoroughly after deployment"