# iOS Branch Separate Supabase Project Setup

This guide will help you create a separate Supabase project for the `ios-main` branch as a fallback solution for deployment issues.

## Step 1: Create New Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name it something like "mastergrowbot-ios" 
4. Choose the same region as your current project
5. Set a secure database password
6. Wait for project creation to complete

## Step 2: Get New Project Credentials

After creation, navigate to Settings > API and note:
- Project URL: `https://[your-new-project-ref].supabase.co`
- Anon Key: `eyJ...` (starts with eyJ)
- Service Role Key: `eyJ...` (longer, starts with eyJ)

## Step 3: Run Schema Migration

Copy and run the SQL script from `schema-export.sql` in your new project's SQL Editor.

## Step 4: Configure Secrets

Add these secrets to your new Supabase project:
- `OPENAI_API_KEY` - Same as current project
- `OPENAI_ASSISTANT_ID` - Same as current project  
- `SUPABASE_URL` - Your new project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your new project service role key
- `SUPABASE_ANON_KEY` - Your new project anon key

## Step 5: Update Environment Files

Replace the content in `.env.ios` with your new project credentials.

## Step 6: Deploy Functions

The deployment scripts will automatically deploy only `analyze-ios` to the new project when on `ios-main` branch.

## Verification Steps

1. Test the `analyze-ios` function works on new project
2. Verify main branch still uses original project
3. Confirm branch-specific deployments work correctly