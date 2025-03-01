import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { QuizResponse, GrowExperience, GrowingMethod, MonitoringMethod, NutrientType, QuizQuestion } from '@/types/quiz';
import { Star, Award, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TEMP_QUIZ_RESPONSES_KEY = 'mg_temp_quiz_responses';

// Safe JSON parser to prevent crashes
const safelyParseJSON = (jsonString: string | null) => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export default function Quiz() {
  console.log("Quiz component rendering..."); // Debugging
  
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  // Initialize quiz responses safely
  const [quizResponses, setQuizResponses] = useState<Partial<QuizResponse>>(() => {
    try {
      const savedResponses = sessionStorage.getItem(TEMP_QUIZ_RESPONSES_KEY);
      console.log("Loaded saved responses:", savedResponses); // Debugging
      
      const parsed = safelyParseJSON(savedResponses);
      
      if (parsed) {
        return {
          ...parsed,
          // Ensure challenges and goals are always arrays
          challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
          goals: Array.isArray(parsed.goals) ? parsed.goals : []
        };
      }
    } catch (error) {
      console.error("Error initializing quiz responses:", error);
    }
    
    // Default empty values
    return {
      experience_level: undefined,
      growing_method: undefined,
      challenges: [],
      monitoring_method: undefined,
      nutrient_type: undefined,
      goals: []
    };
  });
  
  const [timeLeft, setTimeLeft] = useState("");

  // Save responses to session storage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(TEMP_QUIZ_RESPONSES_KEY, JSON.stringify(quizResponses));
    } catch (error) {
      console.error("Error saving quiz responses to session storage:", error);
    }
  }, [quizResponses]);

  // Timer for promotional countdown
  useEffect(() => {
    const targetDate = new Date('2025-07-10T05:00:00.000Z');
    
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

  // Quiz questions configuration
  const questions: QuizQuestion[] = [
    {
      question: "How long have you been growing?",
      type: "radio",
      field: "experience_level",
      options: [
        {
          label: "I'm new",
          value: "new"
        }, 
        {
          label: "6 months - 2 years",
          value: "intermediate"
        }, 
        {
          label: "Over 2 years",
          value: "advanced"
        }
      ]
    }, 
    {
      question: "How do you plan on growing?",
      type: "radio",
      field: "growing_method",
      options: [
        {
          label: "Indoor",
          value: "indoor"
        }, 
        {
          label: "Outdoor",
          value: "outdoor"
        }, 
        {
          label: "Greenhouse",
          value: "greenhouse"
        }
      ]
    }, 
    {
      question: "What challenges have you faced in your previous grow cycles?",
      type: "checkbox",
      field: "challenges",
      options: [
        {
          label: "Pests",
          value: "pests"
        }, 
        {
          label: "Nutrient deficiencies",
          value: "nutrient_deficiencies"
        }, 
        {
          label: "Environmental issues",
          value: "environmental_issues"
        }, 
        {
          label: "No challenges faced",
          value: "none"
        }
      ]
    }, 
    {
      question: "How do you monitor your growing conditions?",
      type: "radio",
      field: "monitoring_method",
      options: [
        {
          label: "Manual checks",
          value: "manual"
        }, 
        {
          label: "Basic sensors",
          value: "basic_sensors"
        }, 
        {
          label: "Advanced monitoring systems",
          value: "advanced_systems"
        }
      ]
    }, 
    {
      question: "What type of nutrients do you use for your plants?",
      type: "radio",
      field: "nutrient_type",
      options: [
        {
          label: "Organic nutrients",
          value: "organic"
        }, 
        {
          label: "Synthetic nutrients",
          value: "synthetic"
        }, 
        {
          label: "Both",
          value: "both"
        }, 
        {
          label: "I don't use nutrients",
          value: "none"
        }
      ]
    }, 
    {
      question: "What would you like Master Growbot to help you achieve?",
      type: "checkbox",
      field: "goals",
      options: [
        {
          label: "Have fun and learn",
          value: "learn"
        }, 
        {
          label: "Improve quality and potency",
          value: "quality"
        }, 
        {
          label: "Increase yields and profits",
          value: "profits"
        }, 
        {
          label: "All of the above",
          value: "all"
        }
      ]
    }
  ];

  const handleNextStep = () => {
    console.log("Next step clicked, current step:", currentStep); // Debugging
    
    if (currentStep >= questions.length) {
      console.error('Invalid step index:', currentStep);
      toast({
        title: "Error",
        description: "An error occurred with the quiz navigation",
        variant: "destructive"
      });
      return;
    }
    
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) {
      console.error('Question not found at index:', currentStep);
      return;
    }
    
    const currentAnswer = quizResponses[currentQuestion.field];
    
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
          challenges: quizResponses.challenges || [],
          goals: quizResponses.goals || []
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
            challenges: quizResponses.challenges || [],
            monitoring_method: quizResponses.monitoring_method,
            nutrient_type: quizResponses.nutrient_type,
            goals: quizResponses.goals || []
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

  // Safety check for step index
  if (currentStep >= questions.length) {
    console.error('Invalid step index outside render:', currentStep);
    setCurrentStep(0);
    return null;
  }

  const currentQuestion = questions[currentStep];
  // Safety check for current question
  if (!currentQuestion) {
    console.error('Current question not found:', currentStep);
    return (
      <div className="min-h-screen bg-background circuit-background">
        <ChatHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h1 className="text-3xl font-bold">Error Loading Quiz</h1>
            <p className="mt-4">There was a problem loading the quiz questions.</p>
            <Button 
              className="mt-6" 
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If we need to show the subscription page
  if (showSubscription) {
    return (
      <div className="min-h-screen bg-background circuit-background">
        <ChatHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="w-full max-w-[1200px] space-y-6 mx-auto">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">Unlock Your AI Growing SuperPowers</h1>
              <p className="text-lg text-white/80">Grow Bigger, Grow Better with Master Growbot</p>
              
              <div className="flex flex-col items-center space-y-4 mt-4">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 max-w-2xl">
                  <p className="text-white italic text-sm">"Brilliant Technology! Master Growbot saved my new strain from dying, saving me thousands of dollars and time." – Dr. Sergio, Licensed Medical Practitioner & Grower</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#FFD700]">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Join Our Community of Elite Cannabis Cultivators and AI Enthusiasts</span>
                </div>
                <div className="flex flex-col items-center space-y-0">
                  <p className="text-sm sm:text-base text-center font-medium text-[#FFD700] mb-1">
                    Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <Award className="w-7 h-7 text-[#FFD700] animate-float will-change-transform" />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => <Star key={index} className="w-6 h-6 fill-[#FFD700] text-[#FFD700]" />)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#9b87f5] rounded-lg p-4 mt-6 text-center transform hover:scale-105 transition-transform duration-300">
                <p className="text-white font-bold text-lg">Unlock 25% Off Quarterly & Over 60% Off Yearly—Offer Ends 7/10/25!</p>
                <p className="text-[#FFD700] font-mono font-bold text-xl">{timeLeft}</p>
              </div>
            </div>
            
            <div className="flex flex-row gap-3 items-stretch justify-center flex-wrap md:flex-nowrap mb-4 mx-0 my-0 py-0 px-0 rounded">
              <div className="w-[259px] flex flex-col font-['Rubik'] bg-card rounded-lg overflow-hidden border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img alt="Master Growbot AI Weekly Subscription" src="/lovable-uploads/11c38940-4f96-4ad6-b79b-fe4d9552e390.png" className="w-full h-[146px] object-cover rounded-t-lg" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }} />
                </div>
                <div className="p-3 pt-2 pb-2 flex flex-col flex-grow">
                  <div className="min-h-[60px]">
                    <h3 className="leading-[20px] font-bold text-white text-lg">
                      Master Growbot AI Weekly Subscription
                    </h3>
                  </div>
                  <ul className="space-y-1 mb-2 text-white/80">
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span className="font-bold">$9.99/week</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span>Cancel Anytime</span>
                    </li>
                  </ul>
                  <a href="https://square.link/u/TgbFtDnS" target="_blank" rel="noopener noreferrer" className="-mt-1 transform hover:scale-105 transition-transform duration-300">
                    <img src="/lovable-uploads/818204f9-154f-424e-a8e6-945a4c0b601e.png" alt="Buy Now with Square" className="w-full h-auto scale-110" />
                  </a>
                </div>
              </div>

              <div className="w-[259px] flex flex-col font-['Rubik'] bg-card rounded-lg overflow-hidden border-2 border-secondary/30 bg-gradient-to-b from-secondary/10 to-transparent">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img alt="Master Growbot AI Quarterly Subscription" src="/lovable-uploads/adb60fe7-fe3d-4e0c-a42c-ac3f1617f4d0.png" className="w-full h-[146px] object-cover rounded-t-lg" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }} />
                </div>
                <div className="p-3 pt-2 pb-2 flex flex-col flex-grow">
                  <div className="min-h-[60px]">
                    <h3 className="leading-[20px] font-bold text-white text-lg">
                      Master Growbot AI Quarterly Subscription
                    </h3>
                  </div>
                  <ul className="space-y-1 mb-2 text-white/80">
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span className="font-bold">$89/quarter</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span>Save 25%</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span>Cancel Anytime</span>
                    </li>
                  </ul>
                  <a href="https://square.link/u/5Re3cMLs" target="_blank" rel="noopener noreferrer" className="-mt-1 transform hover:scale-105 transition-transform duration-300">
                    <img src="/lovable-uploads/31c87611-9760-4dfe-815c-d80e9344827d.png" alt="Buy Now with Square" className="w-full h-auto scale-110" />
                  </a>
                </div>
              </div>

              <div className="w-[259px] flex flex-col font-['Rubik'] bg-card rounded-lg overflow-hidden border-2 border-[#FFD700]/30 bg-gradient-to-b from-[#FFD700]/10 to-transparent relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-black text-[#FFD700] border border-[#FFD700] px-3 py-1 text-sm font-semibold">
                    Best Value
                  </Badge>
                </div>
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img src="https://items-images-production.s3.us-west-2.amazonaws.com/files/f79453c5b8c01e6fe4805b6ac378f6e2568cc993/original.png" alt="Master Growbot AI Yearly Subscription" className="w-full h-[146px] object-cover rounded-t-lg" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }} />
                </div>
                <div className="p-3 pt-2 pb-2 flex flex-col flex-grow">
                  <div className="min-h-[60px]">
                    <h3 className="leading-[20px] font-bold text-white text-lg">
                      Master Growbot AI Yearly Subscription
                    </h3>
                  </div>
                  <ul className="space-y-1 mb-2 text-white/80">
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span className="font-bold">$199/year</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span>Save Over 60%</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">–</span>
                      <span>Cancel Anytime</span>
                    </li>
                  </ul>
                  <a href="https://square.link/u/1lsuAJjC" target="_blank" rel="noopener noreferrer" className="-mt-1 transform hover:scale-105 transition-transform duration-300">
                    <img src="/lovable-uploads/1127ed9a-5b10-4fd5-b958-7bb28a392335.png" alt="Buy Now with Square" className="w-full h-auto scale-110" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto">
              <div className="w-full">
                <img alt="Secure checkout by Square with multiple payment options" className="w-full h-auto object-contain rounded-lg" src="/lovable-uploads/21835d64-7d9a-49c8-b6e4-b59d95ce4a18.png" />
              </div>
              
              <Button variant="outline" onClick={() => navigate('/chat')} className="px-6 w-full max-w-md h-12 text-base hover:bg-white/5 border-white/20 transition-colors duration-200">
                No thanks, I want to stay basic
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular quiz UI
  console.log("Rendering quiz UI, current step:", currentStep);
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
                    value={String(quizResponses[currentQuestion.field] || '')}
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
                          checked={Array.isArray(quizResponses[currentQuestion.field]) && 
                            (quizResponses[currentQuestion.field] as string[] || []).includes(option.value)}
                          onCheckedChange={checked => {
                            const field = currentQuestion.field;
                            const currentValues = Array.isArray(quizResponses[field]) 
                              ? [...quizResponses[field] as string[]] 
                              : [];
                              
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
