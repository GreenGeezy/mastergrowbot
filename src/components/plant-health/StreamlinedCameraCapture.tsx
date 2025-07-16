import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Image, RotateCcw, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/utils/hapticFeedback';
import { motion, AnimatePresence } from 'framer-motion';

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
          
          {/* Enhanced AR-like Plant Framing Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Enhanced Bounding Box with Neon Glow - Made Taller */}
              <motion.div 
                className="w-80 h-96 sm:w-72 sm:h-80 md:w-80 md:h-96 border-2 border-green-400 rounded-xl relative bg-green-400/5"
                style={{ 
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)',
                  filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.4))'
                }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)',
                    '0 0 30px rgba(34, 197, 94, 0.5), inset 0 0 30px rgba(34, 197, 94, 0.2)',
                    '0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Enhanced Corner Guides with Glow */}
                <motion.div 
                  className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-lg"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-lg"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div 
                  className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-lg"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-lg"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
                
                {/* Center Label */}
                <motion.div 
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="bg-green-400/90 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Frame Your Plant & Tap to Scan
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Scanning Animation Waves */}
              <AnimatePresence>
                {!isCapturing && (
                  <motion.div className="absolute inset-0 border-2 border-transparent overflow-hidden rounded-xl">
                    {/* Multiple scanning waves */}
                    <motion.div
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                      animate={{
                        y: [0, 384, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' }}
                    />
                    <motion.div
                      className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"
                      animate={{
                        y: [0, 384, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                      style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.6))' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Capture Flash Effect */}
              <AnimatePresence>
                {isCapturing && (
                  <motion.div
                    className="absolute inset-0 bg-green-400/20 rounded-xl border-2 border-green-400"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))' }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom Controls - Positioned below the taller scanner box */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-16">
            <div className="flex items-center justify-center">
              {/* Enhanced Shutter Button for iOS */}
              <motion.button
                onClick={capturePhoto}
                disabled={isCapturing || hasPermission !== true}
                className={`w-28 h-28 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
                  isCapturing 
                    ? 'scale-95 bg-green-400/50 border-green-400' 
                    : 'hover:scale-105 active:scale-95 hover:bg-white/30'
                } disabled:opacity-50 touch-manipulation`}
                style={{
                  filter: isCapturing ? 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))' : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
                  minHeight: '112px',
                  minWidth: '112px'
                }}
                aria-label="Capture plant photo"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                animate={{
                  borderColor: isCapturing ? '#22c55e' : '#ffffff',
                  boxShadow: isCapturing 
                    ? '0 0 30px rgba(34, 197, 94, 0.6), inset 0 0 20px rgba(34, 197, 94, 0.2)' 
                    : '0 0 20px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className={`w-20 h-20 rounded-full transition-all duration-200 ${
                    isCapturing ? 'bg-green-400' : 'bg-white'
                  }`}
                  animate={{
                    scale: isCapturing ? [1, 1.2, 1] : 1,
                    backgroundColor: isCapturing ? '#22c55e' : '#ffffff'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
            
            {/* Enhanced Instruction Text */}
            <motion.p 
              className="text-white text-center mt-6 text-base font-medium"
              style={{ 
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9))'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Frame Your Plant & Tap to Scan
            </motion.p>
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