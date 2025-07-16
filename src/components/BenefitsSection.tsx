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

const benefits: BenefitCard[] = [
  {
    id: 'bigger-buds',
    title: 'Grow Bigger Buds & Higher Yields',
    description: 'Maximize harvest with abundant buds using AI-powered analysis and nutrient schedules',
    details: 'Stop issues before $336 losses with weekly inspections and neem oil treatments',
    image: cannabisBeforeAfter,
    icon: <Zap className="w-6 h-6" />,
    gradientFrom: 'from-primary',
    gradientTo: 'to-accent'
  },
  {
    id: 'stack-cash',
    title: 'Stack Cash & SuperCharge Profits',
    description: 'Boost earnings by optimizing operations with Advanced Strain Database and yield-boost tips',
    details: 'Get 95% confidence scans and preventive actions to maximize your investment',
    image: cashProfitsIcon,
    icon: <DollarSign className="w-6 h-6" />,
    gradientFrom: 'from-gold',
    gradientTo: 'to-yellow-400'
  },
  {
    id: 'improve-quality',
    title: 'Improve Quality & Increase Potency',
    description: 'Elevate plant strength for superior product with Precision Tools like IPM and pH guidance',
    details: 'Access comprehensive nutrient management and environmental control systems',
    image: potencyMeterIcon,
    icon: <Award className="w-6 h-6" />,
    gradientFrom: 'from-accent',
    gradientTo: 'to-secondary'
  },
  {
    id: 'ai-analysis',
    title: 'AI-Powered Plant Analysis',
    description: 'Advanced 95% confidence scans with instant diagnosis and recommended actions',
    details: 'Real-time plant health monitoring with precision diagnostic tools',
    image: confidenceScanIcon,
    icon: <Search className="w-6 h-6" />,
    gradientFrom: 'from-secondary',
    gradientTo: 'to-primary'
  }
];

export default function BenefitsSection() {
  const isMobile = useIsMobile();
  const haptic = useHapticFeedback();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleCardClick = (cardId: string) => {
    haptic.medium();
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  const handleQuizClick = () => {
    haptic.heavy();
    // Navigate to quiz
    window.location.href = '/quiz';
  };

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className={`font-bold text-white mb-4 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          Transform Your Cannabis Growing Experience
        </h2>
        <p className={`text-white/80 mb-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Unlock professional-grade growing insights with AI-powered analysis
        </p>
        <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 text-sm font-semibold">
          Prevent $336/Plant Losses
        </Badge>
      </motion.div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} mb-8`}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <Card 
              className={`bg-card/80 backdrop-blur-xl border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeCard === benefit.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleCardClick(benefit.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${benefit.gradientFrom} ${benefit.gradientTo}`}>
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-white mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-white/80 mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {benefit.description}
                    </p>
                    <p className={`text-gold font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {benefit.details}
                    </p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-lg">
                  {benefit.id === 'bigger-buds' ? (
                    <BeforeAfterSlider className="w-full h-32" />
                  ) : (
                    <>
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${benefit.gradientFrom} ${benefit.gradientTo}`}>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center flex justify-center"
      >
        <Button
          onClick={handleQuizClick}
          className={`bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 pulse-glow flex flex-col items-center justify-center leading-tight ${
            isMobile ? 'px-8 py-6 text-lg' : 'px-12 py-8 text-xl'
          }`}
        >
          <div className="flex items-center justify-center">
            <Zap className={`mr-2 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <span>Unlock These Benefits</span>
          </div>
          <div className="flex items-center justify-center">
            <span>Start Free Quiz</span>
            <ChevronRight className={`ml-2 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
        </Button>
        
        <p className={`text-gold mt-0 ${isMobile ? 'text-sm' : 'text-base'}`}>
          3 Days Free Trial • No Credit Card Required
        </p>
      </motion.div>
    </div>
  );
}