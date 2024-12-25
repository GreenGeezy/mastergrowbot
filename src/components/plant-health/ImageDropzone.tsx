import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import CameraCapture from './CameraCapture';
import ImagePreviewGrid from './ImagePreviewGrid';

interface ImageDropzoneProps {
  onImagesSelected: (files: File[]) => void;
  selectedFiles: File[];
  maxFiles?: number;
}

const ImageDropzone = ({ 
  onImagesSelected, 
  selectedFiles, 
  maxFiles = 3 
}: ImageDropzoneProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const handleStartCamera = () => {
      startCamera();
    };

    const dropzone = document.querySelector('[data-image-dropzone]');
    if (dropzone) {
      dropzone.addEventListener('start-camera', handleStartCamera);
    }

    return () => {
      if (dropzone) {
        dropzone.removeEventListener('start-camera', handleStartCamera);
      }
    };
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, or WebP images only.",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Each image must be smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files)
      .filter(validateFile)
      .slice(0, maxFiles - selectedFiles.length);

    if (validFiles.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} images.`,
        variant: "destructive",
      });
      return;
    }

    onImagesSelected([...selectedFiles, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onImagesSelected(newFiles);
  };

  const handlePhotoCapture = (file: File) => {
    if (validateFile(file)) {
      onImagesSelected([...selectedFiles, file]);
      setShowCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }
      
      setShowCamera(true);
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      toast({
        title: "Camera Error",
        description: err.message || "Unable to access camera. Please check your browser settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:border-primary/50 transition-all duration-300"
      data-image-dropzone
    >
      <div
        className="p-8 text-center"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleChange}
        />
        
        {showCamera && (
          <CameraCapture
            onPhotoCapture={handlePhotoCapture}
            onClose={() => setShowCamera(false)}
          />
        )}

        {!showCamera && selectedFiles.length === 0 && (
          <div className="space-y-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-gray-700'} rounded-xl p-8 hover:border-primary/50 transition-all duration-300`}>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Drop up to {maxFiles} images here or click to upload
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
        )}

        {!showCamera && selectedFiles.length > 0 && (
          <ImagePreviewGrid
            files={selectedFiles}
            maxFiles={maxFiles}
            onRemove={removeFile}
            onAddMore={() => {
              const fileInput = document.getElementById('file-upload') as HTMLInputElement;
              if (fileInput) fileInput.click();
            }}
            onStartCamera={startCamera}
          />
        )}
      </div>
    </Card>
  );
};

export default ImageDropzone;