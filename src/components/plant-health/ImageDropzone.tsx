
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import CameraCapture from './CameraCapture';
import ImagePreviewGrid from './ImagePreviewGrid';
import { useFileValidation } from './image-upload/FileValidation';
import UploadArea from './image-upload/UploadArea';
import { compressImage } from './image-upload/ImageCompression';
import { toast } from '@/hooks/use-toast';

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
  const [isProcessing, setIsProcessing] = useState(false);
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

  const processFiles = async (files: FileList) => {
    setIsProcessing(true);
    try {
      const filesToProcess = Array.from(files)
        .filter(validateFile)
        .slice(0, maxFiles - selectedFiles.length);

      if (filesToProcess.length === 0) {
        setIsProcessing(false);
        return;
      }

      // Compress all valid files
      const compressedFiles = await Promise.all(
        filesToProcess.map(file => compressImage(file, 1, 0.7))
      );

      if (compressedFiles.length > 0) {
        onImagesSelected([...selectedFiles, ...compressedFiles]);
        if (compressedFiles.length === 1) {
          toast({
            title: "Image added",
            description: "Your image has been optimized for faster analysis."
          });
        } else {
          toast({
            title: `${compressedFiles.length} images added`,
            description: "Your images have been optimized for faster analysis."
          });
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Image processing error",
        description: "There was a problem preparing your images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handlePhotoCapture = async (file: File) => {
    if (validateFile(file)) {
      setIsProcessing(true);
      try {
        const compressedFile = await compressImage(file, 1, 0.7);
        if (onCameraCapture) {
          onCameraCapture(compressedFile);
        } else {
          onImagesSelected([...selectedFiles, compressedFile]);
        }
      } catch (error) {
        console.error('Error compressing camera image:', error);
        if (onCameraCapture) {
          onCameraCapture(file);
        } else {
          onImagesSelected([...selectedFiles, file]);
        }
      } finally {
        setIsProcessing(false);
        setShowCamera(false);
      }
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
        description: err.message || "Could not access camera",
        variant: "destructive"
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
          <UploadArea dragActive={dragActive} isProcessing={isProcessing} />
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
            isProcessing={isProcessing}
          />
        )}
      </div>
    </Card>
  );
};

export default ImageDropzone;
