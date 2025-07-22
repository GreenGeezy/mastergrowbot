import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHapticFeedback } from '@/utils/hapticFeedback';
import { useIsMobile } from '@/hooks/use-mobile';
import cannabisBeforeAfter from '@/assets/cannabis-before-after.jpg';

interface BeforeAfterSliderProps {
  className?: string;
}

export default function BeforeAfterSlider({ className = '' }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    haptic.light();
    updateSliderPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    haptic.light();
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    haptic.medium();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    haptic.medium();
  };

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg cursor-col-resize select-none premium-card ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Before Image (Right side) */}
      <div className="absolute inset-0">
        <img
          src={cannabisBeforeAfter}
          alt="Unhealthy cannabis plant"
          className="w-full h-full object-cover"
          style={{
            filter: 'sepia(100%) saturate(150%) hue-rotate(25deg) brightness(0.8)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 bg-red-500/90 backdrop-blur-sm rounded px-2 py-1">
          <span className={`text-white font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Before
          </span>
        </div>
      </div>

      {/* After Image (Left side) */}
      <div 
        className="absolute inset-0 transition-all duration-100"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={cannabisBeforeAfter}
          alt="Healthy cannabis plant"
          className="w-full h-full object-cover"
          style={{
            filter: 'saturate(120%) brightness(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur-sm rounded px-2 py-1">
          <span className={`text-white font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
            After
          </span>
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-100"
        style={{
          left: `${sliderPosition}%`,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Slider Handle */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-col-resize flex items-center justify-center"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full" />
        </motion.div>
      </div>

      {/* Instruction Text */}
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
        <span className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {isMobile ? 'Drag to compare' : 'Drag to see transformation'}
        </span>
      </div>
    </div>
  );
}