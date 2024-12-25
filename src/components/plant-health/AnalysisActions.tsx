import React from 'react';
import { Button } from '@/components/ui/button';
import ShareResults from './ShareResults';
import AnalysisHistory from './AnalysisHistory';
import AnalysisConfirmationDialog from './AnalysisConfirmationDialog';
import { Camera, Share2, History, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <TooltipProvider>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div data-share-dialog>
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
                </Button>
                <ShareResults analysisId="" imageUrls={[]} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Share analysis via email or link
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div data-history-dialog>
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
                </Button>
                <AnalysisHistory userId={session.user.id} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Review past diagnoses
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-full space-y-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onTakePhoto}
                className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Use device camera
            </TooltipContent>
          </Tooltip>

          <Button
            onClick={onAnalyze}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold text-lg px-8 py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
          >
            <Upload className="w-5 h-5 mr-2" />
            Analyze Plant
          </Button>
        </div>
      </TooltipProvider>

      <AnalysisConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={onConfirmationConfirm}
        onCancel={onConfirmationCancel}
      />
    </div>
  );
};

export default AnalysisActions;