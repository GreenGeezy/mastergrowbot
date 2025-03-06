
/**
 * Utility functions for the analyze-plant Edge Function
 */

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Creates a structured error response
export function createErrorResponse(error: unknown): Response {
  console.error('Error in analyze-plant function:', error);
  
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
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Parses and structures analysis results
export function parseAnalysisResults(analysisText: string): any {
  // Extract sections
  const growthStage = extractSection(analysisText, "Growth Stage") || "Vegetative stage";
  const healthScore = extractSection(analysisText, "Health Score") || "Good";
  const specificIssues = extractSection(analysisText, "Specific Issues") || "No major issues detected";
  const environmentalFactors = extractSection(analysisText, "Environmental Factors") || "Appears to be in adequate growing conditions";
  const recommendedActions = extractRecommendations(analysisText) || ["Monitor plant regularly", "Continue with current care regimen"];

  // Construct analysis response
  return {
    diagnosis: analysisText,
    confidence_level: 0.95,
    detailed_analysis: {
      growth_stage: growthStage,
      health_score: healthScore,
      specific_issues: specificIssues,
      environmental_factors: environmentalFactors
    },
    recommended_actions: recommendedActions
  };
}
