
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/chat/ChatHeader';
import TestimonialCarousel from '@/components/TestimonialCarousel';

interface IntroCoverProps {
  onStartQuiz: () => void;
}

const IntroCover: React.FC<IntroCoverProps> = ({ onStartQuiz }) => {
  return (
    <div className="min-h-screen bg-white circuit-background relative overflow-hidden">
      <ChatHeader />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          backgroundImage: "url('/assets/336-banner.png')",
          backgroundPosition: 'center top'
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8 mt-16 md:mt-24">
            {/* Main Headline with Animated Halo */}
            <div className="relative">
              {/* Animated radial-gradient halo */}
              <div 
                className="absolute inset-0 -m-8 rounded-full opacity-30 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, transparent 70%)',
                  width: '400px',
                  height: '400px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              />
              
              <h1 className="text-4xl md:text-6xl font-bold tech-font tracking-tight leading-tight relative z-10 text-gray-900"
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                Stop Losing <span className="text-[#ef4444]">$336 per plant</span> and up to <span className="text-[#ef4444]">$100,000 per Harvest</span> in 10 Seconds with just a pic
              </h1>
            </div>
            
            {/* Sub-headline */}
            <p className="text-base text-gray-700 dark:text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Answer four quick questions to unlock your first personalised AI Action Card—and prevent $336 in hidden losses.
            </p>
            
            {/* Primary CTA Button with Glassmorphism */}
            <div className="pt-8">
              <Button 
                onClick={onStartQuiz}
                className="px-12 py-6 text-xl font-bold text-white hover:scale-105 transform transition-all duration-300"
                style={{
                  backgroundColor: '#16a34a',
                  border: 'none'
                }}
              >
                Start 60-Second Quiz
              </Button>
            </div>
            
            {/* Testimonial Carousel */}
            <div className="pt-8">
              <TestimonialCarousel />
            </div>
            
            {/* Additional visual elements */}
            <div className="pt-12 flex justify-center items-center space-x-2 text-gray-700 dark:text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">No signup required to start</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroCover;
