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
  return <div className="w-full flex flex-col items-center mb-2 sm:mb-4 animate-fade-in circuit-background min-h-[75vh] flex justify-center px-4">
      {/* Logo Section */}
      <motion.div className="relative group mb-6 sm:mb-8" initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.6,
      ease: "easeOut"
    }}>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-60 group-hover:opacity-90 transition duration-1000 group-hover:duration-200" />
        <a href="https://www.mastergrowbot.com" className="block">
          <div className="relative bg-card/80 p-3 sm:p-6 rounded-full backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500 shadow-2xl">
            <img src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" alt="Master Growbot Logo" className={`transform group-hover:scale-105 transition-transform duration-500 ${isMobile ? 'w-16 h-16' : 'w-20 h-20 sm:w-28 sm:h-28'}`} loading="lazy" width={112} height={112} />
          </div>
        </a>
      </motion.div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto text-center px-2 sm:px-4">
        <motion.div className="space-y-4 sm:space-y-6" initial={{
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
            <h1 className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow animate-fade-in tracking-tight tech-font will-change-transform leading-tight ${isMobile ? 'text-2xl' : 'text-3xl sm:text-6xl'}`}>
              MasterGrowbot AI
            </h1>
            <p className={`text-white/90 font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
              AI Cannabis Cultivation Assistant
            </p>
          </div>
          
          {/* Main Headline with Combined Text */}
          <div className="space-y-2">
            <h2 className={`font-bold leading-tight max-w-[720px] mx-auto text-white ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
              Grow Award-Winning Cannabis & Save Plants in Seconds – Free 3-Day Trial
            </h2>
            <p className={`font-semibold text-gold max-w-[600px] mx-auto ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
              Prevent $336/Plant to Over $100,000 per Harvest in Losses – Start Your Free Trial Now
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="space-y-3 sm:space-y-4">
            <p className={`text-center font-medium text-gold ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
              Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
            </p>
            
            <motion.div className="flex items-center justify-center space-x-2 sm:space-x-3" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.5
          }}>
              <Award className={`text-gold animate-float will-change-transform ${isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => <Star key={index} className={`fill-gold text-gold ${isMobile ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />)}
              </div>
            </motion.div>
          </div>
          
          {/* Plant Comparison Image */}
          <PlantComparison />
          
          {/* CTA Button */}
          <motion.div className="pt-2 sm:pt-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }}>
            <Link to="/quiz" className="inline-block">
              <motion.button onClick={handleCTAClick} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className={`relative overflow-hidden font-semibold text-black rounded-xl transition-all duration-300 flex items-center justify-center group shadow-2xl ${isMobile ? 'text-base py-3 px-6 min-w-[240px]' : 'text-lg py-4 px-8 min-w-[280px]'}`} style={{
              background: 'linear-gradient(135deg, #00ff95 0%, #4cff79 100%)'
            }}>
                {/* Discount Badge */}
                <motion.div className="absolute -top-3 -right-3 bg-gradient-to-r from-gold to-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg z-20" initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                delay: 0.8,
                type: "spring"
              }}>
                  Try it For Free
                </motion.div>
                
                {/* Neon glow effect */}
                <motion.div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(135deg, #00ff95 0%, #4cff79 100%)',
                filter: 'blur(8px)'
              }} animate={{
                opacity: isHovered ? [0.5, 0.8, 0.5] : 0
              }} transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut"
              }} />
                
                <span className="relative z-10 flex items-center">
                  Save My Plants
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
          </motion.div>

          {/* Footer Links */}
          <motion.div className={`pt-4 sm:pt-6 text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.8
        }}>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>;
};
export default Header;