
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
    <div className="w-full px-6">
      {/* Container matching header width with max-w-6xl */}
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="text-green-500 w-6 h-6" />
          <h2 className="text-2xl lg:text-3xl font-bold text-white">Analysis Complete</h2>
        </div>
        
        {/* Top row - 3 cards in a row, wider and shorter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {/* Growth Stage Card */}
          <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 h-32 min-w-[320px]">
            <div className="flex items-start gap-3 h-full">
              <Leaf className="text-green-500 w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Growth Stage</h3>
                <div className="h-20 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {analysisResult.detailed_analysis.growth_stage}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Health Score Card */}
          <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 h-32 min-w-[320px]">
            <div className="flex items-start gap-3 h-full">
              <Heart className="text-green-500 w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Health Score</h3>
                <div className="h-20 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {analysisResult.detailed_analysis.health_score}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Confidence Level Card */}
          <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 h-32 min-w-[320px]">
            <div className="flex items-start gap-3 h-full">
              <TrendingUp className="text-purple-500 w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Confidence Level</h3>
                <div className="space-y-2">
                  <Progress 
                    value={analysisResult.confidence_level * 100} 
                    className="h-2"
                  />
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {Math.round(analysisResult.confidence_level * 100)}% confidence
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Second row - Issues and Environmental cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Specific Issues Card - Wider */}
          <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 h-32 min-w-[320px]">
            <div className="flex items-start gap-3 h-full">
              <AlertCircle className="text-yellow-500 w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Specific Issues</h3>
                <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3 h-20 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {analysisResult.detailed_analysis.specific_issues}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Environmental Factors Card */}
          <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 h-32 min-w-[320px]">
            <div className="flex items-start gap-3 h-full">
              <Lightbulb className="text-blue-500 w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Environmental Factors</h3>
                <div className="h-20 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {analysisResult.detailed_analysis.environmental_factors}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom row - Full width Recommended Actions */}
        <Card className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="text-green-500 w-6 h-6 mt-1 flex-shrink-0" />
            <h3 className="text-lg font-bold text-white leading-tight">Recommended Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {analysisResult.recommended_actions.map((action: string, index: number) => {
              // Split action into title and description if it contains a colon
              const [title, ...descriptionParts] = action.split(':');
              const description = descriptionParts.join(':').trim();
              
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-800/40 rounded-lg border border-gray-700 hover:bg-gray-800/60 transition-all duration-200 h-24">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0 h-full">
                    {description ? (
                      <>
                        <h4 className="font-semibold text-white mb-1 leading-tight text-sm">{title}</h4>
                        <div className="h-12 overflow-y-auto">
                          <p className="text-gray-300 leading-relaxed text-xs">{description}</p>
                        </div>
                      </>
                    ) : (
                      <div className="h-16 overflow-y-auto">
                        <p className="text-gray-300 leading-relaxed text-sm">{action}</p>
                      </div>
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
