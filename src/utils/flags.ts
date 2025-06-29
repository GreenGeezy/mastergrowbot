
/**
 * Feature flag utilities
 */

/**
 * Returns true only when running in iOS preview mode
 * Checks for VITE_IOS_PREVIEW='1' environment variable
 * Note: In a real iOS context, you might also check for commit ref 'ios-main'
 * but in Vite/browser context we rely on the environment variable set during build
 */
export const isIOSPreview = (): boolean => {
  const iosPreviewFlag = import.meta.env.VITE_IOS_PREVIEW;
  return iosPreviewFlag === '1';
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
