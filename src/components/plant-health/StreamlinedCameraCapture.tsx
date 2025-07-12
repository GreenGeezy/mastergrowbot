import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Image, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface StreamlinedCameraCaptureProps {
  onPhotoCapture: (file: File) => void;
  onClose: () => void;
  onGallerySelect: () => void;
}

const StreamlinedCameraCapture = ({ onPhotoCapture, onClose, onGallerySelect }: StreamlinedCameraCaptureProps) => {
  const { toast } = useToast();
  const haptic = useHapticFeedback();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      console.log('Camera access granted');
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to scan your plant. You may need to enable it in your browser settings.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = async () => {
    if (videoRef.current && !isCapturing) {
      setIsCapturing(true);
      haptic.medium();
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `plant-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setCapturedFile(file);
          }
        }, 'image/jpeg', 0.8);
      }
      
      setTimeout(() => setIsCapturing(false), 300);
    }
  };

  const retakePhoto = () => {
    haptic.light();
    setCapturedImage(null);
    setCapturedFile(null);
  };

  const usePhoto = () => {
    if (capturedFile) {
      haptic.success();
      onPhotoCapture(capturedFile);
    }
  };

  const handleClose = () => {
    haptic.light();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  const handleGallerySelect = () => {
    haptic.light();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onGallerySelect();
  };

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center p-6">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-4 text-lg">Camera access denied</p>
          <p className="text-gray-400 mb-6 text-sm">Please enable camera access in your browser settings to scan plants.</p>
          <Button 
            onClick={handleClose} 
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent">
        <Button
          onClick={handleClose}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-2"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <h1 className="text-white font-semibold">Plant Scanner</h1>
        
        <Button
          onClick={handleGallerySelect}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-2"
          aria-label="Choose from gallery"
        >
          <Image className="w-6 h-6" />
        </Button>
      </div>

      {/* Camera View */}
      {!capturedImage ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror for selfie effect
          />
          
          {/* AR-like Plant Framing Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Bounding Box */}
              <div className="w-80 h-80 border-2 border-green-400 rounded-xl relative bg-green-400/5">
                {/* Corner Guides */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                
                {/* Center Label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-400/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Position plant here
                  </div>
                </div>
              </div>
              
              {/* Scanning Animation */}
              <div className="absolute inset-0 border-2 border-transparent">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <div className="flex items-center justify-center">
              {/* Shutter Button */}
              <button
                onClick={capturePhoto}
                disabled={isCapturing || hasPermission !== true}
                className={`w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
                  isCapturing 
                    ? 'scale-95 bg-green-400/50' 
                    : 'hover:scale-105 active:scale-95'
                } disabled:opacity-50`}
                aria-label="Capture plant photo"
              >
                <div className={`w-16 h-16 rounded-full transition-all duration-200 ${
                  isCapturing ? 'bg-green-400' : 'bg-white'
                }`} />
              </button>
            </div>
            
            {/* Instruction Text */}
            <p className="text-white text-center mt-4 text-sm">
              Position your plant in the frame and tap to scan
            </p>
          </div>
        </div>
      ) : (
        /* Photo Review */
        <div className="relative w-full h-full">
          <img 
            src={capturedImage} 
            alt="Captured plant" 
            className="w-full h-full object-cover"
          />
          
          {/* Review Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <div className="flex items-center justify-center gap-8">
              <Button
                onClick={retakePhoto}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/20 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake
              </Button>
              
              <Button
                onClick={usePhoto}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-8"
              >
                <Check className="w-5 h-5" />
                Scan Plant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamlinedCameraCapture;