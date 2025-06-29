
/**
 * Feature flag utilities
 */

/**
 * Returns true only when BOTH conditions are met:
 * 1) VITE_IOS_PREVIEW === '1' 
 * 2) VITE_VERCEL_GIT_COMMIT_REF === 'ios-main'
 */
export const isIOSPreview = (): boolean => {
  const iosPreviewFlag = import.meta.env.VITE_IOS_PREVIEW;
  const gitCommitRef = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF;
  
  return iosPreviewFlag === '1' && gitCommitRef === 'ios-main';
};

/**
 * Generic feature flag checker
 * @param flagName - The name of the environment variable to check
 * @param expectedValue - The expected value (defaults to '1')
 */
export const isFeatureEnabled = (flagName: string, expectedValue: string = '1'): boolean => {
  const flagValue = import.meta.env[flagName];
  return flagValue === expectedValue;
};

/**
 * Development mode checker
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Production mode checker
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};
