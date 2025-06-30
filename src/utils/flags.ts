
// src/utils/flags.ts
export const isIOSPreview =
  import.meta.env.VITE_IOS_PREVIEW === '1' ||
  window.location.hostname.includes('mastergrowbot-git-ios-main');

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
