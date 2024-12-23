import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
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

interface AnalysisResultsProps {
  analysisResult: AnalysisResult;
}

const AnalysisResults = ({ analysisResult }: AnalysisResultsProps) => {
  return (
    <Card className="mb-8 p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-500" />
          <h3 className="text-xl font-semibold text-white">Analysis Complete</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Growth Stage</h4>
            <p className="text-gray-300">{analysisResult.detailed_analysis.growth_stage}</p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Health Score</h4>
            <p className="text-gray-300">{analysisResult.detailed_analysis.health_score}</p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Specific Issues</h4>
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                <p className="text-gray-300">{analysisResult.detailed_analysis.specific_issues}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Environmental Factors</h4>
            <p className="text-gray-300">{analysisResult.detailed_analysis.environmental_factors}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Confidence Level</h4>
            <Progress 
              value={analysisResult.confidence_level * 100} 
              className="h-2"
            />
            <p className="text-sm text-gray-400 mt-1">
              {Math.round(analysisResult.confidence_level * 100)}% confidence
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Recommended Actions</h4>
            <ul className="space-y-2">
              {analysisResult.recommended_actions.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalysisResults;