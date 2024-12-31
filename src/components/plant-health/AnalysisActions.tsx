import React from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Camera, Share2 } from 'lucide-react';
import AnalysisConfirmationDialog from './AnalysisConfirmationDialog';
import ShareResults from './share/ShareResults';

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
      <div className="flex flex-wrap gap-4 w-full justify-center">
        <Button
          onClick={onTakePhoto}
          className="bg-gradient-to-r from-green-500 to-blue-500"
          size="lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Photo
        </Button>

        {analysisResult && (
          <ShareResults
            analysisId={analysisResult.id}
            imageUrls={analysisResult.image_urls || []}
          />
        )}
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