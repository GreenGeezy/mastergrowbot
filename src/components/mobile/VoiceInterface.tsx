
"use client";

import { Mic, MicOff, Volume2, VolumeX, Sparkles, Loader2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceInterfaceProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onClose: () => void;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

export function VoiceInterface({
  isListening,
  isSpeaking,
  onToggleListening,
  onClose,
  className
}: VoiceInterfaceProps) {
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waveformData, setWaveformData] = useState<number[]>(Array(24).fill(0));
  const intervalRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  // Generate particles for ambient effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = window.innerWidth < 768 ? 15 : 20;
      const maxX = window.innerWidth < 768 ? 350 : 400;
      const maxY = window.innerHeight < 700 ? 300 : 400;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * maxX,
          y: Math.random() * maxY,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          velocity: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3
          }
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      const maxX = window.innerWidth < 768 ? 350 : 400;
      const maxY = window.innerHeight < 700 ? 300 : 400;
      
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x + maxX) % maxX,
        y: (particle.y + particle.velocity.y + maxY) % maxY,
        opacity: Math.max(0.1, Math.min(0.4, particle.opacity + (Math.random() - 0.5) * 0.02))
      })));
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Timer and waveform simulation
  useEffect(() => {
    if (isListening || isSpeaking) {
      intervalRef.current = setInterval(() => {
        if (isListening) {
          setDuration(prev => prev + 1);
        }
        
        // Simulate audio waveform
        const intensity = isListening ? 80 : isSpeaking ? 60 : 20;
        const newWaveform = Array(24).fill(0).map(() => 
          Math.random() * intensity
        );
        setWaveformData(newWaveform);
        
        // Simulate volume changes
        if (isListening) {
          const newVolume = Math.random() * 100;
          setVolume(newVolume);
        }
      }, 120);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setWaveformData(Array(24).fill(0));
      setVolume(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isListening, isSpeaking]);

  // Reset duration when not listening
  useEffect(() => {
    if (!isListening) {
      setDuration(0);
    }
  }, [isListening]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    if (isListening) return "Listening...";
    if (isSpeaking) return "Speaking...";
    return "Tap to speak";
  };

  const getStatusColor = () => {
    if (isListening) return "text-blue-400";
    if (isSpeaking) return "text-green-400";
    return "text-muted-foreground";
  };

  const getButtonSize = () => {
    return window.innerWidth < 768 ? "w-24 h-24" : "w-32 h-32";
  };

  const getIconSize = () => {
    return window.innerWidth < 768 ? "w-8 h-8" : "w-12 h-12";
  };

  const handleCloseClick = () => {
    console.log('Close button clicked in VoiceInterface');
    onClose();
  };

  return (
    <div className={cn("flex flex-col items-center justify-center h-full bg-white relative overflow-hidden", className)}>
      {/* Close button - positioned at top right */}
      <motion.button
        onClick={handleCloseClick}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full text-red-400 transition-colors duration-200 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Ambient particles - optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-600/30 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity
            }}
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Background glow effects - simplified for mobile */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-green-500/5 via-blue-500/5 to-green-500/5 blur-2xl"
          animate={{
            scale: isListening ? [1, 1.15, 1] : [1, 1.05, 1],
            opacity: isListening ? [0.2, 0.4, 0.2] : isSpeaking ? [0.15, 0.3, 0.15] : [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6 md:space-y-8 px-4">
        {/* Main voice button */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.button
            onClick={onToggleListening}
            className={cn(
              "relative rounded-full flex items-center justify-center transition-all duration-300",
              getButtonSize(),
              "bg-gradient-to-br from-green-600/20 to-green-600/10 border-2",
              isListening ? "border-blue-500 shadow-lg shadow-blue-500/20" :
              isSpeaking ? "border-green-500 shadow-lg shadow-green-500/20" :
              "border-gray-300 hover:border-green-400"
            )}
            animate={{
              boxShadow: isListening 
                ? ["0 0 0 0 rgba(59, 130, 246, 0.3)", "0 0 0 15px rgba(59, 130, 246, 0)"]
                : undefined
            }}
            transition={{
              duration: 2,
              repeat: isListening ? Infinity : 0
            }}
          >
            <AnimatePresence mode="wait">
              {isSpeaking ? (
                <motion.div
                  key="speaking"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Volume2 className={cn(getIconSize(), "text-green-500")} />
                </motion.div>
              ) : isListening ? (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Mic className={cn(getIconSize(), "text-blue-500")} />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Mic className={cn(getIconSize(), "text-gray-600")} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Pulse rings - simplified for mobile */}
          <AnimatePresence>
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500/20"
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.7
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Waveform visualizer - responsive */}
        <div className="flex items-center justify-center space-x-1 h-12 md:h-16">
          {waveformData.map((height, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-1 rounded-full transition-colors duration-300",
                isListening ? "bg-blue-500" :
                isSpeaking ? "bg-green-500" :
                "bg-gray-400"
              )}
              animate={{
                height: `${Math.max(3, height * 0.4)}px`,
                opacity: isListening || isSpeaking ? 0.9 : 0.3
              }}
              transition={{
                duration: 0.15,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Status and timer */}
        <div className="text-center space-y-2">
          <motion.p
            className={cn("text-lg md:text-xl font-medium transition-colors", getStatusColor())}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{
              duration: 2,
              repeat: isListening || isSpeaking ? Infinity : 0
            }}
          >
            {getStatusText()}
          </motion.p>
          
          <p className="text-sm text-gray-600 font-mono">
            {formatTime(duration)}
          </p>

          {volume > 0 && isListening && (
            <motion.div
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VolumeX className="w-3 h-3 text-gray-600" />
              <div className="w-16 md:w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  animate={{ width: `${volume}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <Volume2 className="w-3 h-3 text-gray-600" />
            </motion.div>
          )}
        </div>

        {/* AI indicator */}
        <motion.div
          className="flex items-center space-x-2 text-xs md:text-sm text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          <span>AI Voice Assistant</span>
        </motion.div>

        {/* Close button text instruction */}
        <motion.p
          className="text-xs text-gray-600 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Tap X to close voice chat
        </motion.p>
      </div>
    </div>
  );
}
