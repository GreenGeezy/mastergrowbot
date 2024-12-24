import React, { useState, useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            if (validateFile(file)) {
              onImagesSelected([...selectedFiles, file]);
              stopCamera();
            }
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:border-primary/50 transition-all duration-300">
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
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button
                onClick={capturePhoto}
                className="bg-green-500 hover:bg-green-600"
              >
                Take Photo
              </Button>
              <Button
                onClick={stopCamera}
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </div>
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

            <Button
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo with Camera
            </Button>
          </div>
        )}

        {!showCamera && selectedFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
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
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {selectedFiles.length < maxFiles && (
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-primary/50 transition-all duration-300 flex items-center justify-center"
                >
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Add more images</p>
                  </div>
                </label>
                <Button
                  onClick={startCamera}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageDropzone;