export interface CanonicalAnalysisResult {
  confidence: number;
  summary: string;
  growthStage: string;
  healthScore: number | null;
  specificIssues: string[];
  environmentalFindings: string[];
  recommendedActions: string[];
}

export function normalizeAnalysisResult(raw: any): CanonicalAnalysisResult {
  // If already in canonical format, return as-is
  if (raw?.confidence !== undefined && raw?.summary && raw?.growthStage !== undefined && 
      Array.isArray(raw?.specificIssues) && Array.isArray(raw?.environmentalFindings) && 
      Array.isArray(raw?.recommendedActions)) {
    return {
      confidence: typeof raw.confidence === 'number' ? Math.min(Math.max(raw.confidence, 0), 1) : 0.7,
      summary: raw.summary || '',
      growthStage: raw.growthStage || '',
      healthScore: typeof raw.healthScore === 'number' ? raw.healthScore : null,
      specificIssues: raw.specificIssues || [],
      environmentalFindings: raw.environmentalFindings || [],
      recommendedActions: raw.recommendedActions || []
    };
  }

  // Map from various formats to canonical format
  const summary = raw?.diagnosis || raw?.analysis?.summary || raw?.summary || '';
  
  // Handle confidence - ensure 0-1 range
  let confidence = 0.7;
  if (typeof raw?.confidence === 'number') {
    confidence = Math.min(Math.max(raw.confidence, 0), 1);
  } else if (typeof raw?.confidence_level === 'number') {
    confidence = Math.min(Math.max(raw.confidence_level, 0), 1);
  }
  
  // Extract growth stage
  const growthStage = raw?.detailed_analysis?.growth_stage || 
                     raw?.growthStage || 
                     raw?.analysis?.growthStage || '';
  
  // Extract health score
  const healthScore = typeof raw?.detailed_analysis?.health_score === 'number' ? raw.detailed_analysis.health_score :
                     typeof raw?.healthScore === 'number' ? raw.healthScore : null;
  
  // Force specificIssues to array
  const specificIssues = (() => {
    const issues = raw?.detailed_analysis?.specific_issues || raw?.specificIssues || raw?.analysis?.issues;
    if (Array.isArray(issues)) return issues.filter(i => typeof i === 'string');
    if (typeof issues === 'string') return [issues];
    return [];
  })();
  
  // Force environmentalFindings to array
  const environmentalFindings = (() => {
    const env = raw?.detailed_analysis?.environmental_factors || raw?.environmentalFindings || raw?.analysis?.environmental;
    if (Array.isArray(env)) return env.filter(e => typeof e === 'string');
    if (typeof env === 'string') return [env];
    return [];
  })();
  
  // Force recommendedActions to array
  const recommendedActions = (() => {
    const actions = raw?.recommended_actions || raw?.recommendedActions || raw?.analysis?.actions;
    if (Array.isArray(actions)) return actions.filter(a => typeof a === 'string');
    if (typeof actions === 'string') return [actions];
    return [];
  })();

  return {
    confidence,
    summary,
    growthStage,
    healthScore,
    specificIssues,
    environmentalFindings,
    recommendedActions
  };
}