
import React from 'react';
import { Upload, Loader2, Camera, Image, Eye, Lightbulb, FileImage, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import cannabisLeafOutline from '@/assets/cannabis-leaf-outline.png';
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
          <div className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-border/50'} rounded-2xl p-12 hover:border-primary/60 transition-all duration-300 bg-gradient-to-br from-background/40 to-card/20 focus-within:ring-2 focus-within:ring-primary/20 relative`}>
            {/* Cannabis leaf placeholder */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img 
                src={cannabisLeafOutline} 
                alt=""
                className="w-32 h-32 opacity-30 object-contain"
                aria-hidden="true"
              />
            </div>
            
            <div className="flex flex-col items-center gap-6 relative z-10">
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
          variant="cta"
          size="lg"
          className="w-full"
          aria-label="Start camera to scan plant instantly"
          aria-describedby="scan-button-description"
        >
          <Camera className="w-6 h-6 mr-2" aria-hidden="true" />
          Take Pic and Scan Now
        </Button>
        <span id="scan-button-description" className="sr-only">
          Opens camera interface to capture and analyze your plant immediately
        </span>

        {/* Photo Tips as Horizontal Badge Pills */}
        <div className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold text-center">
            Photo Tips for Best Results
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-green-500 text-white rounded-lg px-3 py-2 text-sm font-medium">
              👁️ Full Plant
            </Badge>
            <Badge className="bg-blue-500 text-white rounded-lg px-3 py-2 text-sm font-medium">
              📷 Close-ups
            </Badge>
            <Badge className="bg-yellow-500 text-white rounded-lg px-3 py-2 text-sm font-medium">
              💡 Well-lit
            </Badge>
            <Badge className="bg-purple-500 text-white rounded-lg px-3 py-2 text-sm font-medium">
              📁 Formats
            </Badge>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UploadArea;
