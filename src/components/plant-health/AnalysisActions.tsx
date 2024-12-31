import React from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import AnalysisConfirmationDialog from './AnalysisConfirmationDialog';

interface AnalysisActionsProps {
  session: Session | null;
  onTakePhoto: () => void;
  onAnalyze: () => Promise<void>;
  showConfirmation: boolean;
  onConfirmationCancel: () => void;
  onConfirmationConfirm: () => void;
  analysisResult: any;
}

const AnalysisActions = ({
  session,
  onTakePhoto,
  onAnalyze,
  showConfirmation,
  onConfirmationCancel,
  onConfirmationConfirm,
  analysisResult
}: AnalysisActionsProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {!analysisResult && (
        <Button
          onClick={onTakePhoto}
          className="w-full md:w-auto"
          variant="default"
        >
          Take Another Photo
        </Button>
      )}

      <AnalysisConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={onConfirmationConfirm}
        onCancel={onConfirmationCancel}
      />
    </div>
  );
};

export default AnalysisActions;