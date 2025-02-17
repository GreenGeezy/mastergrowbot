
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@supabase/auth-helpers-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'
import type { QuizResponse } from '@/types/quiz'

export default function Quiz() {
  const session = useSession()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)

  const [quizResponses, setQuizResponses] = useState<Partial<QuizResponse>>({
    experience_level: undefined,
    growing_method: undefined,
    challenges: [],
    monitoring_method: undefined,
    nutrient_type: undefined,
    goals: [],
  })

  const questions = [
    {
      question: "How long have you been growing?",
      type: "radio",
      field: "experience_level",
      options: [
        { label: "I'm new", value: "new" },
        { label: "6 months - 2 years", value: "intermediate" },
        { label: "Over 2 years", value: "advanced" },
      ],
    },
    {
      question: "How do you plan on growing?",
      type: "radio",
      field: "growing_method",
      options: [
        { label: "Indoor", value: "indoor" },
        { label: "Outdoor", value: "outdoor" },
        { label: "Greenhouse", value: "greenhouse" },
      ],
    },
    {
      question: "What challenges have you faced in your previous grow cycles?",
      type: "checkbox",
      field: "challenges",
      options: [
        { label: "Pests", value: "pests" },
        { label: "Nutrient deficiencies", value: "nutrient_deficiencies" },
        { label: "Environmental issues", value: "environmental_issues" },
        { label: "No challenges faced", value: "none" },
      ],
    },
    {
      question: "How do you monitor your growing conditions?",
      type: "radio",
      field: "monitoring_method",
      options: [
        { label: "Manual checks", value: "manual" },
        { label: "Basic sensors", value: "basic_sensors" },
        { label: "Advanced monitoring systems", value: "advanced_systems" },
      ],
    },
    {
      question: "What type of nutrients do you use for your plants?",
      type: "radio",
      field: "nutrient_type",
      options: [
        { label: "Organic nutrients", value: "organic" },
        { label: "Synthetic nutrients", value: "synthetic" },
        { label: "Both", value: "both" },
        { label: "I don't use nutrients", value: "none" },
      ],
    },
    {
      question: "What would you like Master Growbot to help you achieve?",
      type: "checkbox",
      field: "goals",
      options: [
        { label: "Have fun and learn", value: "learn" },
        { label: "Improve quality and potency", value: "quality" },
        { label: "Increase profits", value: "profits" },
        { label: "All of the above", value: "all" },
      ],
    },
  ]

  const handleNextStep = () => {
    const currentQuestion = questions[currentStep]
    const currentAnswer = quizResponses[currentQuestion.field as keyof QuizResponse]
    
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      toast({
        title: "Please answer the question",
        description: "Select at least one option to continue",
        variant: "destructive",
      })
      return
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    if (session?.user?.id) {
      try {
        const { error } = await supabase
          .from('quiz_responses')
          .upsert({
            user_id: session.user.id,
            ...quizResponses,
          })

        if (error) throw error
      } catch (error) {
        console.error('Error saving quiz responses:', error)
      }
    }

    setShowSubscription(true)
    setIsSubmitting(false)
  }

  if (showSubscription) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 circuit-background">
        <div className="w-full max-w-[1200px] space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
              Unlock Your Growing Potential
            </h1>
            <p className="text-lg text-white/80">
              Get personalized AI guidance for your growing journey
            </p>
          </div>
          
          <div className="flex flex-row gap-4 items-stretch justify-center flex-wrap md:flex-nowrap mb-8">
            <div className="w-[259px] flex flex-col font-['Rubik'] bg-card rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src="https://items-images-production.s3.us-west-2.amazonaws.com/files/717caf5133f5cf6d865bc3dd16cb11cc4be13d0a/original.png" 
                  alt="Master Growbot AI Weekly Subscription" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="min-h-[76px]">
                  <h3 className="text-[20px] leading-[24px] font-bold text-white">
                    Master Growbot AI Weekly Subscription
                  </h3>
                </div>
                <p className="text-[18px] leading-[20px] text-white/80 h-[24px]">
                  $9.99/Week Cancel Anytime
                </p>
                <a 
                  href="https://square.link/u/TgbFtDnS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <img 
                    src="/lovable-uploads/818204f9-154f-424e-a8e6-945a4c0b601e.png"
                    alt="Buy Now with Square"
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>

            <div className="w-[259px] flex flex-col font-['Rubik'] bg-card rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src="https://items-images-production.s3.us-west-2.amazonaws.com/files/06a35f41d5f7b28f98ff3a4fded063b66f5aee76/original.png" 
                  alt="Master Growbot AI Quarterly Subscription" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="min-h-[76px]">
                  <h3 className="text-[20px] leading-[24px] font-bold text-white">
                    Master Growbot AI Quarterly Subscription
                  </h3>
                </div>
                <p className="text-[20px] leading-[24px] text-white/80 mb-4">
                  $89 (Save 25%) Cancel Anytime
                </p>
                <a 
                  href="https://square.link/u/5Re3cMLs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <img 
                    src="/lovable-uploads/31c87611-9760-4dfe-815c-d80e9344827d.png"
                    alt="Buy Now with Square"
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>

            <div className="w-[259px] flex flex-col font-['Rubik'] bg-card rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src="https://items-images-production.s3.us-west-2.amazonaws.com/files/f79453c5b8c01e6fe4805b6ac378f6e2568cc993/original.png" 
                  alt="Master Growbot AI Yearly Subscription" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="min-h-[76px]">
                  <h3 className="text-[20px] leading-[24px] font-bold text-white">
                    Master Growbot AI Yearly Subscription
                  </h3>
                </div>
                <p className="text-[18px] leading-[20px] text-white/80 h-[24px]">
                  $199 (Save Over 60%) Cancel Anytime
                </p>
                <a 
                  href="https://square.link/u/1lsuAJjC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <img 
                    src="/lovable-uploads/1127ed9a-5b10-4fd5-b958-7bb28a392335.png"
                    alt="Buy Now with Square"
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate('/chat')}
              className="px-6 w-full max-w-md"
            >
              Skip for now
            </Button>
            
            <div className="w-full">
              <img 
                src="/lovable-uploads/ff2ab745-26e7-4388-a649-035f5b9ca60f.png"
                alt="Secure checkout by Square with multiple payment options"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 circuit-background">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
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
                        index === currentStep
                          ? 'bg-accent w-6'
                          : index < currentStep
                          ? 'bg-primary'
                          : 'bg-white/20'
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
                    onValueChange={(value) =>
                      setQuizResponses((prev) => ({
                        ...prev,
                        [currentQuestion.field]: value,
                      }))
                    }
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5"
                      >
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
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5"
                      >
                        <Checkbox
                          id={option.value}
                          checked={quizResponses[currentQuestion.field as keyof QuizResponse]?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const field = currentQuestion.field as keyof QuizResponse
                            const currentValues = (quizResponses[field] as string[]) || []
                            
                            if (checked) {
                              if (option.value === 'all' || option.value === 'none') {
                                setQuizResponses((prev) => ({
                                  ...prev,
                                  [field]: [option.value],
                                }))
                              } else {
                                setQuizResponses((prev) => ({
                                  ...prev,
                                  [field]: [...currentValues.filter(v => v !== 'all' && v !== 'none'), option.value],
                                }))
                              }
                            } else {
                              setQuizResponses((prev) => ({
                                ...prev,
                                [field]: currentValues.filter((value) => value !== option.value),
                              }))
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
                  {currentStep === questions.length - 1 
                    ? (isSubmitting ? "Saving..." : "Complete Quiz")
                    : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
