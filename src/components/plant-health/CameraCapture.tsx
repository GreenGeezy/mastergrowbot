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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to take photos. You may need to enable it in your browser settings.",
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
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onPhotoCapture(file);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  return (
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
          onClick={onClose}
          variant="destructive"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;