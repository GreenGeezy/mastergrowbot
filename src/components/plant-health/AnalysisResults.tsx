
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Leaf, Heart, Lightbulb, TrendingUp } from 'lucide-react';
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
    <div className="mb-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="text-green-500 w-6 h-6" />
        <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Stage Card */}
        <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <Leaf className="text-green-500 w-6 h-6 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">Growth Stage</h3>
              <p className="text-gray-300 leading-relaxed">
                {analysisResult.detailed_analysis.growth_stage}
              </p>
            </div>
          </div>
        </Card>

        {/* Health Score Card */}
        <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <Heart className="text-green-500 w-6 h-6 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">Health Score</h3>
              <p className="text-gray-300 leading-relaxed">
                {analysisResult.detailed_analysis.health_score}
              </p>
            </div>
          </div>
        </Card>

        {/* Specific Issues Card */}
        <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-500 w-6 h-6 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">Specific Issues</h3>
              <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed">
                  {analysisResult.detailed_analysis.specific_issues}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Environmental Factors Card */}
        <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-blue-500 w-6 h-6 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">Environmental Factors</h3>
              <p className="text-gray-300 leading-relaxed">
                {analysisResult.detailed_analysis.environmental_factors}
              </p>
            </div>
          </div>
        </Card>

        {/* Confidence Level Card */}
        <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <TrendingUp className="text-purple-500 w-6 h-6 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">Confidence Level</h3>
              <div className="space-y-3">
                <Progress 
                  value={analysisResult.confidence_level * 100} 
                  className="h-3"
                />
                <p className="text-gray-300 leading-relaxed">
                  Based on the analysis, I am {Math.round(analysisResult.confidence_level * 100)}% confident in the assessment.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommended Actions Card - Full Width */}
        <Card className="lg:col-span-2 p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="text-green-500 w-6 h-6 mt-1" />
            <h3 className="text-xl font-bold text-white leading-relaxed">Recommended Actions</h3>
          </div>
          
          <div className="space-y-4">
            {analysisResult.recommended_actions.map((action: string, index: number) => {
              // Split action into title and description if it contains a colon
              const [title, ...descriptionParts] = action.split(':');
              const description = descriptionParts.join(':').trim();
              
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-800/40 rounded-lg border border-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    {description ? (
                      <>
                        <h4 className="font-semibold text-white mb-2 leading-relaxed">{title}</h4>
                        <p className="text-gray-300 leading-relaxed">{description}</p>
                      </>
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{action}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisResults;
