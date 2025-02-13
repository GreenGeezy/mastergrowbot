
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
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save your quiz responses",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('quiz_responses')
        .upsert({
          user_id: session.user.id,
          ...quizResponses,
        })

      if (error) throw error

      toast({
        title: "Quiz completed!",
        description: "Your responses have been saved successfully.",
      })

      navigate('/chat')
    } catch (error) {
      console.error('Error saving quiz responses:', error)
      toast({
        title: "Error",
        description: "Failed to save your responses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-center text-foreground">
            Help us personalize your growing experience
          </h1>
          <p className="text-center text-muted-foreground">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
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
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "checkbox" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
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
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Complete Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
