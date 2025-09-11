#!/bin/bash

# Master Growbot iOS Branch Deployment Script  
# ONLY deploys analyze-ios function - NO main functions

set -e  # Exit on any error

# Branch protection: Only deploy on ios-main branch
CURRENT_BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current 2>/dev/null || echo "unknown")}

echo "🔍 Branch protection check..."
echo "📍 Current branch: $CURRENT_BRANCH"

# Explicit safeguard: Block analyze-plant deployment on ios-main
if [ "$CURRENT_BRANCH" = "ios-main" ]; then
    echo "✅ iOS branch confirmed - proceeding with analyze-ios deployment"
else
    echo "⚠️  Not on ios-main branch ($CURRENT_BRANCH) - skipping deployment"
    exit 0
fi

echo "🚀 Starting iOS branch deployment..."

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Install Supabase CLI if not available
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Check for required environment variables
if [ -z "$NEW_SUPABASE_PROJECT_REF" ]; then
    echo "❌ NEW_SUPABASE_PROJECT_REF not found in environment variables"
    echo "ℹ️  Please set up the new iOS Supabase project first"
    exit 1
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not found in environment variables"
    exit 1
fi

# Login to Supabase
echo "🔐 Logging into Supabase..."
npx supabase login

# CRITICAL: Explicitly block main function deployment on ios-main branch  
echo "🛡️  Enforcing iOS branch isolation - analyze-plant will NOT be deployed"

# Deploy only analyze-ios function to NEW project
echo "📦 Deploying analyze-ios function to dedicated iOS project..."
npx supabase functions deploy analyze-ios --project-ref $NEW_SUPABASE_PROJECT_REF

echo "✅ iOS branch deployment complete!"
echo "🔒 analyze-ios deployed, analyze-plant blocked on ios-main branch"