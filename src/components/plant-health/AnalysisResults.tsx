
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mt-4 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="text-green-500 w-6 h-6 sm:w-7 sm:h-7" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Analysis Complete</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Growth Stage Card */}
        <Card className="p-6 sm:p-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200">
          <div className="flex items-start gap-3">
            <Leaf className="text-green-500 w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">Growth Stage</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {analysisResult.detailed_analysis.growth_stage}
              </p>
            </div>
          </div>
        </Card>

        {/* Health Score Card */}
        <Card className="p-6 sm:p-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200">
          <div className="flex items-start gap-3">
            <Heart className="text-green-500 w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">Health Score</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {analysisResult.detailed_analysis.health_score}
              </p>
            </div>
          </div>
        </Card>

        {/* Confidence Level Card */}
        <Card className="p-6 sm:p-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 lg:col-span-2 xl:col-span-1">
          <div className="flex items-start gap-3">
            <TrendingUp className="text-purple-500 w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">Confidence Level</h3>
              <div className="space-y-3">
                <Progress 
                  value={analysisResult.confidence_level * 100} 
                  className="h-3 sm:h-4"
                />
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {Math.round(analysisResult.confidence_level * 100)}% confidence in this assessment
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Specific Issues Card - Full Width on Mobile, Half Width on Large Screens */}
        <Card className="p-6 sm:p-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 lg:col-span-1 xl:col-span-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-500 w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">Specific Issues</h3>
              <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 sm:p-6">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {analysisResult.detailed_analysis.specific_issues}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Environmental Factors Card - Full Width on Mobile, Half Width on Large Screens */}
        <Card className="p-6 sm:p-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 lg:col-span-1 xl:col-span-1">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">Environmental Factors</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {analysisResult.detailed_analysis.environmental_factors}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended Actions Card - Always Full Width */}
      <Card className="p-6 sm:p-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900/70 transition-all duration-200 mt-6">
        <div className="flex items-start gap-3 mb-6">
          <CheckCircle className="text-green-500 w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0" />
          <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">Recommended Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {analysisResult.recommended_actions.map((action: string, index: number) => {
            // Split action into title and description if it contains a colon
            const [title, ...descriptionParts] = action.split(':');
            const description = descriptionParts.join(':').trim();
            
            return (
              <div key={index} className="flex items-start gap-3 p-4 sm:p-6 bg-gray-800/40 rounded-lg border border-gray-700 hover:bg-gray-800/60 transition-all duration-200">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {description ? (
                    <>
                      <h4 className="font-semibold text-white mb-3 leading-tight text-sm sm:text-base">{title}</h4>
                      <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
                    </>
                  ) : (
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{action}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AnalysisResults;
