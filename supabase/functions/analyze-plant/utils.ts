
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
    // Handle markdown formatting like "**Growth Stage & Development:**"
    const cleanTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // More robust pattern to capture multi-line content including bullet points
    const patterns = [
      // Pattern for markdown headers like "**Growth Stage & Development:**"
      new RegExp(`\\*\\*${cleanTitle}[^*]*\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`, 'i'),
      // Pattern for regular headers like "Growth Stage:"
      new RegExp(`${cleanTitle}\\s*:?\\s*([\\s\\S]*?)(?=\\n\\w+[\\s&]*:|\n\n|$)`, 'i'),
      // Fallback pattern for partial matches
      new RegExp(`${cleanTitle}[^\\n]*\\n([\\s\\S]*?)(?=\\n[A-Z]|$)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim()) {
        return match[1].trim();
      }
    }
    
    return '';
  } catch (e) {
    console.error(`Error extracting ${sectionTitle}:`, e);
    return '';
  }
}

// Helper function to extract recommended actions as an array
export function extractRecommendations(text: string): string[] {
  try {
    // Try multiple section titles for recommendations
    const sectionTitles = ["Actionable Recommendations", "Recommended Actions", "Recommendations"];
    let recommendationsSection = '';
    
    for (const title of sectionTitles) {
      recommendationsSection = extractSection(text, title);
      if (recommendationsSection) break;
    }
    
    if (!recommendationsSection) {
      return [];
    }
    
    // Split by bullet points and lines, handle various formats
    const recommendations = recommendationsSection
      .split(/[\n•\-*\d+\.]+/)
      .map(line => line.trim())
      .filter(line => line.length > 10) // Filter out very short lines
      .slice(0, 10); // Limit to reasonable number
    
    return recommendations.length > 0 ? recommendations : [];
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
  console.log('Raw analysis text:', analysisText.substring(0, 500) + '...');
  
  // Extract sections with multiple fallback titles
  const growthStage = extractSection(analysisText, "Growth Stage & Development") || 
                     extractSection(analysisText, "Growth Stage") || 
                     extractSection(analysisText, "Growth") || 
                     "Growth stage information not available";
                     
  const healthScore = extractSection(analysisText, "Health Assessment") || 
                     extractSection(analysisText, "Health Score") || 
                     extractSection(analysisText, "Overall Health") ||
                     "Health assessment not available";
                     
  const specificIssues = extractSection(analysisText, "Issue Identification") || 
                        extractSection(analysisText, "Specific Issues") || 
                        extractSection(analysisText, "Issues") || 
                        extractSection(analysisText, "Problems") || 
                        "No specific issues identified";
                        
  const environmentalFactors = extractSection(analysisText, "Environmental Analysis") || 
                              extractSection(analysisText, "Environmental Factors") || 
                              extractSection(analysisText, "Environmental") || 
                              "Environmental analysis not available";
                              
  const recommendedActions = extractRecommendations(analysisText);
  
  // Log extracted sections for debugging
  console.log('Extracted sections:', {
    growthStage: growthStage.substring(0, 100),
    healthScore: healthScore.substring(0, 100),
    specificIssues: specificIssues.substring(0, 100),
    environmentalFactors: environmentalFactors.substring(0, 100),
    recommendedActionsCount: recommendedActions.length
  });
  
  // Ensure we always have an array of recommendations with meaningful defaults
  let finalRecommendations: string[] = [];
  if (Array.isArray(recommendedActions) && recommendedActions.length > 0) {
    finalRecommendations = recommendedActions.filter(action => 
      action && typeof action === 'string' && action.trim().length > 10
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
  const result = {
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
  
  console.log('Parsed analysis result:', result);
  return result;
}
