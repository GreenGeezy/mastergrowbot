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
import { Star, Award, Users, MessageCircle, Camera, BookOpen, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TestimonialCarousel from '@/components/TestimonialCarousel';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  const [quizResponses, setQuizResponses] = useState<Partial<QuizResponse>>(() => {
    try {
      const savedResponses = sessionStorage.getItem(TEMP_QUIZ_RESPONSES_KEY);
      return savedResponses ? safeJsonParse(savedResponses, {
        experience_level: undefined,
        growing_method: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined,
        goals: []
      }) : {
        experience_level: undefined,
        growing_method: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined,
        goals: []
      };
    } catch (error) {
      console.error('Error initializing quiz responses:', error);
      return {
        experience_level: undefined,
        growing_method: undefined,
        challenges: [],
        monitoring_method: undefined,
        nutrient_type: undefined,
        goals: []
      };
    }
  });
  
  const [timeLeft, setTimeLeft] = useState("");

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
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Offer expired");
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const questions = [{
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
    question: "How do you plan on growing?",
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
  }, {
    question: "What challenges have you faced in your previous grow cycles?",
    type: "checkbox",
    field: "challenges",
    options: [{
      label: "Pests",
      value: "pests"
    }, {
      label: "Nutrient deficiencies",
      value: "nutrient_deficiencies"
    }, {
      label: "Environmental issues",
      value: "environmental_issues"
    }, {
      label: "No challenges faced",
      value: "none"
    }]
  }, {
    question: "How do you monitor your growing conditions?",
    type: "radio",
    field: "monitoring_method",
    options: [{
      label: "Manual checks",
      value: "manual"
    }, {
      label: "Basic sensors",
      value: "basic_sensors"
    }, {
      label: "Advanced monitoring systems",
      value: "advanced_systems"
    }]
  }, {
    question: "What type of nutrients do you use for your plants?",
    type: "radio",
    field: "nutrient_type",
    options: [{
      label: "Organic nutrients",
      value: "organic"
    }, {
      label: "Synthetic nutrients",
      value: "synthetic"
    }, {
      label: "Both",
      value: "both"
    }, {
      label: "I don't use nutrients",
      value: "none"
    }]
  }, {
    question: "What would you like Master Growbot to help you achieve?",
    type: "checkbox",
    field: "goals",
    options: [{
      label: "Have fun and learn",
      value: "learn"
    }, {
      label: "Improve quality and potency",
      value: "quality"
    }, {
      label: "Increase yields and profits",
      value: "profits"
    }, {
      label: "All of the above",
      value: "all"
    }]
  }];

  const handleNextStep = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) {
      console.error('Current question not found for step:', currentStep);
      return;
    }
    
    const currentAnswer = quizResponses[currentQuestion.field as keyof QuizResponse];
    
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
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
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (session?.user?.id) {
        console.log('Starting quiz submission for user:', session.user.id);
        console.log('Quiz responses to save:', quizResponses);

        const { data: existingProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

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
          goals: quizResponses.goals
        };

        console.log('Updating user profile with:', profileData);

        const { error: upsertError } = await supabase
          .from('user_profiles')
          .upsert(profileData);

        if (upsertError) {
          console.error('Error updating profile:', upsertError);
          throw upsertError;
        }

        const { error: quizError } = await supabase
          .from('quiz_responses')
          .insert({
            user_id: session.user.id,
            experience_level: quizResponses.experience_level,
            growing_method: quizResponses.growing_method,
            challenges: quizResponses.challenges,
            monitoring_method: quizResponses.monitoring_method,
            nutrient_type: quizResponses.nutrient_type,
            goals: quizResponses.goals
          });

        if (quizError) {
          console.error('Error saving quiz responses:', quizError);
          throw quizError;
        }

        console.log('Successfully saved quiz responses and updated profile');

        sessionStorage.removeItem(TEMP_QUIZ_RESPONSES_KEY);
        
        toast({
          title: "Success!",
          description: "Your growing preferences have been saved.",
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

  if (showSubscription) {
    return (
      <div className="min-h-screen bg-background circuit-background">
        <ChatHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="w-full max-w-[1200px] space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">Subscription Required</h1>
              <p className="text-lg text-white/80">To access Master Growbot AI, please select a subscription plan</p>
              
              <TestimonialCarousel />

              <div className="bg-[#9b87f5] rounded-lg p-4 mt-6 text-center transform hover:scale-105 transition-transform duration-300 relative">
                <p className="text-white font-bold text-lg">Unlock 25% Off Quarterly & Over 60% Off Yearly—Offer Ends 7/10/25!</p>
                <p className="text-[#FFD700] font-mono font-bold text-xl">{timeLeft}</p>
                <img 
                  src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png"
                  className="risk-ribbon hidden md:inline-block absolute right-4 top-1/2 transform -translate-y-1/2"
                  style={{height: '40px', marginLeft: '12px'}}
                  alt="Risk-Free – Cancel Anytime" 
                />
                <img 
                  src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png"
                  className="risk-ribbon md:hidden block mx-auto mt-2"
                  style={{height: '40px', margin: '8px auto 0'}}
                  alt="Risk-Free – Cancel Anytime" 
                />
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
                  
                  <img 
                    src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png"
                    className="trust-stamp"
                    style={{width: '36px', height: '36px', margin: '8px auto 4px', opacity: 0.9, transition: 'transform 0.3s'}}
                    alt="Cancel Anytime – No Fee" 
                  />
                  
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
                  
                  <img 
                    src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png"
                    className="trust-stamp"
                    style={{width: '36px', height: '36px', margin: '8px auto 4px', opacity: 0.9, transition: 'transform 0.3s'}}
                    alt="Cancel Anytime – No Fee" 
                  />
                  
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
                  
                  <img 
                    src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png"
                    className="trust-stamp"
                    style={{width: '36px', height: '36px', margin: '8px auto 4px', opacity: 0.9, transition: 'transform 0.3s'}}
                    alt="Cancel Anytime – No Fee" 
                  />
                  
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
              <div className="text-center">
                <img 
                  src="/lovable-uploads/b85202e0-8c62-45ec-9a0b-b7604644fd7c.png"
                  className="trusted-shield mx-auto"
                  style={{width: '64px', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.4))', marginBottom: '12px'}}
                  alt="Trusted Seller" 
                />
              </div>
              
              <div className="w-full">
                <img alt="Secure checkout by Square with multiple payment options" className="w-full h-auto object-contain rounded-lg" src="/lovable-uploads/21835d64-7d9a-49c8-b6e4-b59d95ce4a18.png" />
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
                <img 
                  src="/lovable-uploads/61f42e0f-6e69-435b-b181-dc50cbb9b324.png"
                  className="flex-shrink-0" 
                  style={{
                    height: '160px',
                    backgroundColor: 'transparent',
                    filter: 'brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
                  }} 
                  alt="Cancel Anytime - Zero Fees" 
                />
                <Users className="w-5 h-5" />
                <span className="font-semibold">Join Our Community of Elite Cannabis Cultivators and AI Enthusiasts</span>
                <img 
                  className="flex-shrink-0" 
                  style={{
                    height: '160px',
                    backgroundColor: 'transparent',
                    filter: 'brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
                  }} 
                  alt="Trusted Seller" 
                  src="/lovable-uploads/72c8715f-f973-49a5-a653-cb3400fe9dd7.png" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
  
  return (
    <div className="min-h-screen bg-background circuit-background">
      <ChatHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="px-8 py-6 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
                  Help us personalize your growing experience
                </h1>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {questions.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-2 w-2 rounded-full ${
                        index === currentStep ? 'bg-accent w-6' : 
                        index < currentStep ? 'bg-primary' : 
                        'bg-white/20'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-accent/80 mt-2">
                  Question {currentStep + 1} of {questions.length}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white tech-font">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.type === "radio" && (
                  <RadioGroup
                    value={quizResponses[currentQuestion.field as keyof QuizResponse] as string}
                    onValueChange={value => setQuizResponses(prev => ({
                      ...prev,
                      [currentQuestion.field]: value
                    }))}
                    className="space-y-4"
                  >
                    {currentQuestion.options.map(option => (
                      <div key={option.value} className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5">
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.value}
                          className="border-accent data-[state=checked]:border-accent data-[state=checked]:text-accent"
                        />
                        <label 
                          htmlFor={option.value}
                          className="text-lg font-medium leading-none cursor-pointer w-full hover:text-accent"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div className="space-y-4">
                    {currentQuestion.options.map(option => (
                      <div key={option.value} className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5">
                        <Checkbox
                          id={option.value}
                          checked={(quizResponses[currentQuestion.field as keyof QuizResponse] as string[] || []).includes(option.value)}
                          onCheckedChange={checked => {
                            const field = currentQuestion.field as keyof QuizResponse;
                            const currentValues = (quizResponses[field] as string[]) || [];
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
                          }}
                          className="border-accent data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                        />
                        <label
                          htmlFor={option.value}
                          className="text-lg font-medium leading-none cursor-pointer w-full hover:text-accent"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="px-6"
                >
                  Previous
                </Button>
                
                <Button 
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="px-6 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                >
                  {currentStep === questions.length - 1 ? 
                    (isSubmitting ? "Saving..." : "Complete Quiz") : 
                    "Next"
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
