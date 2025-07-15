
import React from 'react';
import { Upload, Loader2, Camera, Image, Eye, Lightbulb, FileImage, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface UploadAreaProps {
  dragActive: boolean;
  isProcessing?: boolean;
  onInvalidFile?: (message: string) => void;
  supportedFormats?: string[];
}

const UploadArea = ({ 
  dragActive, 
  isProcessing = false,
  onInvalidFile,
  supportedFormats = ['jpg', 'png', 'webp', 'gif', 'bmp', 'tiff']
}: UploadAreaProps) => {
  const haptic = useHapticFeedback();

  const handleFileUpload = () => {
    haptic.light();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput && !isProcessing) {
      fileInput.click();
    }
  };

  const handleCameraCapture = () => {
    haptic.medium();
    // Dispatch custom event to trigger camera
    const dropzone = document.querySelector('[data-image-dropzone]');
    if (dropzone) {
      dropzone.dispatchEvent(new CustomEvent('start-camera'));
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Streamlined Drop Zone */}
        <div
          onClick={handleFileUpload}
          className={`cursor-pointer ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Upload plant images by clicking or dragging files here"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFileUpload();
            }
          }}
        >
          <div className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-border/50'} rounded-2xl p-12 hover:border-primary/60 transition-all duration-300 bg-gradient-to-br from-background/40 to-card/20 focus-within:ring-2 focus-within:ring-primary/20`}>
            <div className="flex flex-col items-center gap-6">
              <div 
                className="p-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 shadow-2xl shadow-green-500/25"
                aria-hidden="true"
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-xl mb-3">
                  {isProcessing ? "Processing images..." : "Drop images here"}
                </p>
                <p className="text-white text-base">
                  or tap to select from your device
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Single Scan Now Button */}
        <Button
          onClick={handleCameraCapture}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-green-600 hover:from-green-600 hover:via-blue-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-[1.02] focus:scale-[1.02] focus:shadow-green-500/40 flex items-center justify-center gap-3 text-lg"
          aria-label="Start camera to scan plant instantly"
          aria-describedby="scan-button-description"
        >
          <Camera className="w-6 h-6" aria-hidden="true" />
          Scan Now
        </Button>
        <span id="scan-button-description" className="sr-only">
          Opens camera interface to capture and analyze your plant immediately
        </span>

        {/* Icon-Based Guidelines */}
        <div 
          className="bg-gradient-to-r from-background/50 to-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50"
          role="region"
          aria-labelledby="photo-guidelines-title"
        >
          <h3 id="photo-guidelines-title" className="sr-only">Photo capture guidelines</h3>
          <div className="grid grid-cols-2 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/40 hover:bg-card/60 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-primary/20"
                  role="button"
                  tabIndex={0}
                  aria-label="Photo guideline: Show full plant for context"
                >
                  <Eye className="w-5 h-5 text-green-400" aria-hidden="true" />
                  <span className="text-white text-sm font-medium">Full Plant</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show the whole plant for context</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/40 hover:bg-card/60 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-primary/20"
                  role="button"
                  tabIndex={0}
                  aria-label="Photo guideline: Include close-up shots of problem areas"
                >
                  <Image className="w-5 h-5 text-blue-400" aria-hidden="true" />
                  <span className="text-white text-sm font-medium">Close-ups</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Include close-ups of problem areas</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/40 hover:bg-card/60 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-primary/20"
                  role="button"
                  tabIndex={0}
                  aria-label="Photo guideline: Ensure photos are well-lit"
                >
                  <Lightbulb className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                  <span className="text-white text-sm font-medium">Well-lit</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ensure photos are well-lit</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/40 hover:bg-card/60 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-primary/20"
                  role="button"
                  tabIndex={0}
                  aria-label="Photo guideline: Supported file formats"
                >
                  <FileImage className="w-5 h-5 text-purple-400" aria-hidden="true" />
                  <span className="text-white text-sm font-medium">Formats</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Supported: {supportedFormats.join(', ').toUpperCase()}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UploadArea;
