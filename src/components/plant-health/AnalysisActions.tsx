import React from 'react';
import { Button } from '@/components/ui/button';
import ShareResults from './ShareResults';
import AnalysisHistory from './AnalysisHistory';
import AnalysisConfirmationDialog from './AnalysisConfirmationDialog';

interface AnalysisActionsProps {
  session: any;
  onTakePhoto: () => void;
  onAnalyze: () => void;
  showConfirmation: boolean;
  onConfirmationCancel: () => void;
  onConfirmationConfirm: () => void;
}

const AnalysisActions = ({
  session,
  onTakePhoto,
  onAnalyze,
  showConfirmation,
  onConfirmationCancel,
  onConfirmationConfirm,
}: AnalysisActionsProps) => {
  if (!session) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-6 max-w-lg mx-auto px-4">
      <div data-share-dialog className="w-full">
        <ShareResults analysisId="" imageUrls={[]} />
      </div>
      <div data-history-dialog className="w-full">
        <AnalysisHistory userId={session.user.id} />
      </div>
      <div className="w-full">
        <Button
          onClick={onTakePhoto}
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold text-lg px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center"
        >
          Take Photo
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