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

# Deploy based on branch
case "$CURRENT_BRANCH" in
    "main")
        echo "📦 Deploying analyze-plant function for main branch..."
        npx supabase functions deploy analyze-plant --project-ref inbfxduleyhygxatxmre
        echo "✅ Main branch deployment complete - analyze-plant deployed"
        ;;
    "ios-main")
        echo "ℹ️  iOS branch detected - deployments handled separately"
        echo "✅ No shared project deployment for ios-main branch"
        ;;
    *)
        echo "ℹ️  Branch '$CURRENT_BRANCH' does not require Edge Function deployment"
        echo "✅ No deployment needed for this branch"
        ;;
esac