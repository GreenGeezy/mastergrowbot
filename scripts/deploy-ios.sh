#!/bin/bash

# Deployment script for ios-main branch
# This script deploys only analyze-ios function to the separate iOS Supabase project

echo "🚀 iOS Branch Deployment - analyze-ios to separate project"

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

# Check if iOS project ref is set
if [ -z "$IOS_SUPABASE_PROJECT_REF" ]; then
    echo "⚠️  Please set IOS_SUPABASE_PROJECT_REF environment variable"
    echo "💡  You can set it in your shell profile or run:"
    echo "     export IOS_SUPABASE_PROJECT_REF=your-ios-project-ref"
    exit 1
fi

# Deploy analyze-ios function only to the iOS-specific project
echo "📦 Deploying analyze-ios function to iOS project: $IOS_SUPABASE_PROJECT_REF..."
npx supabase functions deploy analyze-ios --project-ref "$IOS_SUPABASE_PROJECT_REF"

echo "✅ iOS deployment complete - analyze-ios deployed to separate project"