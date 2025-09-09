import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import CameraCapture from './CameraCapture';
import ImagePreviewGrid from './ImagePreviewGrid';
import { useFileValidation } from './image-upload/FileValidation';
import UploadArea from './image-upload/UploadArea';
import { compressImage, cleanupCompression } from './image-upload/ImageCompression';
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
  const { validateFile, getSupportedFormats } = useFileValidation();
  
  const isMounted = useRef(true);

  useEffect(() => {
    const handleStartCamera = () => {
      startCamera();
    };

    const dropzone = document.querySelector('[data-image-dropzone]');
    if (dropzone) {
      dropzone.addEventListener('start-camera', handleStartCamera);
    }

    return () => {
      isMounted.current = false;
      cleanupCompression();
      
      if (dropzone) {
        dropzone.removeEventListener('start-camera', handleStartCamera);
      }
    };
  }, []);

  const processFiles = async (files: FileList) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      const allFiles = Array.from(files);
      const validFiles = [];
      const invalidFiles = [];
      
      for (const file of allFiles) {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push({ name: file.name, message: validation.message });
        }
      }
      
      if (invalidFiles.length > 0) {
        if (invalidFiles.length === 1) {
          toast({
            title: `Invalid file`,
            description: invalidFiles[0].message || `"${invalidFiles[0].name}" is not a supported image format`,
            variant: "destructive"
          });
        } else {
          const fileNames = (invalidFiles || []).length > 2 
            ? `${(invalidFiles || []).slice(0, 2).map(f => f.name).join(', ')} and ${(invalidFiles || []).length - 2} more` 
            : (invalidFiles || []).map(f => f.name).join(', ');
            
          toast({
            title: `${invalidFiles.length} invalid file(s) skipped`,
            description: `Please upload only supported image formats`,
            variant: "destructive"
          });
        }
      }
      
      const filesToProcess = validFiles.slice(0, maxFiles - selectedFiles.length);
      
      if (filesToProcess.length === 0) {
        setIsProcessing(false);
        return;
      }

      const compressPromises = (filesToProcess || []).map(file => 
        compressImage(file, 1, 0.7)
      );
      
      const compressedFiles = await Promise.all(compressPromises);

      if (compressedFiles.length > 0 && isMounted.current) {
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
      if (isMounted.current) {
        toast({
          title: "Image processing error",
          description: "There was a problem preparing your images. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
          <UploadArea 
            dragActive={dragActive} 
            isProcessing={isProcessing}
            supportedFormats={getSupportedFormats()}
          />
        )}

        {!showCamera && selectedFiles.length > 0 && (
          <ImagePreviewGrid
            files={selectedFiles}
            maxFiles={maxFiles}
            onRemove={(index) => {
              const newFiles = (selectedFiles || []).filter((_, i) => i !== index);
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
