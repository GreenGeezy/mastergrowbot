
import React from 'react';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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

const TestimonialCarousel = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true
    },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  return (
    <section className="bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white text-xl sm:text-2xl font-bold text-center mb-8 leading-tight">
          See what First Time Growers, Large-Scale Cultivators, Hobbyists, Medical Researchers, and Botanists across the Cannabis Industry are saying about Master Growbot AI
        </h2>
        
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                <div className="flex flex-col items-center max-w-[600px] mx-auto text-center">
                  <Quote size={32} className="text-[#8a4fff] mb-4" />
                  <blockquote className="text-white text-base sm:text-lg leading-relaxed mb-4">
                    "{testimonial.text}"
                  </blockquote>
                  <cite className="text-[#8a4fff] text-sm font-bold uppercase tracking-wide">
                    — {testimonial.role}
                  </cite>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
