
import React, { useCallback, useEffect, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useHapticFeedback } from "@/utils/hapticFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true,
      containScroll: "trimSnaps"
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false }) as any]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      haptic.light();
    }
  }, [emblaApi, haptic]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      haptic.light();
    }
  }, [emblaApi, haptic]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-gray-50 py-4 px-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 via-transparent to-green-100/30 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h3 className={`text-headline-xs font-display text-foreground text-center leading-tight ${isMobile ? 'text-headline-xs' : 'text-headline-sm'}`}>
            See what First Time Growers, Large-Scale Cultivators, Hobbyists, Medical Researchers, and Botanists across the Cannabis Industry are saying about Master Growbot AI
          </h3>
        </motion.div>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`flex-[0_0_100%] min-w-0 ${isMobile ? 'px-2' : 'px-4'}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Neon border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
                    
                    <div className="relative bg-white backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-green-300 transition-all duration-500 max-w-[600px] mx-auto">
                      <div className="flex flex-col items-center text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="mb-4"
                        >
                          <Quote size={isMobile ? 28 : 32} className="text-green-600" />
                        </motion.div>
                        
                        <motion.blockquote
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className={`text-gray-900 font-medium leading-relaxed mb-4 ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}
                        >
                          "{testimonial.text}"
                        </motion.blockquote>
                        
                        <motion.cite
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className={`text-amber-600 font-bold uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-sm'}`}
                        >
                          — {testimonial.role}
                        </motion.cite>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows - only show on larger screens */}
          {!isMobile && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 border border-gray-200 hover:border-green-400 transition-all duration-300 group disabled:opacity-50"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 border border-gray-200 hover:border-green-400 transition-all duration-300 group disabled:opacity-50"
                onClick={scrollNext}
                disabled={!canScrollNext}
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
              </motion.button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-8 space-x-2"
        >
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-600 w-6' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              onClick={() => {
                if (emblaApi) {
                  emblaApi.scrollTo(index);
                  haptic.light();
                }
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
