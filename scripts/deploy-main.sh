#!/bin/bash

# Master Growbot Main Branch Deployment Script
# ONLY deploys analyze-plant function - NO iOS functions

set -e  # Exit on any error

# Branch protection: Only deploy on main branch
CURRENT_BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current 2>/dev/null || echo "unknown")}

echo "🔍 Branch protection check..."
echo "📍 Current branch: $CURRENT_BRANCH"

# Explicit safeguard: Block analyze-ios deployment on main
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "✅ Main branch confirmed - proceeding with analyze-plant deployment"
else
    echo "⚠️  Not on main branch ($CURRENT_BRANCH) - skipping deployment"
    exit 0
fi

echo "🚀 Starting main branch deployment..."

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

# CRITICAL: Explicitly block iOS function deployment on main branch
echo "🛡️  Enforcing main branch isolation - analyze-ios will NOT be deployed"

# Deploy only analyze-plant function
echo "📦 Deploying analyze-plant function to shared project..."
npx supabase functions deploy analyze-plant --project-ref inbfxduleyhygxatxmre

echo "✅ Main branch deployment complete!"
echo "🔒 analyze-plant deployed, analyze-ios blocked on main branch"