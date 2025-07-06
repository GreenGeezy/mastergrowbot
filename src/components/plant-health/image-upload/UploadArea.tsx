
import React from 'react';
import { Upload, Loader2, Camera, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const handleFileUpload = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput && !isProcessing) {
      fileInput.click();
    }
  };

  const handleCameraCapture = () => {
    // Dispatch custom event to trigger camera
    const dropzone = document.querySelector('[data-image-dropzone]');
    if (dropzone) {
      dropzone.dispatchEvent(new CustomEvent('start-camera'));
    }
  };

  return (
    <div className="space-y-6">
      <div
        onClick={handleFileUpload}
        className={`cursor-pointer ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <div className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-gray-700'} rounded-xl p-8 hover:border-primary/50 transition-all duration-300`}>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-lg mb-2">
                {isProcessing ? "Processing images..." : "Drop images here or click to upload"}
              </p>
              <p className="text-gray-400 text-sm">
                Upload multiple angles of your plant (max. 10MB each)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons for mobile and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={handleFileUpload}
          disabled={isProcessing}
          className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Image className="w-5 h-5" />
          Choose from Gallery
        </Button>
        
        <Button
          onClick={handleCameraCapture}
          disabled={isProcessing}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </Button>
      </div>

      {/* Guidelines */}
      <div className="bg-gray-800/30 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Photo Guidelines:</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Show the whole plant for context</li>
          <li>• Include close-ups of problem areas</li>
          <li>• Ensure photos are well-lit</li>
          <li>• Supported formats: {supportedFormats.join(', ').toUpperCase()}</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadArea;
