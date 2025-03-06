
import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadAreaProps {
  dragActive: boolean;
  isProcessing?: boolean;
}

const UploadArea = ({ dragActive, isProcessing = false }: UploadAreaProps) => {
  return (
    <div className="space-y-4">
      <label
        htmlFor="file-upload"
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
            <div>
              <p className="text-white font-medium">
                {isProcessing ? "Processing images..." : "Drop images here or click to upload"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Upload multiple angles of your plant (max. 10MB each)
              </p>
              <ul className="text-gray-400 text-sm mt-4 space-y-1">
                <li>• Show the whole plant for context</li>
                <li>• Include close-ups of problem areas</li>
                <li>• Ensure photos are well-lit</li>
              </ul>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default UploadArea;
