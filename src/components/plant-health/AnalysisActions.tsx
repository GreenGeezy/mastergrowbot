
import React from 'react';
import { Button } from '@/components/ui/button';
import ShareResults from './ShareResults';
import AnalysisHistory from './AnalysisHistory';
import AnalysisConfirmationDialog from './AnalysisConfirmationDialog';
import { Camera } from 'lucide-react';

interface AnalysisActionsProps {
  session: any;
  onTakePhoto: () => void;
  onAnalyze: () => void;
  showConfirmation: boolean;
  onConfirmationCancel: () => void;
  onConfirmationConfirm: () => void;
  analysisResult?: any;
}

const AnalysisActions = ({
  session,
  onTakePhoto,
  onAnalyze,
  showConfirmation,
  onConfirmationCancel,
  onConfirmationConfirm,
  analysisResult,
}: AnalysisActionsProps) => {
  if (!session) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-6 max-w-lg mx-auto px-4">
      {analysisResult && (
        <div data-share-dialog className="w-full">
          <ShareResults 
            analysisId={analysisResult?.id || ""} 
            imageUrls={analysisResult?.image_urls || [analysisResult?.image_url] || []} 
          />
        </div>
      )}
      <div data-history-dialog className="w-full">
        <AnalysisHistory userId={session.user.id} />
      </div>
      <div className="w-full space-y-4">
        <Button
          onClick={onTakePhoto}
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold text-lg px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </Button>
        <Button
          onClick={onAnalyze}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold text-lg px-6 py-4 rounded-xl transition-all duration-300"
        >
          Analyze Plant
        </Button>
      </div>
      <AnalysisConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={onConfirmationConfirm}
        onCancel={onConfirmationCancel}
      />
    </div>
  );
};

export default AnalysisActions;
