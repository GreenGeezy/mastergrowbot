#!/bin/bash

# Master Growbot Branch-Specific Deployment Script
# Deploys specific Edge Functions based on the current branch

set -e  # Exit on any error

echo "🔍 Checking current branch..."

# Get the current branch from Vercel environment or fallback to git
CURRENT_BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current 2>/dev/null || echo "unknown")}

echo "📍 Current branch: $CURRENT_BRANCH"

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Install Supabase CLI if not available
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase using the access token
echo "🔐 Logging into Supabase..."
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not found in environment variables"
    exit 1
fi

npx supabase login

# EXPLICIT BRANCH PROTECTION: Prevent cross-deployment
echo "🛡️  Applying branch-based deployment protection..."

# Deploy based on branch with explicit safeguards
case "$CURRENT_BRANCH" in
    "main")
        echo "📦 Main branch: Deploying ONLY analyze-plant function..."
        echo "🔒 Blocking analyze-ios deployment on main branch"
        npx supabase functions deploy analyze-plant --project-ref inbfxduleyhygxatxmre
        echo "✅ Main branch deployment complete - analyze-plant deployed, analyze-ios blocked"
        ;;
    "ios-main")
        echo "ℹ️  iOS branch detected - deployments handled separately"
        echo "🔒 Blocking analyze-plant deployment on ios-main branch"
        echo "✅ No shared project deployment for ios-main branch"
        ;;
    *)
        echo "ℹ️  Branch '$CURRENT_BRANCH' does not require Edge Function deployment"
        echo "🔒 No functions deployed - branch protection active"
        echo "✅ No deployment needed for this branch"
        ;;
esac