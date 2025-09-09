#!/bin/bash

# Deployment script for main branch
# This script ensures analyze-plant function is deployed

echo "🚀 Main Branch Deployment - analyze-plant"

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: This script is intended for main branch, currently on: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Ensure no ignore file exists (deploy all functions)
rm -f supabase/.funcignore

# Deploy functions
echo "📦 Deploying all functions including analyze-plant..."
npx supabase functions deploy --no-verify-jwt=false

echo "✅ Main deployment complete - analyze-plant and other functions deployed"