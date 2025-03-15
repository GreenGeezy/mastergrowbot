
# Deployment Guide for Master Growbot

This guide provides step-by-step instructions for deploying changes to www.mastergrowbot.com.

## Prerequisites

- Git installed on your local machine
- Access to the Master Growbot GitHub repository
- Access to the Vercel deployment dashboard

## Deployment Process

### Step 1: Ensure Your Local Environment Is Up-to-Date

```bash
# Navigate to your project directory
cd path/to/mastergrowbot

# Make sure you have the latest changes from the remote repository
git fetch --all
```

### Step 2: Checkout the Main Branch

```bash
# Switch to the main branch
git checkout main

# Pull the latest changes from the remote main branch
git pull origin main
```

### Step 3: Merge Your Changes to Main

If you're working on a feature branch (e.g., paid-version):

```bash
# If you're currently on your feature branch
git checkout main

# Merge your feature branch into main
git merge your-feature-branch

# Resolve any merge conflicts if they occur
# After resolving conflicts:
git add .
git commit -m "Resolved merge conflicts"
```

### Step 4: Push Changes to GitHub

```bash
# Push the updated main branch to GitHub
git push origin main
```

### Step 5: Verify Deployment on Vercel

1. Go to your Vercel dashboard: https://vercel.com/greengeezys-projects/mastergrowbot
2. Navigate to the "Deployments" tab
3. You should see a new deployment in progress for the main branch
4. Wait for the deployment to complete (Status: "Ready")

### Step 6: Verify Your Changes on the Production Site

1. Visit www.mastergrowbot.com
2. Verify that your changes are now live
3. Test the functionality to ensure everything is working as expected

## Troubleshooting

### If the Deployment Fails:

1. Check the Vercel deployment logs for errors
2. Make necessary corrections locally
3. Commit and push the fixes to main
4. Monitor the new deployment

### If Changes Are Not Reflected:

1. Clear your browser cache
2. Verify you're looking at the production deployment, not the preview
3. Check the Vercel dashboard to confirm the latest deployment is active

## Notes

- According to your Vercel configuration (`vercel.json`), only pushes to the main branch trigger production deployments
- The deployment URL should be www.mastergrowbot.com
- Always test your changes locally before deploying to production

For any issues or questions, refer to the Vercel documentation or contact your development team.
