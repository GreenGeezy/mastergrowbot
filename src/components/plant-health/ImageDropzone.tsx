import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import CameraCapture from './CameraCapture';
import ImagePreviewGrid from './ImagePreviewGrid';
import { useFileValidation } from './image-upload/FileValidation';
import UploadArea from './image-upload/UploadArea';

interface ImageDropzoneProps {
  onImagesSelected: (files: File[]) => void;
  selectedFiles: File[];
  maxFiles?: number;
  onCameraCapture?: (file: File) => void;
}

const ImageDropzone = ({ 
  onImagesSelected, 
  selectedFiles, 
  maxFiles = 3,
  onCameraCapture 
}: ImageDropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { validateFile } = useFileValidation();

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

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files)
      .filter(validateFile)
      .slice(0, maxFiles - selectedFiles.length);

    if (validFiles.length > 0) {
      onImagesSelected([...selectedFiles, ...validFiles]);
    }
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

  const handlePhotoCapture = (file: File) => {
    if (validateFile(file)) {
      if (onCameraCapture) {
        onCameraCapture(file);
      } else {
        onImagesSelected([...selectedFiles, file]);
      }
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
          <UploadArea dragActive={dragActive} />
        )}

        {!showCamera && selectedFiles.length > 0 && (
          <ImagePreviewGrid
            files={selectedFiles}
            maxFiles={maxFiles}
            onRemove={(index) => {
              const newFiles = selectedFiles.filter((_, i) => i !== index);
              onImagesSelected(newFiles);
            }}
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