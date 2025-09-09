interface CanonicalAnalysisResult {
  summary: string;
  confidence: number;
  growthStage: string;
  healthScore: string;
  specificIssues: string[];
  environmentalFindings: string[];
  recommendedActions: string[];
}

export function normalizeAnalysisResult(raw: any): CanonicalAnalysisResult {
  // If already in canonical format with new field names, return as-is
  if (raw?.summary && raw?.confidence !== undefined && raw?.recommendedActions && raw?.growthStage) {
    return {
      summary: raw.summary,
      confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.7,
      growthStage: raw.growthStage || '',
      healthScore: raw.healthScore || '',
      specificIssues: Array.isArray(raw.specificIssues) ? raw.specificIssues : [],
      environmentalFindings: Array.isArray(raw.environmentalFindings) ? raw.environmentalFindings : [],
      recommendedActions: Array.isArray(raw.recommendedActions) ? raw.recommendedActions : []
    };
  }

  // Handle iOS-style keys (analysis, diagnosis, profileUsed, etc.)
  const summary = raw?.diagnosis || raw?.analysis?.summary || raw?.summary || 'Analysis completed';
  const confidence = typeof raw?.confidence === 'number' ? raw.confidence : 0.7;
  
  // Extract growth stage from various possible locations
  const growthStage = raw?.analysis?.growthStage || 
                     raw?.growthStage ||
                     raw?.detailed_analysis?.growth_stage ||
                     'Growth stage analysis completed';
  
  // Extract health score
  const healthScore = raw?.analysis?.healthScore ||
                     raw?.healthScore ||
                     raw?.detailed_analysis?.health_score ||
                     'Plant health assessed';
  
  // Extract specific issues - ensure it's always an array
  let specificIssues: string[] = [];
  if (Array.isArray(raw?.specificIssues)) {
    specificIssues = raw.specificIssues;
  } else if (Array.isArray(raw?.analysis?.issues)) {
    specificIssues = raw.analysis.issues;
  } else if (typeof raw?.analysis?.issues === 'string') {
    specificIssues = [raw.analysis.issues];
  } else if (typeof raw?.detailed_analysis?.specific_issues === 'string') {
    specificIssues = [raw.detailed_analysis.specific_issues];
  }
  
  // Extract environmental findings - ensure it's always an array
  let environmentalFindings: string[] = [];
  if (Array.isArray(raw?.environmentalFindings)) {
    environmentalFindings = raw.environmentalFindings;
  } else if (Array.isArray(raw?.analysis?.environmental)) {
    environmentalFindings = raw.analysis.environmental;
  } else if (typeof raw?.analysis?.environmental === 'string') {
    environmentalFindings = [raw.analysis.environmental];
  } else if (typeof raw?.detailed_analysis?.environmental_factors === 'string') {
    environmentalFindings = [raw.detailed_analysis.environmental_factors];
  }
  
  // Extract recommended actions - force array
  let recommendedActions: string[] = [];
  if (Array.isArray(raw?.recommendedActions)) {
    recommendedActions = raw.recommendedActions;
  } else if (Array.isArray(raw?.analysis?.actions)) {
    recommendedActions = raw.analysis.actions;
  } else if (Array.isArray(raw?.recommended_actions)) {
    recommendedActions = raw.recommended_actions;
  } else if (typeof raw?.analysis?.actions === 'string') {
    recommendedActions = [raw.analysis.actions];
  } else {
    recommendedActions = ['Continue monitoring your plant regularly'];
  }
  
  // Filter and ensure we have valid actions
  recommendedActions = recommendedActions
    .filter(action => action && typeof action === 'string' && action.trim().length > 0)
    .slice(0, 9);
  
  if (recommendedActions.length === 0) {
    recommendedActions = ['Continue monitoring your plant regularly'];
  }

  return {
    summary,
    confidence: Math.min(Math.max(confidence, 0), 1), // Ensure 0-1 range
    growthStage,
    healthScore,
    specificIssues,
    environmentalFindings,
    recommendedActions
  };
}