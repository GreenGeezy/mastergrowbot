# Deployment Guide

## Branch-Specific Function Deployment

This repository uses a branch-specific deployment strategy for Supabase Edge Functions:

### Main Branch (`main`)
- **Purpose**: Production web application
- **Functions Deployed**: `analyze-plant` and all other functions
- **Target Users**: Web application users
- **Deployment Command**: `./scripts/deploy-main.sh`

### iOS Branch (`ios-main`) 
- **Purpose**: iOS application via Capacitor
- **Functions Deployed**: `analyze-ios` only (analyze-plant excluded)
- **Target Users**: iOS mobile app users
- **Deployment Command**: `./scripts/deploy-ios.sh`

## Function Differences

| Function | Branch | Purpose | Schema |
|----------|--------|---------|--------|
| `analyze-plant` | main | Web app plant analysis | Original format |
| `analyze-ios` | ios-main | iOS app plant analysis | Normalized to match AnalysisResults.tsx |

## Manual Deployment

### For Main Branch:
```bash
# Switch to main branch
git checkout main

# Deploy all functions including analyze-plant
./scripts/deploy-main.sh
```

### For iOS Branch:
```bash
# Switch to ios-main branch  
git checkout ios-main

# Deploy only analyze-ios (analyze-plant excluded)
./scripts/deploy-ios.sh
```

## Important Notes

1. **Never deploy analyze-plant from ios-main** - It will overwrite the web-optimized version
2. **Never deploy analyze-ios from main** - It may not be present or up-to-date
3. Both functions use the same OpenAI backend but normalize responses differently
4. The `.funcignore` file is used temporarily during ios-main deployments to exclude analyze-plant

## Troubleshooting

If functions are accidentally cross-deployed:
1. Switch to the correct branch
2. Run the appropriate deployment script
3. Verify function endpoints are working as expected

## Function URLs

- **analyze-plant**: `https://inbfxduleyhygxatxmre.supabase.co/functions/v1/analyze-plant`
- **analyze-ios**: `https://inbfxduleyhygxatxmre.supabase.co/functions/v1/analyze-ios`