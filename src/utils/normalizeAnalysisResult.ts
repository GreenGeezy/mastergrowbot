interface CanonicalAnalysisResult {
  diagnosis: string;
  confidence_level: number;
  detailed_analysis: {
    growth_stage: string;
    health_score: string;
    specific_issues: string;
    environmental_factors: string;
  };
  recommended_actions: string[];
}

export function normalizeAnalysisResult(raw: any): CanonicalAnalysisResult {
  // If already in canonical format, return as-is
  if (raw?.detailed_analysis && raw?.confidence_level !== undefined && raw?.recommended_actions) {
    return raw;
  }

  // Handle alternative formats
  const diagnosis = raw?.diagnosis || raw?.summary || raw?.analysis?.summary || 'Analysis completed';
  const confidenceLevel = raw?.confidence_level || raw?.confidence || raw?.analysis?.confidence || 0.7;
  
  // Extract growth stage from various possible locations
  const growthStage = raw?.detailed_analysis?.growth_stage || 
                     raw?.analysis?.growthStage || 
                     raw?.analysis?.growth_stage ||
                     raw?.growthStage ||
                     'Growth stage analysis completed';
  
  // Extract health score
  const healthScore = raw?.detailed_analysis?.health_score ||
                     raw?.analysis?.healthScore ||
                     raw?.analysis?.health_score ||
                     raw?.healthScore ||
                     'Plant health assessed';
  
  // Extract specific issues
  const specificIssues = raw?.detailed_analysis?.specific_issues ||
                        raw?.analysis?.issues ||
                        raw?.analysis?.specific_issues ||
                        raw?.issues ||
                        'No critical issues identified';
  
  // Extract environmental factors
  const environmentalFactors = raw?.detailed_analysis?.environmental_factors ||
                              raw?.analysis?.environmental ||
                              raw?.analysis?.environmental_factors ||
                              raw?.environmental ||
                              'Environmental conditions assessed';
  
  // Extract recommended actions
  let recommendedActions: string[] = [];
  
  if (Array.isArray(raw?.recommended_actions)) {
    recommendedActions = raw.recommended_actions;
  } else if (Array.isArray(raw?.analysis?.actions)) {
    recommendedActions = raw.analysis.actions;
  } else if (Array.isArray(raw?.actions)) {
    recommendedActions = raw.actions;
  } else if (typeof raw?.recommended_actions === 'string') {
    recommendedActions = [raw.recommended_actions];
  } else {
    recommendedActions = ['Continue monitoring your plant regularly'];
  }
  
  // Filter and ensure we have valid actions
  recommendedActions = recommendedActions
    .filter(action => action && typeof action === 'string' && action.trim().length > 5)
    .slice(0, 9);
  
  if (recommendedActions.length === 0) {
    recommendedActions = ['Continue monitoring your plant regularly'];
  }

  return {
    diagnosis,
    confidence_level: Math.min(Math.max(confidenceLevel, 0), 1), // Ensure 0-1 range
    detailed_analysis: {
      growth_stage: growthStage,
      health_score: healthScore,
      specific_issues: specificIssues,
      environmental_factors: environmentalFactors
    },
    recommended_actions: recommendedActions
  };
}