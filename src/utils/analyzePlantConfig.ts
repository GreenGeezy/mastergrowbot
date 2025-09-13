/**
 * Helper to get the plant analysis function name from environment variables
 * Supports Vite-style environment variables with fallback to analyze-plant
 */
export const getAnalyzePlantFunctionName = (): string => {
  // Check for Vite-style environment variable first
  const envFunctionName = import.meta.env.VITE_ANALYZE_FN;
  
  // Default to analyze-plant for consistency across branches
  return envFunctionName || 'analyze-plant';
};