/**
 * Helper to get the plant analysis function name from environment variables
 * Defaults to 'analyze-ios' if not configured
 */
export const getAnalyzePlantFunctionName = (): string => {
  // Check for Next.js style env var first, then fallback to default
  return import.meta.env.NEXT_PUBLIC_ANALYZE_FN || 'analyze-ios';
};