
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/chat/ChatHeader';

interface IntroCoverProps {
  onStartQuiz: () => void;
}

const IntroCover: React.FC<IntroCoverProps> = ({ onStartQuiz }) => {
  return (
    <div className="min-h-screen bg-background circuit-background relative overflow-hidden">
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
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight leading-tight">
              6 clicks • 60 s → uncover the hidden leak costing growers up to <span className="text-[#00D4FF]">$336 per plant</span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed">
              Answer four quick questions to unlock your first personalised AI Action Card.
            </p>
            
            {/* Primary CTA Button */}
            <div className="pt-8">
              <Button 
                onClick={onStartQuiz}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Start 60-Second Quiz
              </Button>
            </div>
            
            {/* Additional visual elements */}
            <div className="pt-12 flex justify-center items-center space-x-2 text-white/60">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">No signup required to start</span>
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroCover;
