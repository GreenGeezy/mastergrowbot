import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

interface TooltipStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: TooltipStep[] = [
  {
    target: '[href="/plant-health"]',
    title: 'Scan Your Plants',
    description: 'Use Plant Health to instantly diagnose issues and get expert advice',
    position: 'top'
  },
  {
    target: '[href="/chat"]', 
    title: 'Chat with AI',
    description: 'Get personalized growing tips from our AI assistant',
    position: 'top'
  },
  {
    target: '[href="/grow-guide"]',
    title: 'Explore Guides', 
    description: 'Find answers to common growing questions',
    position: 'top'
  }
];

export default function OnboardingTooltips() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const seen = localStorage.getItem('mg_onboarding_completed');
    if (!seen) {
      // Delay to ensure page is loaded
      setTimeout(() => setIsVisible(true), 2000);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('mg_onboarding_completed', 'true');
    setHasSeenOnboarding(true);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (hasSeenOnboarding || !isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);
  
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  
  const getTooltipStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      zIndex: 9999,
      maxWidth: '280px'
    };

    switch (currentStepData.position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: window.innerHeight - rect.top + 10,
          left: rect.left + (rect.width / 2),
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: rect.bottom + 10,
          left: rect.left + (rect.width / 2),
          transform: 'translateX(-50%)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
        onClick={handleSkip}
      />
      
      {/* Highlight target element */}
      <div
        className="fixed border-2 border-primary rounded-lg z-[9999] animate-pulse"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          pointerEvents: 'none'
        }}
      />

      {/* Tooltip */}
      <div 
        className="bg-white rounded-xl shadow-card border premium-card p-4 animate-scale-in"
        style={getTooltipStyle()}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground text-sm">
            {currentStepData.title}
          </h3>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {currentStepData.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSkip}
              className="text-xs"
            >
              Skip
            </Button>
            <Button 
              size="sm" 
              onClick={handleNext}
              className="text-xs interactive-element"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Got it!' : 'Next'}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}