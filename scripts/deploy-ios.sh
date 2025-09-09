#!/bin/bash

# Deployment script for ios-main branch
# This script ensures only analyze-ios function is deployed

echo "🚀 iOS Branch Deployment - analyze-ios only"

# Check if we're on ios-main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "ios-main" ]; then
    echo "⚠️  Warning: This script is intended for ios-main branch, currently on: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy analyze-ios function only (no ignore file needed - direct function deployment)
echo "📦 Deploying analyze-ios function only..."
npx supabase functions deploy analyze-ios --no-verify-jwt=false

echo "✅ iOS deployment complete - analyze-ios deployed, analyze-plant excluded"