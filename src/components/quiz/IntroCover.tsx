import React from 'react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import TestimonialCarousel from '@/components/TestimonialCarousel';
interface IntroCoverProps {
  onStartQuiz: () => void;
}
const IntroCover: React.FC<IntroCoverProps> = ({
  onStartQuiz
}) => {
  return <div className="min-h-screen bg-white circuit-background relative overflow-hidden">
      {/* Content with top padding to replace header */}
      <div className="pt-4">
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
        backgroundImage: "url('/assets/336-banner.png')",
        backgroundPosition: 'center top'
      }} />
      
      <div className="container mx-auto px-4 py-2 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-3 mt-2 md:mt-4">
            {/* Main Headline with Animated Halo */}
            <div className="relative">
              {/* Animated radial-gradient halo */}
              <div className="absolute inset-0 -m-8 rounded-full opacity-30 animate-pulse" style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, transparent 70%)',
                width: '400px',
                height: '400px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              <h1 className="text-headline font-display text-foreground text-center leading-tight relative z-10">
                Stop Losing <span className="text-destructive">$336 per plant</span> and up to <span className="text-destructive">$100,000 per Harvest</span> in 10 Seconds with a pic
              </h1>
            </div>
            
            {/* Sub-headline */}
            <p className="text-body-secondary font-body max-w-3xl mx-auto leading-relaxed text-center">Answer 4 quick questions to unlock your first personalised AI Action Card. Save your grow from dangerous pests and dieseases to take your 1st step to Growing Award Winning Buds with AI</p>
            
            {/* Primary CTA Button with Glassmorphism */}
            <div className="pt-8">
              <Button onClick={onStartQuiz} variant="cta" size="lg" className="px-12 py-6 text-xl font-bold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.5 5.5L15.5 12L8.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Start 60-Second Quiz
              </Button>
            </div>
            
            {/* Testimonial Carousel */}
            <div className="pt-4">
              <TestimonialCarousel />
            </div>
            
            {/* Additional visual elements */}
            <div className="pt-12 flex justify-center items-center space-x-2 text-gray-700 dark:text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-label font-body">No signup required to start</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
      </div>
      <BottomNavigation />
    </div>;
};
export default IntroCover;