import React, { useState, useEffect } from 'react';
import { Star, Award, Users, Tag, ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isIOSPreview } from "@/utils/flags";
import { useHapticFeedback } from "@/utils/hapticFeedback";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export default function PricingCards() {
  const [timeLeft, setTimeLeft] = useState("");
  const isIOSPreviewMode = isIOSPreview;
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();

  useEffect(() => {
    const targetDate = new Date('2025-07-01T23:59:59.000Z');
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDiff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff % (1000 * 60 * 60) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Offer expired");
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePlanClick = () => {
    haptic.medium();
  };

  const handleRestorePurchase = () => {
    haptic.light();
    // Handle restore purchase logic here
  };

  // Don't render pricing cards in iOS preview mode
  if (isIOSPreviewMode) {
    return null;
  }

  const benefits = [
    'Grow Bigger Buds & Higher Yields with AI',
    'Stack Cash & SuperCharge Profits',
    'Improve Quality & Increase Potency'
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-gold">
          <Users className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <span className={`font-semibold text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
            Join Our Community of Elite Cannabis Cultivators and AI Enthusiasts
          </span>
        </div>
        <p className={`text-center font-medium text-gold ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
          Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
        </p>
      </div>

      <motion.div 
        className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className={`text-white font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
          Unlock 25% Off Monthly & Over 60% Off Yearly—Offer Ends 7/10/25!
        </p>
        <p className={`text-gold font-mono font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>
          {timeLeft}
        </p>
      </motion.div>
      
      <div className="flex flex-col gap-4 items-stretch justify-center w-full max-w-md mx-auto">
        {/* Weekly Plan */}
        <motion.div 
          className="bg-gradient-to-b from-card/90 to-card/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-white font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Weekly Plan
                </h3>
                <div className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Master Growbot
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-gold to-yellow-400 text-black border-0 px-2 py-1 text-xs font-bold">
                3 Days Free
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`text-white font-bold ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                  $9.99
                </div>
              </div>
              <div className={`text-white/60 ${isMobile ? 'text-sm' : 'text-base'}`}>
                /week after 3-day free trial
              </div>
            </div>
            
            <div className="space-y-2 mb-6 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className={`flex items-start text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  <span className="mr-2 text-primary">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className={`text-center mb-4 text-gold font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              3 Days Free – Auto-Renew, Cancel Anytime
            </div>
            
            <motion.button
              onClick={handlePlanClick}
              className={`w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center ${isMobile ? 'py-3 px-4 text-sm' : 'py-4 px-6 text-base'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
              <ArrowRight className={`ml-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Monthly Plan */}
        <motion.div 
          className="bg-gradient-to-b from-card/90 to-card/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-white font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Monthly Plan
                </h3>
                <div className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Master Growbot
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-accent to-secondary text-white border-0 px-2 py-1 text-xs font-bold">
                Save 25%
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`text-white font-bold ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                  $29.99
                </div>
              </div>
              <div className={`text-white/60 ${isMobile ? 'text-sm' : 'text-base'}`}>
                /month after 3-day free trial
              </div>
            </div>
            
            <div className="space-y-2 mb-6 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className={`flex items-start text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  <span className="mr-2 text-primary">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className={`text-center mb-4 text-gold font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              3 Days Free – Auto-Renew, Cancel Anytime
            </div>
            
            <motion.button
              onClick={handlePlanClick}
              className={`w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center ${isMobile ? 'py-3 px-4 text-sm' : 'py-4 px-6 text-base'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
              <ArrowRight className={`ml-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Yearly Plan - Best Value */}
        <motion.div 
          className="bg-gradient-to-b from-card/90 to-card/60 backdrop-blur-xl rounded-2xl border-2 border-gold shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-white font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Yearly Plan
                </h3>
                <div className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Master Growbot
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-gold to-yellow-400 text-black border-0 px-2 py-1 text-xs font-bold">
                Save 60%
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`text-white font-bold ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                  $199.99
                </div>
              </div>
              <div className={`text-white/60 ${isMobile ? 'text-sm' : 'text-base'}`}>
                /year after 3-day free trial
              </div>
            </div>
            
            <div className="space-y-2 mb-6 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className={`flex items-start text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  <span className="mr-2 text-primary">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className={`text-center mb-4 text-gold font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              3 Days Free – Auto-Renew, Cancel Anytime
            </div>
            
            <motion.button
              onClick={handlePlanClick}
              className={`w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center ${isMobile ? 'py-3 px-4 text-sm' : 'py-4 px-6 text-base'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
              <ArrowRight className={`ml-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Restore Purchase Link */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleRestorePurchase}
          className={`text-white/60 hover:text-white transition-colors duration-300 flex items-center ${isMobile ? 'text-sm' : 'text-base'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          Restore Purchase
        </motion.button>
      </div>
    </div>
  );
}
