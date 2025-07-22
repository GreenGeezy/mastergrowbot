
import React from 'react';
import { Quote, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import PricingCards from '@/components/PricingCards';

const testimonials = [
  {
    text: "I've watched this team pioneer machine-learning for cultivation and extraction. They're the undisputed OGs of AI cannabis.",
    role: "Cannabis Visionary"
  },
  {
    text: "Introduced as the 'Steve Jobs of Cannabis' moments before winning Best New Technology Company at a major university-backed venture challenge.",
    role: "Founder, Cannabis Consulting Firm"
  },
  {
    text: "After the demo, several leading VCs said, 'That might be the smartest mind in cannabis.'",
    role: "Investor & AgTech Founder"
  },
  {
    text: "The presentation showed exactly how AI is set to redefine canna-business.",
    role: "Forbes Business Development Council Member"
  },
  {
    text: "Spot-on advice. Even when my canopy grew millimeters from the lights, the system kept everything on track.",
    role: "Commercial Grower"
  },
  {
    text: "Brilliant technology—letting AI watch over the plants is a total game-changer.",
    role: "Legacy Cultivator"
  },
  {
    text: "Wow! One snapshot diagnoses every issue. It's like having a magic eye in the garden—can't wait to see how much this boosts my results.",
    role: "Indoor Hobbyist"
  },
  {
    text: "Signed up on the spot. This industry has needed something like this for a long time.",
    role: "First-Time Grower"
  }
];

interface PreviewStepProps {
  onContinueToCheckout: () => void;
  onBackToQuestions: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ onContinueToCheckout, onBackToQuestions }) => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true
    },
    [Autoplay({ delay: 2000, stopOnInteraction: true })]
  );

  return (
    <div className="space-y-8 text-center">
      {/* Hero Image with Animation */}
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/3-modules.png" 
          alt="AI Action Card Preview" 
          className="w-3/5 blur-sm rounded-2xl animate-float"
        />
      </div>

      {/* Heading and Sub-copy */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
          Ready to reclaim the missing 13–20% yield?
        </h2>
        <p className="text-lg text-gray-700 dark:text-white/80">
          Your AI Action Card is ready—complete with gram-gain predictions.
        </p>
      </div>

      {/* Testimonial Carousel */}
      <div className="max-w-2xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Quote size={32} className="text-[#B24BF3]" />
                   <blockquote className="text-gray-900 dark:text-white text-base leading-relaxed">
                     "{testimonial.text}"
                   </blockquote>
                   <cite className="text-purple-600 dark:text-purple-300 text-sm font-bold uppercase tracking-wide">
                     — {testimonial.role}
                   </cite>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="max-w-4xl mx-auto">
        <PricingCards />
      </div>

      {/* Back to Questions Link */}
      <div className="mt-8">
        <button 
          onClick={onBackToQuestions}
          className="flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to questions
        </button>
      </div>
    </div>
  );
};

export default PreviewStep;
