import React from 'react';
import { Button } from '@/components/ui/button';
import ShareResults from './ShareResults';
import AnalysisHistory from './AnalysisHistory';
import AnalysisConfirmationDialog from './AnalysisConfirmationDialog';
import { Camera, Share2, History, Upload } from 'lucide-react';

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
    <div className="flex flex-col items-center gap-6 mt-8 max-w-lg mx-auto px-4">
      <div data-share-dialog className="w-full">
        <Button
          onClick={() => {
            const shareDialog = document.querySelector('[data-share-dialog]');
            if (shareDialog) {
              const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              shareDialog.dispatchEvent(event);
            }
          }}
          variant="outline"
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Results
          <span className="text-xs text-slate-400 ml-2">Share analysis via email or link</span>
        </Button>
        <ShareResults analysisId="" imageUrls={[]} />
      </div>
      
      <div data-history-dialog className="w-full">
        <Button
          onClick={() => {
            const historyDialog = document.querySelector('[data-history-dialog]');
            if (historyDialog) {
              const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              historyDialog.dispatchEvent(event);
            }
          }}
          variant="outline"
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <History className="w-4 h-4" />
          View Analysis History
          <span className="text-xs text-slate-400 ml-2">Review past diagnoses</span>
        </Button>
        <AnalysisHistory userId={session.user.id} />
      </div>

      <div className="w-full space-y-4">
        <Button
          onClick={onTakePhoto}
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Take Photo
          <span className="text-xs text-slate-400 ml-2">Use device camera</span>
        </Button>

        <Button
          onClick={onAnalyze}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
        >
          <Upload className="w-5 h-5 mr-2" />
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