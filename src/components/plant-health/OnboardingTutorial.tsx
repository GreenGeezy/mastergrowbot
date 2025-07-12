import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X, Camera, Upload, Zap } from 'lucide-react';

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTutorial = ({ onComplete, onSkip }: OnboardingTutorialProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tutorialSlides = [
    {
      icon: <Camera className="w-12 h-12 text-green-400" />,
      title: "Instant Plant Scanning",
      description: "Tap the 'Scan Now' button to instantly capture and analyze your plant's health with AI-powered technology.",
      gradient: "from-green-500/20 to-blue-500/20"
    },
    {
      icon: <Upload className="w-12 h-12 text-blue-400" />,
      title: "Upload from Gallery",
      description: "Already have photos? Drag and drop or tap the upload area to analyze existing images from your device.",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
      title: "AI Health Analysis",
      description: "Get detailed plant health insights, growth recommendations, and expert advice in seconds using advanced AI.",
      gradient: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('plant-health-tutorial-completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('plant-health-tutorial-completed', 'true');
    onSkip();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Quick Tutorial</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSkip}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Slide Content */}
        <div className={`p-8 bg-gradient-to-br ${tutorialSlides[currentSlide].gradient} min-h-[300px] flex flex-col justify-center`}>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {tutorialSlides[currentSlide].icon}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">
                {tutorialSlides[currentSlide].title}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {tutorialSlides[currentSlide].description}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="px-6 py-4">
          <div className="flex justify-center space-x-2 mb-4">
            {tutorialSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-green-400 w-6' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <span className="text-gray-400 text-sm">
              {currentSlide + 1} of {tutorialSlides.length}
            </span>

            <Button
              onClick={nextSlide}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              {currentSlide === tutorialSlides.length - 1 ? 'Get Started' : 'Next'}
              {currentSlide < tutorialSlides.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingTutorial;