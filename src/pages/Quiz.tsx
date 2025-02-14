
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 circuit-background animate-fade-in">
        <div className="w-full max-w-2xl">
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
            <div className="relative px-8 py-6 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
                    Unlock Your Growing Potential
                  </h1>
                  <p className="text-lg text-white/80">
                    Get personalized AI guidance for your growing journey
                  </p>
                </div>
                
                <div className="mx-auto w-[259px] bg-white rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 font-['Rubik']">
                  <img 
                    src="https://items-images-production.s3.us-west-2.amazonaws.com/files/1b6495bf2f2383d7f26be999d628cd32922ad0d3/original.png" 
                    alt="Master Growbot AI" 
                    className="w-full h-auto rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <div className="p-5 space-y-3">
                    <p className="text-[18px] leading-[20px] text-gray-800">
                      Master Growbot AI
                    </p>
                    <p className="text-[18px] leading-[20px] font-semibold text-gray-900">
                      $9.99 - $199.00
                    </p>
                    <a 
                      href="https://checkout.square.site/merchant/MLSBW63ZJHNHQ/checkout/PZ2JH5LRAUO2T2ZMDC5MUMBC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-[18px] leading-[48px] h-[48px] text-white bg-[#006aff] text-center shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset] rounded-[6px] hover:bg-[#0055cc] transition-colors duration-300"
                    >
                      Buy now
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/chat')}
                    className="relative group px-6"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-glow to-accent-glow rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-200" />
                    <span className="relative">Skip for now</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 circuit-background animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
          <div className="relative px-8 py-6 bg-card rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
                  Help us personalize your growing experience
                </h1>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
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
                        className="relative group flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-all duration-300"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="border-accent data-[state=checked]:border-accent data-[state=checked]:text-accent"
                        />
                        <label
                          htmlFor={option.value}
                          className="text-lg font-medium leading-none cursor-pointer w-full hover:text-accent transition-colors"
                        >
                          {option.label}
                        </label>
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-glow/20 to-accent-glow/20 blur" />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div className="space-y-4">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="relative group flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-all duration-300"
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
                          className="text-lg font-medium leading-none cursor-pointer w-full hover:text-accent transition-colors"
                        >
                          {option.label}
                        </label>
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-glow/20 to-accent-glow/20 blur" />
                        </div>
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
                  className="relative group px-6"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-glow to-accent-glow rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-200" />
                  <span className="relative">Previous</span>
                </Button>
                
                <Button
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="relative group px-6 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-glow to-accent-glow rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-200" />
                  <span className="relative">
                    {currentStep === questions.length - 1 
                      ? (isSubmitting ? "Saving..." : "Complete Quiz")
                      : "Next"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
