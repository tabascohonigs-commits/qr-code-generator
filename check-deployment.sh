#!/bin/bash

# QR Code Generator - Deployment Status Checker
# This script checks if the repository is ready for GitHub Pages deployment

echo "🔍 QR Code Generator - Deployment Status Check"
echo "============================================="

# Check if repository exists
echo "📁 Checking repository..."
if curl -s "https://api.github.com/repos/tabascohonigs-commits/qr-code-generator" | grep -q "Not Found"; then
    echo "❌ Repository not found or access denied."
    echo "   Make sure the repository exists and you have access."
    exit 1
fi

echo "✅ Repository found."

# Check if repository is public
echo ""
echo "🔒 Checking repository visibility..."
repo_visibility=$(curl -s "https://api.github.com/repos/tabascohonigs-commits/qr-code-generator" | grep '"private"' | cut -d'"' -f4)

if [ "$repo_visibility" = "true" ]; then
    echo "⚠️  Repository is private. GitHub Pages requires public repositories."
    echo "   To make it public:"
    echo "   1. Go to: https://github.com/tabascohonigs-commits/qr-code-generator"
    echo "   2. Click Settings > Danger Zone"
    echo "   3. Click 'Change repository visibility'"
    echo "   4. Select 'Public' > Type 'public' > Confirm"
else
    echo "✅ Repository is public."
fi

# Check if GitHub Pages is enabled
echo ""
echo "📄 Checking GitHub Pages status..."
pages_status=$(curl -s "https://api.github.com/repos/tabascohonigs-commits/qr-code-generator/pages" | grep -o '"status":[^,]*' | cut -d'"' -f4)

if [ -z "$pages_status" ]; then
    echo "⚠️  GitHub Pages not enabled yet."
    echo "   To enable GitHub Pages:"
    echo "   1. Go to Settings > Pages"
    echo "   2. Under 'Build and deployment':"
    echo "     - Source: Deploy from a branch"
    echo "     - Branch: main"
    echo "     - Folder: / (root)"
    echo "   3. Click Save"
else
    echo "✅ GitHub Pages status: $pages_status"
fi

# Check GitHub Actions workflow
echo ""
echo "🔄 Checking GitHub Actions workflow..."
if curl -s "https://api.github.com/repos/tabascohonigs-commits/qr-code-generator/actions/workflows/gh-pages.yml" | grep -q "Not Found"; then
    echo "❌ GitHub Actions workflow not found."
else
    echo "✅ GitHub Actions workflow found."
fi

# List files in repository
echo ""
echo "📋 Repository contents:"
echo "======================"
ls -la

echo ""
echo "🎯 Next Steps:"
echo "============="
echo "1. If repository is private, make it public"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Wait for automatic deployment"
echo "4. Visit: https://tabascohonigs-commits.github.io/qr-code-generator"

echo ""
echo "💡 Remember:"
echo "- The enhanced version is available at index-enhanced.html"
echo "- Both versions will be deployed automatically"
echo "- Test thoroughly after deployment"