import React, { useState, useEffect } from 'react';
import { Star, Award, Users, Tag, ArrowRight, RefreshCw, CheckCircle, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    const targetDate = new Date('2026-04-20T23:59:59.000Z');
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

  // Temporarily disabled iOS preview check for debugging
  // if (isIOSPreviewMode) {
  //   return null;
  // }

  const benefits = ['Grow Bigger Buds & Higher Yields with AI', 'Stack Cash & SuperCharge Profits', 'Improve Quality & Increase Potency'];
  const testimonials = ["Transformed my harvest!", "Doubled my yield in one season!", "Best investment for any grower!"];
  return <div className="w-full space-y-6">
      {/* Progress Indicator */}
      <div className="text-center">
        <h2 className="text-[#111827] font-bold text-xl">
          Quiz Complete – Claim Your Plan
        </h2>
      </div>

      

      <motion.div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-center" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <p className={`text-white font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
          Unlock 25% Off Monthly & Over 60% Off Yearly—Offer Ends 7/10/25!
        </p>
        <p className={`text-gold font-mono font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>
          {timeLeft}
        </p>
      </motion.div>

      {/* Consolidated Benefits */}
      <div className="bg-[#f9fafb] rounded-xl p-4 border border-[#e5e7eb]">
        <h3 className="text-[#111827] font-semibold mb-3 text-center">
          What You'll Get:
        </h3>
        <div className="space-y-2">
          {benefits.map((benefit, index) => <div key={index} className="flex items-start text-[#4b5563]">
              <CheckCircle className="mr-2 w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>)}
        </div>
      </div>

      {/* Plan Accordion */}
      <Accordion type="single" defaultValue="yearly" className="w-full max-w-md mx-auto">
        {/* Weekly Plan */}
        <AccordionItem value="weekly">
          <AccordionTrigger className="bg-[#f9fafb] px-4 py-3 rounded-t-xl border border-[#e5e7eb] hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <h3 className="text-[#111827] font-bold">Weekly Plan</h3>
                <p className="text-[#4b5563] text-sm">$9.99/week</p>
              </div>
              <Badge className="bg-[#16a34a] text-white px-3 py-1 text-sm font-bold">
                3 Days Free
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-[#ffffff] px-4 pb-4 border-x border-b border-[#e5e7eb] rounded-b-xl">
            <div className="text-center mb-4">
              <div className="text-[#4b5563] text-sm mb-3">
                After 3-day free trial
              </div>
              <div className="text-[#4b5563] text-sm mb-4">
                3 Days Free – Auto-Renew, Cancel Anytime
              </div>
              <div className="flex items-center gap-2">
                <motion.button onClick={handlePlanClick} className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-[#ffffff] font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center h-14" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  Start 3-Day Free Trial Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <div className="bg-[#ef4444] text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  Limited Time Offer
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <div className="flex items-center space-x-1 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1">
                  <Shield className="w-3 h-3 text-[#4b5563]" />
                  <span className="text-[#4b5563] text-xs">Secure via Apple Pay</span>
                </div>
                <div className="flex items-center space-x-1 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1">
                  <Clock className="w-3 h-3 text-[#4b5563]" />
                  <span className="text-[#4b5563] text-xs">Cancel Anytime – No Hassle</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Monthly Plan */}
        <AccordionItem value="monthly">
          <AccordionTrigger className="bg-[#f9fafb] px-4 py-3 border border-[#e5e7eb] hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <h3 className="text-[#111827] font-bold">Monthly Plan</h3>
                <p className="text-[#4b5563] text-sm">$29.99/month</p>
              </div>
              <Badge className="bg-[#f97316] text-white px-4 py-2 text-sm font-bold">
                Save 25%
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-[#ffffff] px-4 pb-4 border-x border-b border-[#e5e7eb]">
            <div className="text-center mb-4">
              <div className="text-[#4b5563] text-sm mb-3">
                After 3-day free trial
              </div>
              <div className="text-[#4b5563] text-sm mb-4">
                3 Days Free – Auto-Renew, Cancel Anytime
              </div>
              <div className="flex items-center gap-2">
                <motion.button onClick={handlePlanClick} className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-[#ffffff] font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center h-14" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  Start 3-Day Free Trial Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <div className="bg-[#ef4444] text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  Limited Time Offer
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <div className="flex items-center space-x-1 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1">
                  <Shield className="w-3 h-3 text-[#4b5563]" />
                  <span className="text-[#4b5563] text-xs">Secure via Apple Pay</span>
                </div>
                <div className="flex items-center space-x-1 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1">
                  <Clock className="w-3 h-3 text-[#4b5563]" />
                  <span className="text-[#4b5563] text-xs">Cancel Anytime – No Hassle</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Yearly Plan - Default Expanded */}
        <AccordionItem value="yearly">
          <AccordionTrigger className="bg-[#f9fafb] px-4 py-3 rounded-t-xl border-2 border-[#16a34a] hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <h3 className="text-[#111827] font-bold">Yearly Plan <span className="text-[#16a34a]">• Recommended</span></h3>
                <p className="text-[#4b5563] text-sm">$199.99/year</p>
              </div>
              <Badge className="bg-[#f97316] text-white px-4 py-2 text-lg font-bold">
                Save 60%
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-[#ffffff] px-4 pb-4 border-x-2 border-b-2 border-[#16a34a] rounded-b-xl">
            <div className="text-center mb-4">
              <div className="text-[#4b5563] text-sm mb-3">
                After 3-day free trial
              </div>
              <div className="text-[#4b5563] text-sm mb-4">
                3 Days Free – Auto-Renew, Cancel Anytime
              </div>
              <div className="flex items-center gap-2">
                <motion.button onClick={handlePlanClick} className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-[#ffffff] font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center h-14" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  Start 3-Day Free Trial Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <div className="bg-[#ef4444] text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  Limited Time Offer
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <div className="flex items-center space-x-1 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1">
                  <Shield className="w-3 h-3 text-[#4b5563]" />
                  <span className="text-[#4b5563] text-xs">Secure via Apple Pay</span>
                </div>
                <div className="flex items-center space-x-1 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1">
                  <Clock className="w-3 h-3 text-[#4b5563]" />
                  <span className="text-[#4b5563] text-xs">Cancel Anytime – No Hassle</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Restore Purchase Link */}
      <div className="flex justify-center">
        <motion.button onClick={handleRestorePurchase} className="text-[#4b5563] hover:text-[#111827] transition-colors duration-300 flex items-center text-sm" whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }}>
          <RefreshCw className="mr-2 w-4 h-4" />
          Restore Purchase
        </motion.button>
      </div>
    </div>;
}