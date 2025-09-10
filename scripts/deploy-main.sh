#!/bin/bash

# Master Growbot Main Branch Deployment Script
# This script deploys only the analyze-plant function for the main branch

set -e  # Exit on any error

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

# Deploy analyze-plant function only (main branch should NOT deploy analyze-ios)
echo "📦 Deploying analyze-plant function only..."
npx supabase functions deploy analyze-plant --project-ref inbfxduleyhygxatxmre

echo "✅ Main deployment complete - analyze-plant deployed, analyze-ios excluded"