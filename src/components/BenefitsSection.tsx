import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/utils/hapticFeedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, DollarSign, Award, Search } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';

// Import generated images
import cannabisBeforeAfter from '@/assets/cannabis-before-after.jpg';
import cashProfitsIcon from '@/assets/cash-profits-icon.jpg';
import potencyMeterIcon from '@/assets/potency-meter-icon.jpg';
import confidenceScanIcon from '@/assets/confidence-scan-icon.jpg';
interface BenefitCard {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
}
const benefits: BenefitCard[] = [{
  id: 'bigger-buds',
  title: 'Bigger Harvests & Higher Yields',
  description: 'Grow premium quality, healthy, and thriving plants with AI Machine Vision for instant photo scans, vast strain genetics databases for tailored nutrient plans, and cannabinoid/terpene profiles to pump up bud size and volume.',
  details: 'Stop devastating setbacks before they hit with AI-driven weekly checks and targeted treatments like neem oil, customized to your grow.',
  image: cannabisBeforeAfter,
  icon: <Zap className="w-6 h-6" />,
  gradientFrom: 'from-primary',
  gradientTo: 'to-accent'
}, {
  id: 'stack-cash',
  title: 'Maximize Revenue & Boost Profits',
  description: 'Ignite earnings growth through powerful AI optimization, advanced strain databases, and smart tips that eliminate waste and crush stalls.',
  details: 'Tap into 95% accurate scans for proactive detection and easy fixes that protect your crop and multiply returns without the guesswork.',
  image: cashProfitsIcon,
  icon: <DollarSign className="w-6 h-6" />,
  gradientFrom: 'from-gold',
  gradientTo: 'to-yellow-400'
}, {
  id: 'improve-quality',
  title: 'Improve Plant Health & Quality',
  description: 'Boost plant power and premium results with AI precision tools for IPM, pH balance, nutrients, and environment—all fueled by rich cannabinoid and terpene insights.',
  details: 'Get instant, spot-on guidance from your Genius Cannabis Growing Assistant, delivering custom fixes that elevate every batch.',
  image: potencyMeterIcon,
  icon: <Award className="w-6 h-6" />,
  gradientFrom: 'from-accent',
  gradientTo: 'to-secondary'
}, {
  id: 'ai-analysis',
  title: 'AI-Powered Plant Analysis',
  description: 'Snap a photo → unlock AI Machine Vision for rapid 95% confident diagnoses, step-by-step plans, and ongoing health tracking.',
  details: 'Eliminate risks before they destroy your success, backed by massive databases that keep yields soaring and quality unmatched.',
  image: confidenceScanIcon,
  icon: <Search className="w-6 h-6" />,
  gradientFrom: 'from-secondary',
  gradientTo: 'to-primary'
}];
export default function BenefitsSection() {
  const isMobile = useIsMobile();
  const haptic = useHapticFeedback();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  const handleCardClick = (cardId: string) => {
    haptic.medium();
    setActiveCard(activeCard === cardId ? null : cardId);
  };
  const handleQuizClick = () => {
    haptic.heavy();
    // Navigate to quiz
    window.location.href = '/quiz';
  };
  return <div ref={ref} className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{
      opacity: 0,
      y: 30
    }} animate={isInView ? {
      opacity: 1,
      y: 0
    } : {}} transition={{
      duration: 0.6
    }} className="text-center mb-8">
        <h2 className={`text-headline-sm font-display text-foreground mb-4 ${isMobile ? 'text-headline-sm' : 'text-headline-md'}`}>
          Transform Your Cannabis Growing Experience
        </h2>
        <p className={`text-gray-600 mb-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Unlock elite harvests with cutting-edge AI that saves your plants, amplifies yields, and drives massive profits—right from your tablet or phone.
        </p>
        <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 text-sm font-semibold">
          Prevent $336/Plant Losses and Over $100,000 per Harvest
        </Badge>
      </motion.div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} mb-8`}>
        {benefits.map((benefit, index) => <motion.div key={benefit.id} initial={{
        opacity: 0,
        y: 50
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.5,
        delay: index * 0.1
      }} className="h-full">
            <Card className={`bg-gray-50 backdrop-blur-xl border-gray-200 cursor-pointer premium-card interactive-element ${activeCard === benefit.id ? 'ring-2 ring-green-500' : ''}`} onClick={() => handleCardClick(benefit.id)}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${benefit.gradientFrom} ${benefit.gradientTo}`}>
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-body font-body text-foreground mb-2 font-semibold ${isMobile ? 'text-body' : 'text-lg'}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-gray-600 mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {benefit.description}
                    </p>
                    <p className={`text-amber-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {benefit.details}
                    </p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-lg">
                  {benefit.id === 'bigger-buds' ? <BeforeAfterSlider className="w-full h-32" /> : <>
                      <img src={benefit.image} alt={benefit.title} className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${benefit.gradientFrom} ${benefit.gradientTo}`}>
                        <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </>}
                </div>
              </CardContent>
            </Card>
          </motion.div>)}
      </div>

      <motion.div initial={{
      opacity: 0,
      y: 30
    }} animate={isInView ? {
      opacity: 1,
      y: 0
    } : {}} transition={{
      duration: 0.6,
      delay: 0.4
    }} className="text-center flex justify-center">
        <Button onClick={handleQuizClick} className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 pulse-glow flex flex-col items-center justify-center leading-tight ${isMobile ? 'px-8 py-6 text-lg' : 'px-12 py-8 text-xl'}`}>
          <div className="flex items-center justify-center">
            <Zap className={`mr-2 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <span>Unlock These Benefits</span>
          </div>
          <div className="flex items-center justify-center">
            <span>Start Free Quiz</span>
            <ChevronRight className={`ml-2 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
        </Button>
        
        <p className={`text-amber-600 mt-0 ${isMobile ? 'text-sm' : 'text-base'}`}>3 Days Free Trial </p>
      </motion.div>
    </div>;
}