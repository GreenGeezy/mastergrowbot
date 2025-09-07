import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Leaf, Heart, History, Share2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import ShareResults from './ShareResults';
import { useSession } from '@supabase/auth-helpers-react';
import AnalysisHistory from './AnalysisHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface MobileAnalysisResultsProps {
  analysisResult: AnalysisResult;
  analysisId?: string;
  imageUrls?: string[];
}

const MobileAnalysisResults = ({ analysisResult, analysisId = '', imageUrls = [] }: MobileAnalysisResultsProps) => {
  const session = useSession();

  // Extract meaningful content from analysis sections
  const getGrowthStageSummary = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('A.') && !line.includes('Growth Stages') && line.length < 50) {
        return line;
      }
    }
    return "Vegetative";
  };

  const getHealthScoreSummary = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('B.') && !line.includes('Plant Health') && line.length < 50) {
        return line;
      }
    }
    return "Happy and Healthy";
  };

  const extractIPMContent = (text: string) => {
    // Look for IPM or pest management content in the analysis
    const sections = text.split('\n\n');
    for (const section of sections) {
      if (section.toLowerCase().includes('pest') || section.toLowerCase().includes('ipm') || 
          section.toLowerCase().includes('inspection') || section.toLowerCase().includes('preventive')) {
        return section.trim();
      }
    }
    return "Weekly inspections with magnifying glass, especially leaf undersides. Maintain beneficial insect populations with predatory mites, ladybugs, or lacewings.";
  };

  const extractGrowthTrainingContent = (text: string) => {
    // Look for growth training or canopy management content
    const sections = text.split('\n\n');
    for (const section of sections) {
      if (section.toLowerCase().includes('training') || section.toLowerCase().includes('canopy') || 
          section.toLowerCase().includes('lst') || section.toLowerCase().includes('scrog') ||
          section.toLowerCase().includes('pruning') || section.toLowerCase().includes('topping')) {
        return section.trim();
      }
    }
    return "Implement LST (Low Stress Training) or SCROG (Screen of Green) techniques to maximize light exposure. Prune lower branches that don't receive adequate light.";
  };

  const growthStage = getGrowthStageSummary(analysisResult.detailed_analysis.growth_stage);
  const healthStatus = getHealthScoreSummary(analysisResult.detailed_analysis.health_score);
  const ipmContent = extractIPMContent(analysisResult.detailed_analysis.specific_issues + ' ' + analysisResult.recommended_actions.join(' '));
  const growthTrainingContent = extractGrowthTrainingContent(analysisResult.detailed_analysis.environmental_factors + ' ' + analysisResult.recommended_actions.join(' '));

  const [showHistory, setShowHistory] = useState(false);

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4">
        <motion.div 
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <CheckCircle className="text-primary w-8 h-8" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#33C3F0] bg-clip-text text-transparent">
            Analysis Complete
          </h1>
        </motion.div>

        {/* Confidence Level */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-base text-gray-600">Confidence:</span>
          <div className="flex items-center gap-3 flex-1">
            <Progress 
              value={analysisResult.confidence_level * 100} 
              className="h-3 bg-gray-200 flex-1"
            />
            <span className="text-xl font-bold text-[#8B5CF6]">
              {Math.round(analysisResult.confidence_level * 100)}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Hero Card with Analysis Summary */}
      <div className="flex-1 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full max-h-[80vh]"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg h-full">
            <CardContent className="p-6 h-full overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Analysis Summary</h2>
              
              <div className="space-y-6">
                {/* Vegetative Stage Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Leaf className="text-green-600 w-5 h-5" />
                    <h3 className="font-bold text-gray-900">{growthStage}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed ml-8">
                    The plant is in the {growthStage.toLowerCase()} stage.
                  </p>
                </div>

                <Separator className="bg-green-300 h-[1px]" />

                {/* Happy and Healthy Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="text-blue-600 w-5 h-5" />
                    <h3 className="font-bold text-gray-900">{healthStatus}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed ml-8">
                    The plant appears to be in good condition overall.
                  </p>
                </div>

                <Separator className="bg-green-300 h-[1px]" />

                {/* IPM Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-emerald-600 w-5 h-5" />
                    <h3 className="font-bold text-gray-900">Integrated Pest Management (IPM)</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed ml-8">
                    <strong>Preventive Pest Control:</strong> {ipmContent}
                  </p>
                </div>

                <Separator className="bg-green-300 h-[1px]" />

                {/* Growth Training Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-orange-600 w-5 h-5 flex items-center justify-center text-lg">🌱</div>
                    <h3 className="font-bold text-gray-900">Growth Training and Optimization</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed ml-8">
                    <strong>Canopy Management:</strong> {growthTrainingContent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-4">
          {/* Share Results Button */}
          <div className="flex-1">
            <ShareResults analysisId={analysisId} imageUrls={imageUrls} />
          </div>

          {/* Analysis History Button */}
          <div
            onClick={handleViewHistory}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleViewHistory();
              }
            }}
            className="flex-1 group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-800 border border-gray-700 hover:border-primary/50"
          >
            <div className="p-1.5 bg-gradient-to-r from-primary to-[#33C3F0] rounded-lg">
              <History className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3 flex flex-col">
              <h3 className="font-medium text-sm text-gray-900 group-hover:text-[#33C3F0] transition-colors duration-300">
                Analysis History
              </h3>
              <p className="text-gray-500 text-xs">
                Review past diagnoses and track your plant's health over time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis History Modal */}
      {session && (
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Analysis History</DialogTitle>
            </DialogHeader>
            <AnalysisHistory userId={session.user.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MobileAnalysisResults;