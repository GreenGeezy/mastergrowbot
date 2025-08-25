
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Leaf, Heart, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface AnalysisResult {
  diagnosis: string;
  confidence_level: number;
  detailed_analysis?: {
    growth_stage?: string;
    health_score?: string;
    specific_issues?: string;
    environmental_factors?: string;
  };
  recommended_actions?: string[] | string;
}

interface AnalysisResultsProps {
  analysisResult: AnalysisResult;
}

const AnalysisResults = ({ analysisResult }: AnalysisResultsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Extract first sentences from Growth Stage and Health Score with safe defaults
  const getFirstSentence = (text: string | undefined) => {
    if (!text || typeof text !== 'string') return 'No information available';
    const match = text.match(/^[^.!?]*[.!?]/);
    return match ? match[0].trim() : text.split(' ').slice(0, 15).join(' ') + '...';
  };

  const getRemainingText = (text: string | undefined) => {
    if (!text || typeof text !== 'string') return '';
    const firstSentence = getFirstSentence(text);
    return text.substring(firstSentence.length).trim();
  };

  // Safe access to detailed_analysis properties with defaults
  const detailedAnalysis = analysisResult.detailed_analysis || {};
  const growthStage = detailedAnalysis.growth_stage || 'Growth stage information not available';
  const healthScore = detailedAnalysis.health_score || 'Health score information not available';
  const specificIssues = detailedAnalysis.specific_issues || 'No specific issues identified';
  const environmentalFactors = detailedAnalysis.environmental_factors || 'Environmental factors not analyzed';

  const growthStageFirstSentence = getFirstSentence(growthStage);
  const growthStageRemainingText = getRemainingText(growthStage);
  
  const healthScoreFirstSentence = getFirstSentence(healthScore);
  const healthScoreRemainingText = getRemainingText(healthScore);

  // Filter out empty or very short actions and limit to 9 with safe array access
  const actions = analysisResult.recommended_actions;
  let validActions: string[] = [];
  
  if (Array.isArray(actions)) {
    validActions = actions
      .filter(action => action && typeof action === 'string' && action.trim().length > 5)
      .slice(0, 9); // Limit to maximum 9 actions
  } else if (typeof actions === 'string' && actions.trim().length > 5) {
    // Handle case where recommended_actions is a single string
    validActions = [actions.trim()];
  }
  
  // Ensure we always have at least one action
  if (validActions.length === 0) {
    validActions = ['Continue monitoring your plant regularly'];
  }

  // Find the most detailed recommended action (longest text)
  const mostDetailedAction = validActions.reduce((longest, current) => {
    return current.length > longest.length ? current : longest;
  }, '');

  return (
    <div className="w-full px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header with modern styling */}
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <CheckCircle className="text-green-500 w-8 h-8" />
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur animate-pulse"></div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Analysis Complete
          </h2>
        </motion.div>

        {/* Confidence Level and Summary Section */}
        <motion.div 
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Confidence Level */}
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-300">Confidence:</span>
            <div className="flex items-center gap-3">
              <Progress 
                value={analysisResult.confidence_level * 100} 
                className="h-3 bg-gray-700 w-32"
              />
              <span className="text-2xl font-bold text-purple-400">
                {Math.round(analysisResult.confidence_level * 100)}%
              </span>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4">Analysis Summary</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Leaf className="text-green-400 w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-gray-300 leading-relaxed">{growthStageFirstSentence}</p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-blue-400 w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-gray-300 leading-relaxed">{healthScoreFirstSentence}</p>
              </div>
              {mostDetailedAction && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 w-5 h-5 mt-1 flex-shrink-0" />
                  <p className="text-gray-300 leading-relaxed">{mostDetailedAction}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Analysis Grid */}
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Growth Stage and Health Score Cards */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={cardVariants}
          >
            {/* Growth Stage Card */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
                    <Leaf className="text-green-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Growth Stage</h3>
                </div>
                {growthStageRemainingText && (
                  <p className="text-gray-300 leading-relaxed">
                    {growthStageRemainingText}
                  </p>
                )}
              </div>
            </Card>

            {/* Health Score Card */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                    <Heart className="text-blue-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Health Score</h3>
                </div>
                {healthScoreRemainingText && (
                  <p className="text-gray-300 leading-relaxed">
                    {healthScoreRemainingText}
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Issues and Environmental Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={cardVariants}
          >
            {/* Specific Issues Card */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-yellow-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-sm">
                    <AlertCircle className="text-yellow-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Specific Issues</h3>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-gray-300 leading-relaxed">
                    {specificIssues}
                  </p>
                </div>
              </div>
            </Card>

            {/* Environmental Factors Card */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-cyan-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-500/20 rounded-lg backdrop-blur-sm">
                    <Lightbulb className="text-cyan-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Environmental</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {environmentalFactors}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Recommended Actions - Updated to 3 cards per row and max 9 cards */}
          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-emerald-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-emerald-500/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="text-emerald-400 w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Recommended Actions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validActions.map((action: string, index: number) => {
                    const [title, ...descriptionParts] = action.split(':');
                    const description = descriptionParts.join(':').trim();
                    
                    return (
                      <motion.div 
                        key={index} 
                        className="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-700/80 rounded-lg p-5 border border-gray-600/40 hover:border-emerald-500/60 transition-all duration-300 backdrop-blur-sm min-h-[160px] flex flex-col"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex-1 flex flex-col">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="mt-0.5 p-2 bg-emerald-500/20 rounded-md backdrop-blur-sm flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {description ? (
                                <h4 className="font-semibold text-white text-sm mb-3 leading-tight">{title}</h4>
                              ) : (
                                <h4 className="font-semibold text-white text-sm leading-tight">{action}</h4>
                              )}
                            </div>
                          </div>
                          {description && (
                            <div className="flex-1">
                              <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisResults;
