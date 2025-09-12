/**
 * Helper to get the plant analysis function name from environment variables
 * Web app always uses 'analyze-plant' for consistency
 */
export const getAnalyzePlantFunctionName = (): string => {
  // Web app should always use analyze-plant for production compatibility
  return 'analyze-plant';
};