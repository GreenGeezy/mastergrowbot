
# Deployment Guide for Master Growbot

This guide provides step-by-step instructions for deploying the paid-version branch to www.mastergrowbot.com through Vercel.

## GitHub: Creating and Merging a Pull Request

1. Go to https://github.com/GreenGeezy/mastergrowbot
2. Click on the green "New pull request" button (visible in the Pull requests tab)
3. For the "base:" dropdown, select "main" (this is the branch you want to merge INTO)
4. For the "compare:" dropdown, select "paid-version" (this is the branch WITH your changes)
5. GitHub will show you the differences between branches. Click the green "Create pull request" button
6. Add a title like "Merge paid-version to main for deployment"
7. Add an optional description if needed
8. Click "Create pull request" button again
9. On the next screen, if there are no conflicts, click the green "Merge pull request" button
10. Click "Confirm merge"
11. You should see a confirmation that the branches were successfully merged

## Vercel: Monitoring Deployment

1. Go to https://vercel.com/greengeezys-projects/mastergrowbot/deployments
2. A new deployment should automatically start after the GitHub merge (may take 1-2 minutes to appear)
3. The new deployment will show "Building" status initially
4. Wait until status changes to "Ready" (with a green dot)
5. Click on the deployment to verify details if needed

## Verifying Your Changes

1. Visit www.mastergrowbot.com in a private/incognito browser window
2. Verify that your changes from the paid-version branch are now live
3. Test all functionality to ensure everything works as expected

## If Deployment Doesn't Start Automatically

1. On Vercel dashboard, click on "mastergrowbot" project
2. Click "Deployments" in the top navigation
3. Click the "..." menu button at the top-right
4. Select "Redeploy" and confirm

## If Changes Aren't Visible After Deployment

1. Clear your browser cache or use an incognito window
2. Verify the deployment status is "Ready" in Vercel dashboard
3. Wait 5-10 minutes for CDN propagation

Remember: According to your vercel.json configuration, only changes to the main branch trigger production deployments. This is why we need to merge paid-version into main.
