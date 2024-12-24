import React from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewGridProps {
  files: File[];
  maxFiles: number;
  onRemove: (index: number) => void;
  onAddMore: () => void;
  onStartCamera: () => void;
}

const ImagePreviewGrid = ({ 
  files, 
  maxFiles, 
  onRemove, 
  onAddMore, 
  onStartCamera 
}: ImagePreviewGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      {files.length < maxFiles && (
        <div className="flex flex-col gap-4">
          <div
            onClick={onAddMore}
            className="cursor-pointer border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-primary/50 transition-all duration-300 flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Add more images</p>
            </div>
          </div>
          <Button
            onClick={onStartCamera}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewGrid;