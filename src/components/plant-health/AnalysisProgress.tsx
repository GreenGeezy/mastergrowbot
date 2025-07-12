import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalysisProgressProps {
  isVisible: boolean;
  onCancel: () => void;
  currentMessage: string;
  elapsedTime: number;
}

const AnalysisProgress = ({ isVisible, onCancel, currentMessage, elapsedTime }: AnalysisProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Uploading images...');

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setStage('Uploading images...');
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        // Simulate realistic progress based on elapsed time
        let newProgress = Math.min(prev + Math.random() * 8 + 2, 95);
        
        // Update stage based on progress
        if (newProgress < 20) {
          setStage('Uploading images...');
        } else if (newProgress < 40) {
          setStage('Processing images...');
        } else if (newProgress < 60) {
          setStage('Analyzing plant health...');
        } else if (newProgress < 80) {
          setStage('Identifying issues...');
        } else {
          setStage('Generating recommendations...');
        }
        
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const progressPercentage = Math.round(progress);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Analyzing Plant Health</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="text-gray-400 hover:text-white hover:bg-red-500/20 p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Content */}
        <div className="p-8 space-y-6">
          {/* Animated Loader */}
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-green-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{progressPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">{stage}</span>
              <span className="text-sm text-green-400 font-bold">{progressPercentage}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-gray-700/50 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-blue-400"
            />
          </div>

          {/* Marketing Message */}
          <div className="text-center space-y-2">
            <p className="text-green-400 font-medium animate-pulse">
              {currentMessage}
            </p>
            <p className="text-gray-400 text-sm">
              Time elapsed: {elapsedTime}s
            </p>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${progress > 20 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className={`text-sm ${progress > 20 ? 'text-green-400' : 'text-gray-500'}`}>
                Image upload complete
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${progress > 40 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className={`text-sm ${progress > 40 ? 'text-green-400' : 'text-gray-500'}`}>
                AI processing initiated
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${progress > 60 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className={`text-sm ${progress > 60 ? 'text-green-400' : 'text-gray-500'}`}>
                Plant health analyzed
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${progress > 80 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className={`text-sm ${progress > 80 ? 'text-green-400' : 'text-gray-500'}`}>
                Recommendations ready
              </span>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="p-6 border-t border-gray-700/50">
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            Cancel Analysis
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AnalysisProgress;