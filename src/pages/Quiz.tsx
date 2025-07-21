import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { QuizResponse } from '@/types/quiz';
import { Star, Award, Users, MessageCircle, Camera, BookOpen, Tag, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TestimonialCarousel from '@/components/TestimonialCarousel';
import IntroCover from '@/components/quiz/IntroCover';
import PreviewStep from '@/components/quiz/PreviewStep';
import { SparklesCore } from '@/components/ui/sparkles';
const TEMP_QUIZ_RESPONSES_KEY = 'mg_temp_quiz_responses';
const safeJsonParse = (jsonString: string | null, fallback: any = {}) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON from session storage:', e);
    return fallback;
  }
};
export default function Quiz() {
  const session = useSession();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [showIntroCover, setShowIntroCover] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [currentProofIndex, setCurrentProofIndex] = useState(0);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [quizResponses, setQuizResponses] = useState<Partial<QuizResponse>>(() => {
    try {
      const savedResponses = sessionStorage.getItem(TEMP_QUIZ_RESPONSES_KEY);
      return savedResponses ? safeJsonParse(savedResponses, {
        goals: [],
        experience_level: undefined,
        growing_method: undefined,
        plant_quantity: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined
      }) : {
        goals: [],
        experience_level: undefined,
        growing_method: undefined,
        plant_quantity: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined
      };
    } catch (error) {
      console.error('Error initializing quiz responses:', error);
      return {
        goals: [],
        experience_level: undefined,
        growing_method: undefined,
        plant_quantity: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined
      };
    }
  });
  const [globalTimeLeft, setGlobalTimeLeft] = useState("");
  const proofTickers = ["📈 2022 Univ. of Guelph greenhouse trial: AI tools ↑ yield 8–12 % & cut labour 18 %.", "💸 One unchecked mite outbreak = –$336/plant. Stop it before it starts."];
  useEffect(() => {
    try {
      sessionStorage.setItem(TEMP_QUIZ_RESPONSES_KEY, JSON.stringify(quizResponses));
    } catch (error) {
      console.error('Error saving quiz responses to session storage:', error);
    }
  }, [quizResponses]);
  useEffect(() => {
    const targetDate = new Date('2025-07-01T23:59:59.000Z');
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDiff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff % (1000 * 60 * 60) / (1000 * 60));
        setGlobalTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setGlobalTimeLeft("Offer expired");
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, []);

  // Proof ticker rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProofIndex(prev => (prev + 1) % proofTickers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Quiz timer countdown
  useEffect(() => {
    if (!showIntroCover && !showSubscription && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showIntroCover, showSubscription, timeLeft]);
  const questions = [{
    question: "What's your #1 grow goal right now?",
    type: "radio",
    field: "goals",
    options: [{
      label: "Max yield",
      value: "profits"
    }, {
      label: "Top quality and potency",
      value: "quality"
    }, {
      label: "Slash costs",
      value: "costs"
    }, {
      label: "Stay 100% compliant",
      value: "compliance"
    }],
    tooltip: "We tune the AI to maximise yield, terps, savings or compliance—whichever you pick."
  }, {
    question: "How long have you been growing?",
    type: "radio",
    field: "experience_level",
    options: [{
      label: "I'm new",
      value: "new"
    }, {
      label: "6 months - 2 years",
      value: "intermediate"
    }, {
      label: "Over 2 years",
      value: "advanced"
    }]
  }, {
    question: "How many plants are you growing or expect to grow?",
    type: "radio",
    field: "plant_quantity",
    options: [{
      label: "🌱 1–4 (home hobby)",
      value: "1-4"
    }, {
      label: "🌿 5–20 (garage / small room)",
      value: "5-20"
    }, {
      label: "🌳 21–100 (craft)",
      value: "21-100"
    }, {
      label: "🏭 101–500 (mid-scale)",
      value: "101-500"
    }, {
      label: "🌄 500 + (farm or MSO)",
      value: "500+"
    }],
    tooltip: "This lets us size nutrients, labour, and ROI."
  }, {
    question: "Where are your plants living?",
    type: "radio",
    field: "growing_method",
    options: [{
      label: "Indoor",
      value: "indoor"
    }, {
      label: "Outdoor",
      value: "outdoor"
    }, {
      label: "Greenhouse",
      value: "greenhouse"
    }]
  }];
  const handleStartQuiz = () => {
    setShowIntroCover(false);
  };
  const handleNextStep = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) {
      console.error('Current question not found for step:', currentStep);
      return;
    }
    const currentAnswer = quizResponses[currentQuestion.field as keyof QuizResponse];
    if (!currentAnswer || Array.isArray(currentAnswer) && currentAnswer.length === 0) {
      toast({
        title: "Please answer the question",
        description: "Select at least one option to continue",
        variant: "destructive"
      });
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // After completing all questions, show interstitial
      setShowInterstitial(true);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleContinueToCheckout = () => {
    handleSubmit();
  };
  const handleBackToQuestions = () => {
    setShowPreview(false);
    setCurrentStep(questions.length - 1); // Go back to last question
  };
  const handleInterstitialContinue = () => {
    handleSubmit();
  };
  const generateDynamicTip = () => {
    const experienceLevel = quizResponses.experience_level;
    const growingMethod = quizResponses.growing_method;
    const goals = Array.isArray(quizResponses.goals) ? quizResponses.goals[0] : quizResponses.goals;
    const challenges = quizResponses.challenges;

    // Generate tip based on experience level and growing method
    if (experienceLevel === 'new' && growingMethod === 'indoor') {
      return 'Adjust lighting to 18/6 cycle for 15% yield boost in your indoor setup.';
    } else if (experienceLevel === 'new' && growingMethod === 'outdoor') {
      return 'Start with companion planting to naturally deter pests in your outdoor garden.';
    } else if (experienceLevel === 'intermediate' && growingMethod === 'indoor') {
      return 'Optimize your VPD (Vapor Pressure Deficit) to increase terpene production by 20%.';
    } else if (experienceLevel === 'intermediate' && growingMethod === 'outdoor') {
      return 'Implement LST (Low Stress Training) early in veg for 25% more bud sites.';
    } else if (experienceLevel === 'advanced' && growingMethod === 'greenhouse') {
      return 'Fine-tune your environmental controls for craft-grade terpene expression.';
    } else if (goals === 'profits') {
      return 'Focus on high-yield strains and optimize your grow space utilization for maximum ROI.';
    } else if (goals === 'quality') {
      return 'Lower temperatures during flower (65-75°F) to preserve delicate terpenes.';
    } else if (goals === 'costs') {
      return 'Switch to LED lighting to reduce energy costs by up to 40% while maintaining yields.';
    } else if (challenges?.includes('pests')) {
      return 'Implement IPM (Integrated Pest Management) early to prevent costly infestations.';
    } else if (challenges?.includes('nutrient_deficiencies')) {
      return 'Monitor pH levels daily - optimal range is 6.0-7.0 for soil, 5.5-6.5 for hydro.';
    } else {
      return 'Maintain consistent environmental conditions for optimal plant health and yields.';
    }
  };
  const generatePersonalizedHeadline = () => {
    const growingMethod = quizResponses.growing_method;
    const experienceLevel = quizResponses.experience_level;
    const challenges = quizResponses.challenges;
    let location = 'grow';
    if (growingMethod === 'indoor') location = 'indoor';else if (growingMethod === 'outdoor') location = 'outdoor';else if (growingMethod === 'greenhouse') location = 'greenhouse';
    return `Reclaim 13-20% yield for your ${location} setup?`;
  };
  const generatePersonalizedBullets = () => {
    const experienceLevel = quizResponses.experience_level;
    const challenges = quizResponses.challenges;
    const growingMethod = quizResponses.growing_method;
    let experience = 'beginner';
    if (experienceLevel === 'intermediate') experience = '6 months-2 years';else if (experienceLevel === 'advanced') experience = 'advanced';else if (experienceLevel === 'new') experience = 'new grower';
    let challenge = 'plant issues';
    if (challenges?.includes('pests')) challenge = 'pest outbreaks';else if (challenges?.includes('nutrient_deficiencies')) challenge = 'nutrient deficiencies';else if (challenges?.includes('environmental_issues')) challenge = 'environmental issues';
    return [`AI predictions tailored to your ${experience} level and ${challenge}`, `Real-time plant health monitoring for ${growingMethod} setups`, `Personalized harvest optimization strategies`, `24/7 expert guidance system`];
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (session?.user?.id) {
        console.log('Starting quiz submission for user:', session.user.id);
        console.log('Quiz responses to save:', quizResponses);
        const {
          data: existingProfile,
          error: profileError
        } = await supabase.from('user_profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (profileError) {
          console.error('Error checking existing profile:', profileError);
          throw profileError;
        }
        const profileData = {
          id: session.user.id,
          grow_experience_level: quizResponses.experience_level,
          growing_method: quizResponses.growing_method,
          monitoring_method: quizResponses.monitoring_method,
          nutrient_type: quizResponses.nutrient_type,
          challenges: quizResponses.challenges,
          goals: Array.isArray(quizResponses.goals) ? quizResponses.goals : [quizResponses.goals].filter(Boolean)
        };
        console.log('Updating user profile with:', profileData);
        const {
          error: upsertError
        } = await supabase.from('user_profiles').upsert(profileData);
        if (upsertError) {
          console.error('Error updating profile:', upsertError);
          throw upsertError;
        }
        const {
          error: quizError
        } = await supabase.from('quiz_responses').insert({
          user_id: session.user.id,
          experience_level: quizResponses.experience_level,
          growing_method: quizResponses.growing_method,
          plant_quantity: quizResponses.plant_quantity,
          challenges: quizResponses.challenges,
          monitoring_method: quizResponses.monitoring_method,
          nutrient_type: quizResponses.nutrient_type,
          goals: Array.isArray(quizResponses.goals) ? quizResponses.goals : [quizResponses.goals].filter(Boolean)
        });
        if (quizError) {
          console.error('Error saving quiz responses:', quizError);
          throw quizError;
        }
        console.log('Successfully saved quiz responses and updated profile');
        sessionStorage.removeItem(TEMP_QUIZ_RESPONSES_KEY);
        toast({
          title: "Success!",
          description: "Your growing preferences have been saved."
        });
        setShowSubscription(true);
      } else {
        console.log('User not logged in, storing responses temporarily');
        sessionStorage.setItem(TEMP_QUIZ_RESPONSES_KEY, JSON.stringify(quizResponses));
        setShowSubscription(true);
      }
    } catch (error: any) {
      console.error('Error in quiz submission:', error);
      toast({
        title: "Error saving responses",
        description: "Please try signing out and back in, then complete the quiz again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
  };
  if (showIntroCover) {
    return <IntroCover onStartQuiz={handleStartQuiz} />;
  }
  if (showPreview) {
    return <div className="min-h-screen bg-background circuit-background relative">
        {/* Sparkles Background */}
        <div className="fixed inset-0 w-full h-full">
          <SparklesCore id="quiz-preview-sparkles" background="transparent" minSize={0.4} maxSize={1.2} particleDensity={40} className="w-full h-full" particleColor="#8b87f5" speed={0.6} />
        </div>
        
        <div className="relative z-10">
          <ChatHeader />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="px-8 py-6 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <PreviewStep onContinueToCheckout={handleContinueToCheckout} onBackToQuestions={handleBackToQuestions} />
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  if (showSubscription) {
    return <div className="min-h-screen bg-background circuit-background relative">
        {/* Sparkles Background */}
        <div className="fixed inset-0 w-full h-full">
          <SparklesCore id="quiz-subscription-sparkles" background="transparent" minSize={0.5} maxSize={1.3} particleDensity={45} className="w-full h-full" particleColor="#9b87f5" speed={0.7} />
        </div>
        
        <div className="relative z-10">
          <ChatHeader />
          <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-[1200px] space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
                  {generatePersonalizedHeadline()}
                </h1>
                <p className="text-lg text-white/80">Get personalized AI guidance for your growing journey</p>
                
                <TestimonialCarousel />

                <div className="bg-[#9b87f5] rounded-lg p-4 mt-6 text-center transform hover:scale-105 transition-transform duration-300 relative">
                  <p className="text-white font-bold text-lg">🚨 LIMITED TIME: Save 25% on Quarterly & Over 60% on Yearly!</p>
                  <p className="text-[#FFD700] font-mono font-bold text-2xl mt-2">
                    Offer ends: {globalTimeLeft}
                  </p>
                  
                  <img src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png" className="risk-ribbon md:hidden block mx-auto mt-2" style={{
                  height: '40px',
                  margin: '8px auto 0'
                }} alt="Risk-Free – Cancel Anytime" />
                </div>
              </div>
              
              <div className="max-w-md mx-auto space-y-4">
                {/* Weekly Plan */}
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transition-all duration-300 relative p-4">
                  <div className="absolute -top-2 right-4 z-10">
                    <Badge className="bg-[#FFD700] text-black border border-[#FFD700] px-2 py-1 text-xs font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Sale
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-bold">Weekly Plan</h3>
                      <div className="text-white/80 text-sm">Master Growbot</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="text-white/50 text-lg font-bold line-through">$9.99</div>
                        <div className="text-white text-2xl font-bold">$8</div>
                      </div>
                      <div className="text-white/60 text-sm">/week</div>
                    </div>
                  </div>
                  
                  <button onClick={() => setExpandedPlan(expandedPlan === 'weekly' ? null : 'weekly')} className="w-full text-left text-white/80 text-sm mb-4 hover:text-white transition-colors">
                    {expandedPlan === 'weekly' ? '▼' : '▶'} Tap to see plan details
                  </button>
                  
                  {expandedPlan === 'weekly' && <div className="space-y-2 mb-4 text-left">
                      {generatePersonalizedBullets().map((bullet, index) => <div key={index} className="flex items-start text-white/80 text-sm">
                          <span className="mr-2 mt-1">•</span>
                          <span>{bullet}</span>
                        </div>)}
                    </div>}
                  
                  <a href="https://square.link/u/HWK25HbP" target="_blank" rel="noopener noreferrer" className="block">
                    <button className="w-full bg-[#9b87f5] hover:bg-[#8b7af5] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
                      Start Free Trial
                    </button>
                  </a>
                  <p className="text-white/60 text-xs text-center mt-2">- Cancel Anytime</p>
                </div>

                {/* Quarterly Plan */}
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transition-all duration-300 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-bold">Save Your Seconds</h3>
                      <div className="text-white/80 text-sm">Master Growbot Quarterly</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-2xl font-bold">$29.99</div>
                      <div className="text-white/60 text-sm">/month</div>
                    </div>
                  </div>
                  
                  <button onClick={() => setExpandedPlan(expandedPlan === 'quarterly' ? null : 'quarterly')} className="w-full text-left text-white/80 text-sm mb-4 hover:text-white transition-colors">
                    {expandedPlan === 'quarterly' ? '▼' : '▶'} Tap to see plan details
                  </button>
                  
                  {expandedPlan === 'quarterly' && <div className="space-y-2 mb-4 text-left">
                      {generatePersonalizedBullets().map((bullet, index) => <div key={index} className="flex items-start text-white/80 text-sm">
                          <span className="mr-2 mt-1">•</span>
                          <span>{bullet}</span>
                        </div>)}
                    </div>}
                  
                  <a href="https://square.link/u/mG7rXjby" target="_blank" rel="noopener noreferrer" className="block">
                    <button className="w-full bg-[#9b87f5] hover:bg-[#8b7af5] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
                      Start Free Trial
                    </button>
                  </a>
                  <p className="text-white/60 text-xs text-center mt-2">- Cancel Anytime</p>
                </div>

                {/* Yearly Plan - Best Value */}
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-purple-500 shadow-2xl transition-all duration-300 relative p-4">
                  <div className="absolute -top-2 right-4 z-10">
                    <Badge className="bg-[#FFD700] text-black border border-[#FFD700] px-2 py-1 text-xs font-bold">
                      Best Value
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-bold">Yearly Plan</h3>
                      <div className="text-white/80 text-sm">Master Growbot</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-2xl font-bold">$199</div>
                      <div className="text-white/60 text-sm">/year</div>
                    </div>
                  </div>
                  
                  <button onClick={() => setExpandedPlan(expandedPlan === 'yearly' ? null : 'yearly')} className="w-full text-left text-white/80 text-sm mb-4 hover:text-white transition-colors">
                    {expandedPlan === 'yearly' ? '▼' : '▶'} Tap to see plan details
                  </button>
                  
                  {expandedPlan === 'yearly' && <div className="space-y-2 mb-4 text-left">
                      {generatePersonalizedBullets().map((bullet, index) => <div key={index} className="flex items-start text-white/80 text-sm">
                          <span className="mr-2 mt-1">•</span>
                          <span>{bullet}</span>
                        </div>)}
                    </div>}
                  
                  <a href="https://square.link/u/pa9x0yXT" target="_blank" rel="noopener noreferrer" className="block">
                    <button className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
                      Start Free Trial
                    </button>
                  </a>
                  <p className="text-white/60 text-xs text-center mt-2">- Cancel Anytime</p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-5xl mx-auto">
                  {/* Cancel Anytime Badge */}
                  <div className="flex-shrink-0">
                    
                  </div>

                  {/* Secure Checkout Image */}
                  <div className="flex-shrink-0">
                    
                  </div>

                  {/* Trusted Seller Badge */}
                  <div className="flex-shrink-0">
                    
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4 items-center w-full max-w-md">
                  <p className="text-center text-white/80 text-sm">After purchase, use the email you provided during checkout to sign up</p>
                  
                  <Button variant="default" onClick={() => navigate('/')} className="w-full px-6 h-12 text-base bg-primary hover:bg-primary/90">
                    Go to Signup
                  </Button>
                  
                  <Button variant="outline" onClick={() => setShowSubscription(false)} className="px-6 w-full h-12 text-base hover:bg-white/5 border-white/20 transition-colors duration-200">
                    Back to Quiz
                  </Button>
                  
                  <button onClick={() => navigate('/chat')} className="text-white/60 hover:text-white text-sm underline transition-colors duration-200">
                    No Thanks, Continue Free
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-2 text-[#FFD700]">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold text-sm">Join Our Community of Elite Cannabis Cultivators</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  if (showInterstitial) {
    return <div className="min-h-screen bg-background circuit-background relative">
        {/* Sparkles Background */}
        <div className="fixed inset-0 w-full h-full">
          <SparklesCore id="quiz-interstitial-sparkles" background="transparent" minSize={0.4} maxSize={1.2} particleDensity={40} className="w-full h-full" particleColor="#8b87f5" speed={0.6} />
        </div>
        
        <div className="relative z-10">
          <ChatHeader />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="px-8 py-12 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl text-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
                      Based on your answers, here's a quick tip:
                    </h1>
                    
                    <div className="bg-gradient-to-r from-purple-600/20 to-green-400/20 rounded-lg p-6 border border-purple-400/30">
                      <p className="text-xl text-white font-medium leading-relaxed">
                        {generateDynamicTip()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-white/80 text-lg">
                      This is just the beginning. Get your complete personalized action plan now.
                    </p>
                    
                    <Button onClick={handleInterstitialContinue} disabled={isSubmitting} className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 rounded-xl transition-all duration-300 transform hover:scale-105">
                      {isSubmitting ? "Loading..." : "See My Full AI Action Card"}
                    </Button>
                    
                    {/* Feature Benefit Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl mx-auto">
                      {/* Grow Bigger Buds Card */}
                      <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-500/20 p-3 rounded-lg">
                            <div className="w-8 h-8 text-green-400">🌿</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">Grow Bigger Buds & Higher Yields</h3>
                            <p className="text-white/70 text-sm mb-3">Maximize harvest with abundant bud-colibrating discipline across all nutrient schedules.</p>
                            <p className="text-green-400 text-sm font-medium">Stop guessing. Get AI guidance with weekly inspections and room adjustments recommendations.</p>
                          </div>
                        </div>
                      </div>

                      {/* Stack Cash Card */}
                      <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start space-x-4">
                          <div className="bg-yellow-500/20 p-3 rounded-lg">
                            <div className="w-8 h-8 text-yellow-400">💰</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">Stack Cash & Super Charge Profits</h3>
                            <p className="text-white/70 text-sm mb-3">Boost earnings by optimizing harvest timing and yield strategies, through Database and yield-boost tips.</p>
                            <p className="text-yellow-400 text-sm font-medium">Get 95% confidence scans and personalized action to maximize your investment.</p>
                          </div>
                        </div>
                      </div>

                      {/* Improve Quality Card */}
                      <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start space-x-4">
                          <div className="bg-purple-500/20 p-3 rounded-lg">
                            <div className="w-8 h-8 text-purple-400">⚡</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">Improve Quality & Increase Potency</h3>
                            <p className="text-white/70 text-sm mb-3">Elevate plant strength for superior harvest with Precision Tools like PM and pH guidance.</p>
                            <p className="text-purple-400 text-sm font-medium">Access comprehensive nutrient suggestions and environmental control approaches.</p>
                          </div>
                        </div>
                      </div>

                      {/* AI-Powered Plant Evaluation Card */}
                      <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-500/20 p-3 rounded-lg">
                            <div className="w-8 h-8 text-blue-400">🔍</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">AI-Powered Plant Evaluation</h3>
                            <p className="text-white/70 text-sm mb-3">Advanced 95% confidence scans with intelligent diagnostic and recommended actions.</p>
                            <p className="text-blue-400 text-sm font-medium">Real-time plant health monitoring with precision diagnostic tools.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  const currentQuestion = questions[currentStep];
  if (!currentQuestion) {
    console.error('Current question not found at index:', currentStep);
    return <div className="min-h-screen bg-background circuit-background flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="mb-6">We're having trouble loading the quiz questions.</p>
          <Button onClick={() => navigate('/chat')}>Go to Chat</Button>
        </div>
      </div>;
  }

  // Dynamic timer based on step
  const getTimerText = () => {
    switch (currentStep) {
      case 0:
        return "30s to your personalized AI plan";
      case 1:
        return "25s to your personalized AI plan";
      case 2:
        return "15s to your personalized AI plan";
      case 3:
        return "5s to your personalized AI plan";
      default:
        return `${timeLeft}s to your personalized AI plan`;
    }
  };
  const getProgressPercentage = () => {
    return (currentStep + 1) / questions.length * 100;
  };
  return <div className="min-h-screen bg-background circuit-background relative">
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full">
        <SparklesCore id="quiz-sparkles" background="transparent" minSize={0.4} maxSize={1.0} particleDensity={35} className="w-full h-full" particleColor="#36d399" speed={0.5} />
      </div>
      
      <div className="relative z-10">
        <ChatHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="px-8 py-6 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
                    Help us personalize your growing experience
                  </h1>
                  {/* Progress Bar */}
                  <div className="w-full mt-6 space-y-3">
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-green-400 transition-all duration-300 ease-out flex items-center justify-center relative" style={{
                      width: `${getProgressPercentage()}%`
                    }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-purple-400/80 to-green-400/80 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/90 font-medium">
                        Step {currentStep + 1}/4
                      </span>
                      <span className="text-white/70 font-medium">
                        {getTimerText()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white tech-font">
                      {currentQuestion.question}
                    </h2>
                    {currentQuestion.tooltip && <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/60 hover:text-white">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{currentQuestion.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>}
                  </div>

                  {currentQuestion.type === "radio" && (currentStep === 0 || currentStep === 1 || currentStep === 2) && <div className="flex flex-col gap-4">
                      {currentQuestion.options.map(option => <div key={option.value} className={`rounded-lg bg-white/5 backdrop-blur ring-1 ring-white/10 py-4 px-5 hover:ring-purple-400 transition cursor-pointer ${(Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : quizResponses[currentQuestion.field as keyof QuizResponse] as string) === option.value ? 'ring-purple-400 bg-purple-400/10' : ''}`} onClick={() => {
                    if (currentQuestion.field === "goals") {
                      setQuizResponses(prev => ({
                        ...prev,
                        [currentQuestion.field]: [option.value]
                      }));
                    } else {
                      setQuizResponses(prev => ({
                        ...prev,
                        [currentQuestion.field]: option.value
                      }));
                    }
                  }}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${(Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : quizResponses[currentQuestion.field as keyof QuizResponse] as string) === option.value ? 'border-purple-400 bg-purple-400' : 'border-white/30'}`}>
                              {(Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : quizResponses[currentQuestion.field as keyof QuizResponse] as string) === option.value && <div className="w-full h-full rounded-full bg-white"></div>}
                            </div>
                            <label className="text-lg font-medium leading-none cursor-pointer w-full text-white">
                              {option.label}
                            </label>
                          </div>
                        </div>)}
                    </div>}

                  {currentQuestion.type === "radio" && currentStep !== 0 && currentStep !== 1 && currentStep !== 2 && <RadioGroup value={Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : quizResponses[currentQuestion.field as keyof QuizResponse] as string} onValueChange={value => {
                  if (currentQuestion.field === "goals") {
                    setQuizResponses(prev => ({
                      ...prev,
                      [currentQuestion.field]: [value]
                    }));
                  } else {
                    setQuizResponses(prev => ({
                      ...prev,
                      [currentQuestion.field]: value
                    }));
                  }
                }} className="space-y-4">
                    {currentQuestion.options.map(option => <div key={option.value} className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5">
                        <RadioGroupItem value={option.value} id={option.value} className="border-accent data-[state=checked]:border-accent data-[state=checked]:text-accent" />
                        <label htmlFor={option.value} className="text-lg font-medium leading-none cursor-pointer w-full hover:text-accent">
                          {option.label}
                        </label>
                      </div>)}
                  </RadioGroup>}

                  {currentQuestion.type === "checkbox" && <div className="space-y-4">
                      {currentQuestion.options.map(option => <div key={option.value} className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5">
                          <Checkbox id={option.value} checked={(quizResponses[currentQuestion.field as keyof QuizResponse] as string[] || []).includes(option.value)} onCheckedChange={checked => {
                      const field = currentQuestion.field as keyof QuizResponse;
                      const currentValues = quizResponses[field] as string[] || [];
                      if (checked) {
                        if (option.value === 'all' || option.value === 'none') {
                          setQuizResponses(prev => ({
                            ...prev,
                            [field]: [option.value]
                          }));
                        } else {
                          setQuizResponses(prev => ({
                            ...prev,
                            [field]: [...currentValues.filter(v => v !== 'all' && v !== 'none'), option.value]
                          }));
                        }
                      } else {
                        setQuizResponses(prev => ({
                          ...prev,
                          [field]: currentValues.filter(value => value !== option.value)
                        }));
                      }
                    }} className="border-accent data-[state=checked]:border-accent data-[state=checked]:bg-accent" />
                          <label htmlFor={option.value} className="text-lg font-medium leading-none cursor-pointer w-full hover:text-accent">
                            {option.label}
                          </label>
                        </div>)}
                    </div>}

                  {/* Proof ticker for first three questions */}
                  {(currentStep === 0 || currentStep === 1 || currentStep === 2) && <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white/80 text-center animate-pulse">
                        {proofTickers[currentProofIndex]}
                      </p>
                    </div>}

                  {/* Mini-fact for second question */}
                  {currentStep === 1 && <div className="mt-4 text-center">
                      <p className="text-sm text-white/70">
                        ⚡ 68% of growers recover ROI in ≤14 days after solving the #1 pain-point (Guide p. 5).
                      </p>
                    </div>}

                  {/* Mini-fact for fourth question */}
                  {currentStep === 3 && <div className="mt-4 text-center">
                      <p className="text-sm text-white/70">
                        🌱 57% of micro-grows using AI hit craft-grade terps in ≤3 cycles (Guide p. 7).
                      </p>
                    </div>}
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 0} className="px-6 rounded-full">
                    Previous
                  </Button>
                  
                  <Button onClick={handleNextStep} disabled={isSubmitting} className="px-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500">
                    {currentStep === questions.length - 1 ? isSubmitting ? "Saving..." : "Complete Quiz" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}