
import React, { useEffect, useState } from 'react';
import { X, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceChatOverlayProps {
  isListening: boolean;
  isSpeaking: boolean;
  onInterrupt: () => void;
  onStop: () => void;
  onClose: () => void;
}

const VoiceChatOverlay: React.FC<VoiceChatOverlayProps> = ({
  isListening,
  isSpeaking,
  onInterrupt,
  onStop,
  onClose
}) => {
  const [dots, setDots] = useState<number[]>([0, 0, 0, 0]);

  // Animate the dots when the AI is speaking or listening
  useEffect(() => {
    if (isSpeaking || isListening) {
      const interval = setInterval(() => {
        setDots(prev => {
          const newDots = [...prev];
          // Create wave-like animation
          newDots[0] = Math.abs(Math.sin(Date.now() * 0.001) * 10);
          newDots[1] = Math.abs(Math.sin(Date.now() * 0.001 + 1) * 10);
          newDots[2] = Math.abs(Math.sin(Date.now() * 0.001 + 2) * 10);
          newDots[3] = Math.abs(Math.sin(Date.now() * 0.001 + 3) * 10);
          return newDots;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isSpeaking, isListening]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95">
      {/* Animated dots */}
      <div className="flex space-x-4 mb-20">
        {dots.map((height, index) => (
          <div 
            key={index}
            className="w-5 h-5 rounded-full bg-white"
            style={{ 
              transform: `scale(${0.8 + (height / 15)})`,
              opacity: 0.7 + (height / 30)
            }}
          />
        ))}
      </div>
      
      {/* Tap to interrupt */}
      <div 
        className="flex flex-col items-center mb-16 cursor-pointer"
        onClick={onInterrupt}
      >
        <Mic className="w-6 h-6 text-white/70 mb-2" />
        <p className="text-white/70 text-sm">Tap to interrupt</p>
      </div>
      
      {/* Control buttons */}
      <div className="flex items-center space-x-12">
        <Button
          onClick={onStop}
          className="w-12 h-12 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/20 flex items-center justify-center"
        >
          <StopCircle className="w-6 h-6 text-white" />
        </Button>
        
        <Button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </Button>
      </div>
      
      {/* Bottom bar */}
      <div className="absolute bottom-6 w-1/3 h-1 bg-white/20 rounded-full"></div>
    </div>
  );
};

export default VoiceChatOverlay;
