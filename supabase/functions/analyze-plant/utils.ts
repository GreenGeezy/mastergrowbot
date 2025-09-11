
/**
 * Utility functions for the analyze-plant Edge Function
 */

// Allowed origins for CORS validation
export const allowedOrigins = [
  'https://www.mastergrowbot.com',
  'https://mastergrowbot-git-ios-main-*.vercel.app',
  'capacitor://localhost'
];

// Base CORS headers (origin will be set dynamically)
export const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Helper function to check if origin matches allowed patterns
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  return allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      // Handle wildcard patterns like 'https://mastergrowbot-git-ios-main-*.vercel.app'
      const pattern = allowed.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(origin);
    }
    return allowed === origin;
  });
}

// Create CORS headers with validated origin
export function createCorsHeaders(origin: string | null): Record<string, string> {
  const headers = { ...corsHeaders };
  
  if (isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin!;
  }
  
  return headers;
}

// Helper function to extract sections from the analysis text
export function extractSection(text: string, sectionTitle: string): string {
  try {
    const pattern = new RegExp(`${sectionTitle}\\s*:?\\s*([^\\n]*(\\n(?!\\w+\\s*:)[^\\n]*)*)`, 'i');
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  } catch (e) {
    console.error(`Error extracting ${sectionTitle}:`, e);
    return '';
  }
}

// Helper function to extract recommended actions as an array
export function extractRecommendations(text: string): string[] {
  try {
    const recommendationsSection = extractSection(text, "Recommended Actions");
    
    if (!recommendationsSection) {
      return [];
    }
    
    // Split by lines and bullet points
    return recommendationsSection
      .split(/[\n•\-*]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  } catch (e) {
    console.error('Error extracting recommendations:', e);
    return [];
  }
}

// Creates a structured error response with proper CORS headers
export function createErrorResponse(error: unknown, origin: string | null = null): Response {
  console.error('Error in analyze-plant function:', error);
  
  const headers = createCorsHeaders(origin);
  headers['Content-Type'] = 'application/json';
  
  return new Response(
    JSON.stringify({
      analysis: {
        diagnosis: error instanceof Error ? error.message : 'An error occurred during analysis',
        confidence_level: 0,
        detailed_analysis: {
          growth_stage: 'Analysis failed',
          health_score: 'Unable to determine',
          specific_issues: error instanceof Error ? error.message : 'Error during analysis',
          environmental_factors: 'Unable to determine'
        },
        recommended_actions: ['Please try again with a clearer image']
      }
    }),
    { headers }
  );
}

// Parses and structures analysis results to match AnalysisResults.tsx interface
export function parseAnalysisResults(analysisText: string): any {
  // Extract sections with better fallbacks
  const growthStage = extractSection(analysisText, "Growth Stage") || 
                     extractSection(analysisText, "Growth") || 
                     "Growth stage information not available";
                     
  const healthScore = extractSection(analysisText, "Health Score") || 
                     extractSection(analysisText, "Health") || 
                     "Health score information not available";
                     
  const specificIssues = extractSection(analysisText, "Specific Issues") || 
                        extractSection(analysisText, "Issues") || 
                        extractSection(analysisText, "Problems") || 
                        "No specific issues identified";
                        
  const environmentalFactors = extractSection(analysisText, "Environmental Factors") || 
                              extractSection(analysisText, "Environmental") || 
                              extractSection(analysisText, "Environment") || 
                              "Environmental factors not analyzed";
                              
  const recommendedActions = extractRecommendations(analysisText);
  
  // Ensure we always have an array of recommendations with meaningful defaults
  let finalRecommendations: string[] = [];
  if (Array.isArray(recommendedActions) && recommendedActions.length > 0) {
    finalRecommendations = recommendedActions.filter(action => 
      action && typeof action === 'string' && action.trim().length > 0
    );
  }
  
  // Provide meaningful default actions if none extracted
  if (finalRecommendations.length === 0) {
    finalRecommendations = [
      "Monitor plant regularly for any changes",
      "Maintain consistent watering schedule", 
      "Ensure adequate lighting conditions"
    ];
  }

  // Construct analysis response matching AnalysisResults.tsx interface exactly
  return {
    diagnosis: analysisText || "Analysis completed successfully",
    confidence_level: 0.95, // Convert to 0-1 decimal as expected by Progress component
    detailed_analysis: {
      growth_stage: growthStage,
      health_score: healthScore,
      specific_issues: specificIssues,
      environmental_factors: environmentalFactors
    },
    recommended_actions: finalRecommendations
  };
}
