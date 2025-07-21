import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

interface WalkthroughTooltipProps {
  targetRef: React.RefObject<HTMLElement>;
  title: string;
  description: string;
  step: number;
  totalSteps: number;
}

export function WalkthroughTooltip({ 
  targetRef, 
  title, 
  description, 
  step, 
  totalSteps 
}: WalkthroughTooltipProps) {
  const { nextStep, skipWalkthrough } = useWalkthrough();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate position relative to target element
  const calculatePosition = () => {
    if (!targetRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    // Position tooltip below the target element with some padding
    const tooltipTop = targetRect.bottom + scrollY + 12;
    const tooltipLeft = Math.max(16, 
      Math.min(
        window.innerWidth - 320, // tooltip width
        targetRect.left + scrollX + (targetRect.width / 2) - 160 // centered
      )
    );

    setPosition({ top: tooltipTop, left: tooltipLeft });
    setIsVisible(true);
  };

  useEffect(() => {
    if (targetRef.current) {
      calculatePosition();
      
      // Recalculate on scroll and resize
      const handleResize = () => calculatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [targetRef]);

  // Scroll target into view
  useEffect(() => {
    if (targetRef.current && isVisible) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [isVisible, targetRef]);

  if (!isVisible) return null;

  const overlay = (
    <>
      {/* Dark background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={skipWalkthrough}
      />
      
      {/* Highlight ring around target element */}
      {targetRef.current && (
        <div
          className="fixed z-[9999] pointer-events-none border-2 border-primary rounded-lg shadow-lg shadow-primary/20"
          style={{
            top: targetRef.current.getBoundingClientRect().top + window.scrollY - 4,
            left: targetRef.current.getBoundingClientRect().left + window.scrollX - 4,
            width: targetRef.current.getBoundingClientRect().width + 8,
            height: targetRef.current.getBoundingClientRect().height + 8,
          }}
        />
      )}

      {/* Tooltip bubble */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-80 max-w-[calc(100vw-32px)] bg-background border border-border rounded-lg shadow-lg p-4"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Arrow pointing to target */}
        <div 
          className="absolute -top-2 w-4 h-4 bg-background border-l border-t border-border rotate-45 transform"
          style={{
            left: '50%',
            marginLeft: '-8px'
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {step}
            </div>
            <span className="text-xs text-muted-foreground">
              {step} of {totalSteps}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipWalkthrough}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipWalkthrough}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip tutorial
          </Button>
          <Button
            onClick={nextStep}
            size="sm"
            className="space-x-2"
          >
            <span>{step === totalSteps ? 'Finish' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}