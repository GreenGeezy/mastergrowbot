
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

  // Enhanced dots animation when the AI is speaking or listening
  useEffect(() => {
    if (isSpeaking || isListening) {
      const interval = setInterval(() => {
        setDots(prev => {
          const newDots = [...prev];
          // Create more dynamic wave-like animation with phase shifts
          // This creates a smoother, more futuristic flow
          const time = Date.now() * 0.003; // Slow down animation slightly for smoother effect
          const amplitude = isSpeaking ? 15 : 10; // Higher amplitude when speaking
          
          // Adding different frequency components for more organic movement
          newDots[0] = Math.abs(Math.sin(time) * amplitude) + Math.abs(Math.cos(time * 0.5) * 3);
          newDots[1] = Math.abs(Math.sin(time + 0.8) * amplitude) + Math.abs(Math.cos((time + 0.4) * 0.5) * 3);
          newDots[2] = Math.abs(Math.sin(time + 1.6) * amplitude) + Math.abs(Math.cos((time + 0.8) * 0.5) * 3);
          newDots[3] = Math.abs(Math.sin(time + 2.4) * amplitude) + Math.abs(Math.cos((time + 1.2) * 0.5) * 3);
          return newDots;
        });
      }, 30); // Increased frame rate for smoother animation
      return () => clearInterval(interval);
    }
  }, [isSpeaking, isListening]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95">
      {/* Animated dots with enhanced styling */}
      <div className="flex space-x-4 mb-20">
        {dots.map((height, index) => (
          <div 
            key={index}
            className="w-5 h-5 rounded-full bg-gradient-to-br from-white to-blue-300"
            style={{ 
              transform: `scale(${0.8 + (height / 20)})`,
              opacity: 0.7 + (height / 30),
              boxShadow: `0 0 ${8 + height/2}px ${2 + height/5}px rgba(255, 255, 255, 0.${Math.floor(3 + height/5)})`,
              transition: 'all 0.05s ease-out'
            }}
          />
        ))}
      </div>
      
      {/* Tap to interrupt */}
      <div 
        className="flex flex-col items-center mb-16 cursor-pointer group"
        onClick={onInterrupt}
      >
        <Mic className="w-6 h-6 text-white/70 mb-2 group-hover:text-white transition-colors duration-200" />
        <p className="text-white/70 text-sm group-hover:text-white transition-colors duration-200">Tap to interrupt</p>
      </div>
      
      {/* Control buttons with enhanced styling */}
      <div className="flex items-center space-x-12">
        <Button
          onClick={onStop}
          className="w-12 h-12 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/20 flex items-center justify-center transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <StopCircle className="w-6 h-6 text-white" />
        </Button>
        
        <Button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,100,100,0.4)]"
        >
          <X className="w-6 h-6 text-white" />
        </Button>
      </div>
      
      {/* Bottom bar with gradient glow */}
      <div className="absolute bottom-6 w-1/3 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full after:content-[''] after:absolute after:inset-0 after:blur-sm after:bg-white/20"></div>
    </div>
  );
};

export default VoiceChatOverlay;
