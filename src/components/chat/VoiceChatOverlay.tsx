
import React, { useEffect, useState, useRef } from 'react';
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
  const [dotColors, setDotColors] = useState<string[]>(['white', 'white', 'white', 'white']);
  const animationRef = useRef<number | null>(null);
  
  // More dramatic animation for the dots with color changes
  useEffect(() => {
    if (isSpeaking || isListening) {
      const animate = () => {
        setDots(prev => {
          const newDots = [...prev];
          const time = Date.now() * 0.003; // Base timing
          
          // More dramatic animation with different parameters based on speaking/listening
          const baseAmplitude = isListening ? 25 : 12; // Higher amplitude when listening (user speaking)
          const frequency = isListening ? 3.0 : 1.5; // Faster frequency when listening
          
          // Generate unique wave patterns for each dot with more dramatic movement
          newDots[0] = Math.abs(Math.sin(time * frequency) * baseAmplitude) + 
                       Math.abs(Math.cos(time * 0.9) * 6);
          
          newDots[1] = Math.abs(Math.sin((time + 0.8) * frequency) * baseAmplitude) + 
                       Math.abs(Math.cos((time + 0.4) * 0.9) * 6);
          
          newDots[2] = Math.abs(Math.sin((time + 1.6) * frequency) * baseAmplitude) + 
                       Math.abs(Math.cos((time + 0.8) * 0.9) * 6);
          
          newDots[3] = Math.abs(Math.sin((time + 2.4) * frequency) * baseAmplitude) + 
                       Math.abs(Math.cos((time + 1.2) * 0.9) * 6);
          
          return newDots;
        });
        
        // Update dot colors when user is speaking
        if (isListening) {
          setDotColors(prev => {
            const time = Date.now() * 0.001;
            return [
              `hsl(${(Math.sin(time) * 30 + 240) % 360}, 80%, 70%)`, // Blue variations
              `hsl(${(Math.sin(time + 1) * 30 + 300) % 360}, 80%, 70%)`, // Purple variations
              `hsl(${(Math.sin(time + 2) * 30 + 180) % 360}, 80%, 70%)`, // Teal variations
              `hsl(${(Math.sin(time + 3) * 30 + 270) % 360}, 80%, 70%)`, // Violet variations
            ];
          });
        } else {
          // Return to white when AI is speaking
          setDotColors(['white', 'white', 'white', 'white']);
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // Reset dots to static state when not speaking or listening
      setDots([0, 0, 0, 0]);
      setDotColors(['white', 'white', 'white', 'white']);
    }
  }, [isSpeaking, isListening]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95">
      {/* Enhanced animated dots with more dramatic styling and color changes */}
      <div className="flex space-x-4 mb-20">
        {dots.map((height, index) => (
          <div 
            key={index}
            className="w-5 h-5 rounded-full"
            style={{ 
              transform: `scale(${0.8 + (height / 15)}) translateY(${isListening ? -height/2 : height/4}px) ${isListening ? `rotate(${height * 5}deg)` : ''}`,
              opacity: 0.7 + (height / 25),
              background: isListening 
                ? `radial-gradient(circle at 30% 30%, ${dotColors[index]}, rgba(0,0,0,0.3))`
                : 'radial-gradient(circle at 30% 30%, white, rgba(120,180,255,0.5))',
              boxShadow: `0 0 ${10 + height/1.5}px ${3 + height/4}px ${isListening ? dotColors[index] : 'rgba(255, 255, 255, 0.6)'}`,
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
