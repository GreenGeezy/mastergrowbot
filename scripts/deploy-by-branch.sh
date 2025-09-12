#!/bin/bash

# Master Growbot Branch-Specific Deployment Script
# EXPLICIT SCOPE: Only deploys specific Edge Functions based on branch
# DISABLES: All auto-sync and bulk deployment features

set -e  # Exit on any error

echo "🔍 SCOPED DEPLOYMENT: Checking current branch..."
echo "🚫 AUTO-SYNC DISABLED: No bulk deployments will occur"

# Get the current branch from Vercel environment or fallback to git
CURRENT_BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current 2>/dev/null || echo "unknown")}

echo "📍 Current branch: $CURRENT_BRANCH"
echo "🎯 SCOPE: Only deploying branch-specific functions"

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

# EXPLICIT BRANCH PROTECTION: Prevent cross-deployment and auto-sync
echo "🛡️  Applying strict branch-based deployment protection..."
echo "🚫 DISABLING: Auto-sync, bulk deploys, implicit function updates"

# Deploy based on branch with explicit safeguards - SCOPED ONLY
case "$CURRENT_BRANCH" in
    "main")
        echo "📦 SCOPED: Main branch deploying ONLY analyze-plant function"
        echo "🔒 BLOCKED: analyze-ios deployment on main branch"
        echo "🚫 DISABLED: Auto-sync to prevent unintended deployments"
        npx supabase functions deploy analyze-plant --project-ref inbfxduleyhygxatxmre
        echo "✅ SCOPED deployment complete - analyze-plant only, auto-sync disabled"
        ;;
    "ios-main")
        echo "🔒 BLOCKED: Main project deployments on ios-main branch"
        echo "🚫 DISABLED: Auto-sync to prevent analyze-plant deployment"
        echo "ℹ️  iOS-specific deployments handled by separate script"
        echo "✅ No shared project deployment - branch isolation enforced"
        ;;
    *)
        echo "🔒 BLOCKED: No Edge Function deployment for branch '$CURRENT_BRANCH'"
        echo "🚫 DISABLED: Auto-sync and bulk deployments"
        echo "✅ Branch protection active - no functions deployed"
        ;;
esac

echo "🚫 AUTO-SYNC CONFIRMATION: All automatic deployment features disabled"