import React, { useState } from "react";
import { Award, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useHapticFeedback } from "@/utils/hapticFeedback";
import { useIsMobile } from "@/hooks/use-mobile";
import PlantComparison from "./PlantComparison";
const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();
  const handleCTAClick = () => {
    haptic.medium();
  };
  return <div className="w-full flex flex-col items-center mb-2 sm:mb-4 animate-fade-in circuit-background min-h-[75vh] flex justify-center px-4 bg-white">
      {/* Logo Section */}
      <motion.div className="relative group mb-2 sm:mb-3" initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.6,
      ease: "easeOut"
    }}>
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-1000 group-hover:duration-200" />
        <a href="https://www.mastergrowbot.com" className="block">
          <div className="relative bg-gray-100 p-3 sm:p-6 rounded-full backdrop-blur-xl ring-1 ring-gray-200 hover:ring-green-300 transition-all duration-500 shadow-2xl">
            <img src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" alt="Master Growbot Logo" className={`transform group-hover:scale-105 transition-transform duration-500 ${isMobile ? 'w-16 h-16' : 'w-20 h-20 sm:w-28 sm:h-28'}`} loading="lazy" width={112} height={112} />
          </div>
        </a>
      </motion.div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto text-center px-2 sm:px-4">
        <motion.div className="space-y-2 sm:space-y-3" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.2
      }}>
          {/* Headlines */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className={`text-headline font-display text-foreground animate-fade-in tracking-tight will-change-transform leading-tight ${isMobile ? 'text-headline-sm' : 'text-headline'}`}>MasterGrowbot AI</h1>
            <p className="text-body-secondary font-body text-lg">
              AI Cannabis Cultivation Assistant
            </p>
          </div>
          
          {/* Main Headline with Combined Text */}
          <div className="space-y-2">
            <h2 className={`text-headline-sm font-display text-foreground leading-tight max-w-[720px] mx-auto ${isMobile ? 'text-headline-sm' : 'text-headline-md'}`}>Grow Premium Quality Plants in Seconds with AI</h2>
            <p className="text-body-secondary font-body max-w-[600px] mx-auto leading-relaxed">Discover Why Top Growers Trust MasterGrowbot AI — where preventing losses of around $336 per plant, or up to $100,000 per harvest for large grows, is made possible with AI</p>
          </div>
          
          {/* Trust Indicators */}
          <div className="space-y-3 sm:space-y-4">
            
            <motion.div className="flex flex-col items-center justify-center space-y-1" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.5
          }}>
              <div className="flex items-center space-x-2 sm:space-x-3 relative">
                <Award className={`text-amber-600 animate-float will-change-transform ${isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => <Star key={index} className={`fill-amber-400 text-amber-400 ${isMobile ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />)}
                </div>
                {/* Try it For Free Badge */}
                <motion.div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg ml-4" initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                delay: 0.8,
                type: "spring"
              }}>
                  Try it For Free
                </motion.div>
              </div>
              <p className="text-sm text-gray-500">Trusted by growers worldwide</p>
            </motion.div>
          </div>
          
          {/* Plant Comparison Image */}
          <PlantComparison />
          
          {/* CTA Button */}
          <motion.div className="pt-1 sm:pt-2" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }}>
            <div className="relative inline-block">
              <Link to="/quiz" className="inline-block">
                <motion.button onClick={handleCTAClick} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} className={`relative overflow-hidden font-semibold text-white rounded-xl transition-all duration-300 flex items-center justify-center group ${isMobile ? 'text-base py-3 px-6 min-w-[240px]' : 'text-lg py-4 px-8 min-w-[280px]'}`} style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2)'
              }}>
                  {/* Enhanced neon glow effect */}
                  <motion.div className="absolute -inset-1 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                  filter: 'blur(12px)'
                }} animate={{
                  opacity: isHovered ? [0.6, 1, 0.6] : 0.4
                }} transition={{
                  duration: 2,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut"
                }} />
                  
                  <span className="relative z-10 flex items-center">
                    Save My Plants with AI
                    <motion.div animate={{
                    x: isHovered ? 4 : 0
                  }} transition={{
                    duration: 0.2
                  }}>
                      <ArrowRight className={`ml-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
              
              {/* 3 Days Free Badge */}
              <motion.div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white" initial={{
              scale: 0,
              rotate: 12
            }} animate={{
              scale: 1,
              rotate: 12
            }} transition={{
              delay: 0.8,
              type: "spring",
              stiffness: 200
            }}>
                3 Days Free
              </motion.div>
            </div>
          </motion.div>

          {/* Footer Links */}
          <motion.div className={`pt-4 sm:pt-6 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.8
        }}>
            <Link to="/privacy-policy" className="hover:text-green-600 transition-colors mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-green-600 transition-colors">
              Terms of Service
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>;
};
export default Header;