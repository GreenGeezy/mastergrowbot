import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onPhotoCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture = ({ onPhotoCapture, onClose }: CameraCaptureProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

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
        description: err.message || "Please allow camera access to take photos. You may need to enable it in your browser settings.",
        variant: "destructive",
      });
      onClose();
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setCapturedFile(file);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedFile(null);
  };

  const handleUsePhoto = () => {
    if (capturedFile) {
      onPhotoCapture(capturedFile);
      onClose();
    }
  };

  if (hasPermission === false) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">Camera access was denied. Please enable camera access in your browser settings.</p>
        <Button onClick={onClose} variant="destructive">Close</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              onClick={capturePhoto}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Take Photo
            </Button>
            <Button
              onClick={onClose}
              variant="destructive"
              className="text-white"
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              onClick={retakePhoto}
              variant="secondary"
              className="text-white"
            >
              Retake
            </Button>
            <Button
              onClick={handleUsePhoto}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Use Photo
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;