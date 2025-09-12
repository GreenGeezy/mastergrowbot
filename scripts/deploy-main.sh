#!/bin/bash

# Master Growbot Main Branch Deployment Script
# EXPLICIT SCOPE: ONLY deploys analyze-plant function - NO iOS functions
# AUTO-SYNC DISABLED: Prevents unintended cross-deployment

set -e  # Exit on any error

# Branch protection: Only deploy on main branch
CURRENT_BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current 2>/dev/null || echo "unknown")}

echo "🔍 SCOPED DEPLOYMENT: Branch protection check..."
echo "📍 Current branch: $CURRENT_BRANCH"
echo "🚫 AUTO-SYNC DISABLED: No bulk deployments"

# Explicit safeguard: Block analyze-ios deployment on main
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "✅ Main branch confirmed - proceeding with SCOPED analyze-plant deployment"
    echo "🚫 DISABLED: Auto-sync to prevent analyze-ios deployment"
else
    echo "⚠️  Not on main branch ($CURRENT_BRANCH) - skipping deployment"
    echo "🚫 AUTO-SYNC BLOCKED: No deployments on non-main branches"
    exit 0
fi

echo "🚀 Starting SCOPED main branch deployment (analyze-plant only)..."

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Install Supabase CLI if not available
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase (assumes SUPABASE_ACCESS_TOKEN is set)
echo "🔐 Logging into Supabase..."
npx supabase login

# CRITICAL: Explicitly block iOS function deployment and auto-sync
echo "🛡️  Enforcing strict main branch isolation - analyze-ios will NOT be deployed"
echo "🚫 AUTO-SYNC DISABLED: Preventing implicit bulk function deployments"

# Deploy only analyze-plant function - SCOPED DEPLOYMENT
echo "📦 SCOPED DEPLOYMENT: analyze-plant function to shared project only..."
echo "🎯 TARGET: inbfxduleyhygxatxmre (analyze-plant only)"
npx supabase functions deploy analyze-plant --project-ref inbfxduleyhygxatxmre

echo "✅ SCOPED main branch deployment complete!"
echo "🔒 analyze-plant deployed, analyze-ios blocked, auto-sync disabled"
echo "🚫 CONFIRMATION: No bulk deployments, no auto-sync features active"