#!/bin/bash

# Deployment script for main branch
# This script deploys all functions to the original project

echo "🚀 Main Branch Deployment - all functions to original project"

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

# Deploy all functions to the original project
echo "📦 Deploying all functions to original project: inbfxduleyhygxatxmre..."
npx supabase functions deploy --project-ref inbfxduleyhygxatxmre --no-verify-jwt=false

echo "✅ Main deployment complete - all functions deployed to original project"