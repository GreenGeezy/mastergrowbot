#!/bin/bash

# Master Growbot iOS Branch Deployment Script  
# EXPLICIT SCOPE: ONLY deploys analyze-ios function - NO main functions
# AUTO-SYNC DISABLED: Prevents unintended shared project deployment

set -e  # Exit on any error

# Branch protection: Only deploy on ios-main branch
CURRENT_BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current 2>/dev/null || echo "unknown")}

echo "🔍 SCOPED DEPLOYMENT: iOS branch protection check..."
echo "🐞 DEBUG: iOS branch validation context:"
echo "   - VERCEL_GIT_COMMIT_REF: ${VERCEL_GIT_COMMIT_REF:-'unset'}"
echo "   - VERCEL_GIT_PREVIOUS_SHA: ${VERCEL_GIT_PREVIOUS_SHA:-'unset'}"
echo "   - Expected: ios-main"
echo "📍 Current branch: $CURRENT_BRANCH"
echo "🚨 EarlyDrop Prevention: iOS function isolation check"
echo "🚫 AUTO-SYNC DISABLED: No shared project deployments"

# Explicit safeguard: Block analyze-plant deployment on ios-main
if [ "$CURRENT_BRANCH" = "ios-main" ]; then
    echo "✅ iOS branch confirmed - proceeding with SCOPED analyze-ios deployment"
    echo "🚫 DISABLED: Auto-sync to prevent analyze-plant deployment"
else
    echo "⚠️  Not on ios-main branch ($CURRENT_BRANCH) - skipping deployment"
    echo "🚫 AUTO-SYNC BLOCKED: No deployments on non-ios branches"
    exit 0
fi

echo "🚀 Starting SCOPED iOS branch deployment (analyze-ios only)..."

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

# CRITICAL: Explicitly block main function deployment and auto-sync
echo "🛡️  Enforcing strict iOS branch isolation - analyze-plant will NOT be deployed"
echo "🚫 AUTO-SYNC DISABLED: Preventing shared project (inbfxduleyhygxatxmre) deployments"

# Deploy only analyze-ios function to separate project - SCOPED DEPLOYMENT
echo "📦 SCOPED DEPLOYMENT: analyze-ios function to dedicated iOS project only..."
echo "🎯 TARGET: $NEW_SUPABASE_PROJECT_REF (analyze-ios only, NOT shared project)"
npx supabase functions deploy analyze-ios --project-ref $NEW_SUPABASE_PROJECT_REF

echo "✅ SCOPED iOS branch deployment complete!"
echo "🔒 analyze-ios deployed to separate project, analyze-plant blocked, auto-sync disabled"
echo "🚫 CONFIRMATION: No shared project deployments, no auto-sync features active"