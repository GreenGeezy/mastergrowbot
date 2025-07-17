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
  const { toast } = useToast();
  const [showIntroCover, setShowIntroCover] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [currentProofIndex, setCurrentProofIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [quizResponses, setQuizResponses] = useState<Partial<QuizResponse>>(() => {
    try {
      const savedResponses = sessionStorage.getItem(TEMP_QUIZ_RESPONSES_KEY);
      return savedResponses ? safeJsonParse(savedResponses, {
        goals: [],
        experience_level: undefined,
        growing_method: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined
      }) : {
        goals: [],
        experience_level: undefined,
        growing_method: undefined,
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
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined
      };
    }
  });
  const [globalTimeLeft, setGlobalTimeLeft] = useState("");

  const proofTickers = [
    "📈 2022 Univ. of Guelph greenhouse trial: AI tools ↑ yield 8–12 % & cut labour 18 %.",
    "💸 One unchecked mite outbreak = –$336/plant. Stop it before it starts."
  ];

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
      setCurrentProofIndex((prev) => (prev + 1) % proofTickers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Quiz timer countdown
  useEffect(() => {
    if (!showIntroCover && !showSubscription && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showIntroCover, showSubscription, timeLeft]);

  const questions = [
    {
      question: "What's your #1 grow goal right now?",
      type: "radio",
      field: "goals",
      options: [
        { label: "Max yield", value: "profits" },
        { label: "Better terp power", value: "quality" },
        { label: "Slash costs", value: "costs" },
        { label: "Stay 100% compliant", value: "compliance" }
      ],
      tooltip: "We tune the AI to maximise yield, terps, savings or compliance—whichever you pick."
    },
    {
      question: "Biggest headache this cycle?",
      type: "radio",
      field: "experience_level",
      options: [
        { label: "I'm new", value: "new" },
        { label: "6 months - 2 years", value: "intermediate" },
        { label: "Over 2 years", value: "advanced" }
      ]
    },
    {
      question: "How many runs under your belt?",
      type: "radio",
      field: "growing_method",
      options: [
        { label: "New", value: "indoor" },
        { label: "Intermediate", value: "outdoor" },
        { label: "Advanced", value: "greenhouse" }
      ],
      tooltip: "We tune the AI to maximise yield, terps, savings or compliance—whichever you pick."
    },
    {
      question: "Where are your plants living?",
      type: "checkbox",
      field: "challenges",
      options: [
        { label: "Indoor", value: "pests" },
        { label: "Greenhouse", value: "nutrient_deficiencies" },
        { label: "Outdoor", value: "environmental_issues" },
        { label: "Both", value: "none" },
        { label: "Micro-grow", value: "micro_grow" }
      ]
    }
  ];

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
      // After completing all questions, show preview step
      setShowPreview(true);
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
    return (
      <div className="min-h-screen bg-background circuit-background relative">
        {/* Sparkles Background */}
        <div className="fixed inset-0 w-full h-full">
          <SparklesCore
            id="quiz-preview-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={40}
            className="w-full h-full"
            particleColor="#8b87f5"
            speed={0.6}
          />
        </div>
        
        <div className="relative z-10">
          <ChatHeader />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="px-8 py-6 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <PreviewStep 
                  onContinueToCheckout={handleContinueToCheckout}
                  onBackToQuestions={handleBackToQuestions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSubscription) {
    return <div className="min-h-screen bg-background circuit-background relative">
        {/* Sparkles Background */}
        <div className="fixed inset-0 w-full h-full">
          <SparklesCore
            id="quiz-subscription-sparkles"
            background="transparent"
            minSize={0.5}
            maxSize={1.3}
            particleDensity={45}
            className="w-full h-full"
            particleColor="#9b87f5"
            speed={0.7}
          />
        </div>
        
        <div className="relative z-10">
          <ChatHeader />
          <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-[1200px] space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">Subscription Required</h1>
                <p className="text-lg text-white/80">To access Master Growbot AI, please select a subscription plan</p>
                
                <TestimonialCarousel />

                <div className="bg-[#9b87f5] rounded-lg p-4 mt-6 text-center transform hover:scale-105 transition-transform duration-300 relative">
                  <p className="text-white font-bold text-lg">Unlock 25% Off Quarterly & Over 60% Off Yearly—Offer Ends 7/10/25!</p>
                  <p className="text-[#FFD700] font-mono font-bold text-xl">{globalTimeLeft}</p>
                  
                  <img src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png" className="risk-ribbon md:hidden block mx-auto mt-2" style={{
                  height: '40px',
                  margin: '8px auto 0'
                }} alt="Risk-Free – Cancel Anytime" />
                </div>
              </div>
              
              <div className="flex flex-row gap-6 items-stretch justify-center flex-wrap md:flex-nowrap mb-4 mx-0 my-0 py-0 px-0 rounded">
                {/* Weekly Plan */}
                <div className="w-[280px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transform hover:scale-105 transition-all duration-300 plan-card relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#FFD700] text-black border border-[#FFD700] px-3 py-1 text-sm font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Sale
                    </Badge>
                  </div>
                  <div className="p-6 text-center">
                    <div className="mb-4">
                      <h3 className="text-white text-xl font-bold mb-2">Weekly Plan</h3>
                      <div className="text-white/80 text-sm mb-4">Master Growbot</div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="price-line">
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-white/50 text-2xl font-bold line-through">$9.99</div>
                          <div className="text-white text-4xl font-bold">$8</div>
                        </div>
                        <div className="text-white/60 text-sm">/week</div>
                      </div>
                    </div>
                    
                    <img src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png" className="trust-stamp" style={{
                    width: '36px',
                    height: '36px',
                    margin: '8px auto 4px',
                    opacity: 0.9,
                    transition: 'transform 0.3s'
                  }} alt="Cancel Anytime – No Fee" />
                    
                    <div className="space-y-3 mb-6 text-left">
                      <div className="flex items-center text-white/80 text-sm">
                        <span className="mr-2">•</span>
                        <span>No-risk: cancel anytime</span>
                      </div>
                    </div>
                    
                    <a href="https://square.link/u/HWK25HbP" target="_blank" rel="noopener noreferrer" className="block">
                      <button className="w-full bg-[#9b87f5] hover:bg-[#8b7af5] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                        Unlock Growbot →
                      </button>
                    </a>
                  </div>
                </div>

                {/* Quarterly Plan */}
                <div className="w-[280px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transform hover:scale-105 transition-all duration-300 plan-card">
                  <div className="p-6 text-center">
                    <div className="mb-4">
                      <h3 className="text-white text-xl font-bold mb-2">Save Your Seconds</h3>
                      <div className="text-white/80 text-sm mb-4">Master Growbot Quarterly</div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="price-line">
                        <div className="text-white text-4xl font-bold">$89</div>
                        <div className="text-white/60 text-sm">/quarter</div>
                      </div>
                    </div>
                    
                    <img src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png" className="trust-stamp" style={{
                    width: '36px',
                    height: '36px',
                    margin: '8px auto 4px',
                    opacity: 0.9,
                    transition: 'transform 0.3s'
                  }} alt="Cancel Anytime – No Fee" />
                    
                    <div className="space-y-3 mb-6 text-left">
                      <div className="flex items-center text-white/80 text-sm">
                        <span className="mr-2">•</span>
                        <span>Save 25%</span>
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <span className="mr-2">•</span>
                        <span>No-risk: cancel anytime</span>
                      </div>
                    </div>
                    
                    <a href="https://square.link/u/mG7rXjby" target="_blank" rel="noopener noreferrer" className="block">
                      <button className="w-full bg-[#9b87f5] hover:bg-[#8b7af5] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                        Unlock Growbot →
                      </button>
                    </a>
                  </div>
                </div>

                {/* Yearly Plan - Best Value */}
                <div className="w-[280px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-[#FFD700] shadow-2xl transform hover:scale-105 transition-all duration-300 relative plan-card">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#FFD700] text-black border border-[#FFD700] px-3 py-1 text-sm font-bold">
                      Best Value
                    </Badge>
                  </div>
                  <div className="p-6 text-center">
                    <div className="mb-4">
                      <h3 className="text-white text-xl font-bold mb-2">Yearly Quarterly</h3>
                      <div className="text-white/80 text-sm mb-4">Master Growbot</div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="price-line">
                        <div className="text-white text-4xl font-bold">$199</div>
                        <div className="text-white/60 text-sm">/year</div>
                      </div>
                    </div>
                    
                    <img src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png" className="trust-stamp" style={{
                    width: '36px',
                    height: '36px',
                    margin: '8px auto 4px',
                    opacity: 0.9,
                    transition: 'transform 0.3s'
                  }} alt="Cancel Anytime – No Fee" />
                    
                    <div className="space-y-3 mb-6 text-left">
                      <div className="flex items-center text-white/80 text-sm">
                        <span className="mr-2">•</span>
                        <span>Save Over 60%</span>
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <span className="mr-2">•</span>
                        <span>No-risk: cancel anytime</span>
                      </div>
                    </div>
                    
                    <a href="https://square.link/u/pa9x0yXT" target="_blank" rel="noopener noreferrer" className="block">
                      <button className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                        Unlock Growbot →
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-5xl mx-auto">
                  {/* Cancel Anytime Badge */}
                  <div className="flex-shrink-0">
                    <img src="/lovable-uploads/0b625d46-6a8a-4ae6-a395-2ea7b1034b04.png" alt="Cancel Anytime Zero Fees Badge" className="w-32 h-32 md:w-40 md:h-40 object-contain" loading="lazy" />
                  </div>

                  {/* Secure Checkout Image */}
                  <div className="flex-shrink-0">
                    <img alt="Secure checkout by Square with multiple payment options" className="w-full max-w-md h-auto object-contain rounded-lg" src="/lovable-uploads/1f642749-fc10-4fb2-8ad3-3f0866f9c935.png" />
                  </div>

                  {/* Trusted Seller Badge */}
                  <div className="flex-shrink-0">
                    <img src="/lovable-uploads/30767198-f9b4-42cb-b632-0b9fbb0b856a.png" alt="Trusted Seller Badge" className="w-32 h-32 md:w-40 md:h-40 object-contain" loading="lazy" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4 items-center w-full max-w-md">
                  <p className="text-center text-white/80">After purchase, use the email you provided during checkout to sign up</p>
                  <Button variant="default" onClick={() => navigate('/')} className="w-full px-6 h-12 text-base bg-primary hover:bg-primary/90">
                    Go to Signup
                  </Button>
                  
                  <Button variant="outline" onClick={() => setShowSubscription(false)} className="px-6 w-full h-12 text-base hover:bg-white/5 border-white/20 transition-colors duration-200">
                    Back to Quiz
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-2 text-[#FFD700]">
                  
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Join Our Community of Elite Cannabis Cultivators and AI Enthusiasts</span>
                  
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
    return (
      <div className="min-h-screen bg-background circuit-background flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="mb-6">We're having trouble loading the quiz questions.</p>
          <Button onClick={() => navigate('/chat')}>Go to Chat</Button>
        </div>
      </div>
    );
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
    return ((currentStep + 1) / questions.length) * 100;
  };

  return <div className="min-h-screen bg-background circuit-background relative">
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full">
        <SparklesCore
          id="quiz-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.0}
          particleDensity={35}
          className="w-full h-full"
          particleColor="#36d399"
          speed={0.5}
        />
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
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-green-400 transition-all duration-300 ease-out flex items-center justify-center relative"
                        style={{ width: `${getProgressPercentage()}%` }}
                      >
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
                    {currentQuestion.tooltip && (
                      <TooltipProvider>
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
                      </TooltipProvider>
                    )}
                  </div>

                  {currentQuestion.type === "radio" && (currentStep === 0 || currentStep === 1 || currentStep === 2) && (
                    <div className="flex flex-col gap-4">
                      {currentQuestion.options.map(option => (
                        <div 
                          key={option.value} 
                          className={`rounded-lg bg-white/5 backdrop-blur ring-1 ring-white/10 py-4 px-5 hover:ring-purple-400 transition cursor-pointer ${
                            (Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? 
                              (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : 
                              quizResponses[currentQuestion.field as keyof QuizResponse] as string) === option.value 
                              ? 'ring-purple-400 bg-purple-400/10' : ''
                          }`}
                          onClick={() => {
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
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              (Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? 
                                (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : 
                                quizResponses[currentQuestion.field as keyof QuizResponse] as string) === option.value 
                                ? 'border-purple-400 bg-purple-400' : 'border-white/30'
                            }`}>
                              {(Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? 
                                (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : 
                                quizResponses[currentQuestion.field as keyof QuizResponse] as string) === option.value && (
                                <div className="w-full h-full rounded-full bg-white"></div>
                              )}
                            </div>
                            <label className="text-lg font-medium leading-none cursor-pointer w-full text-white">
                              {option.label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "radio" && currentStep !== 0 && currentStep !== 1 && currentStep !== 2 && <RadioGroup value={Array.isArray(quizResponses[currentQuestion.field as keyof QuizResponse]) ? 
                    (quizResponses[currentQuestion.field as keyof QuizResponse] as string[])[0] : 
                    quizResponses[currentQuestion.field as keyof QuizResponse] as string} 
                    onValueChange={value => {
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
                  {(currentStep === 0 || currentStep === 1 || currentStep === 2) && (
                    <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white/80 text-center animate-pulse">
                        {proofTickers[currentProofIndex]}
                      </p>
                    </div>
                  )}

                  {/* Mini-fact for second question */}
                  {currentStep === 1 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-white/70">
                        ⚡ 68% of growers recover ROI in ≤14 days after solving the #1 pain-point (Guide p. 5).
                      </p>
                    </div>
                  )}

                  {/* Mini-fact for fourth question */}
                  {currentStep === 3 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-white/70">
                        🌱 57% of micro-grows using AI hit craft-grade terps in ≤3 cycles (Guide p. 7).
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousStep} 
                    disabled={currentStep === 0} 
                    className="px-6 rounded-full"
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={handleNextStep} 
                    disabled={isSubmitting} 
                    className="px-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500"
                  >
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
