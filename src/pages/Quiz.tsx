import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { quizQuestions } from '@/types/quiz';

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    setCurrentStep('questions');
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestionIndex].id]: answer
    }));

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateRecommendations();
      setCurrentStep('recommendations');
    }
  };

  const generateRecommendations = () => {
    const mockRecommendations = [
      "Based on your growing environment, we recommend starting with autoflowering strains.",
      "Your space is perfect for a small-scale hydroponic setup.",
      "Given your experience level, we suggest beginning with 2-3 plants.",
      "Our AI assistant will help you maintain optimal temperature and humidity levels."
    ];
    setRecommendations(mockRecommendations);
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep === 'intro' && (
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold mb-4">Let's Customize Your Growing Journey</h1>
              <p className="text-xl text-gray-300">
                Answer a few questions to get personalized growing recommendations
              </p>
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="mt-8 px-8 py-6 text-lg bg-primary hover:bg-primary/90"
              >
                Start Quiz
              </Button>
            </div>
          )}

          {currentStep === 'questions' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>

                <div className="grid gap-4">
                  {quizQuestions[currentQuestionIndex].options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      variant="outline"
                      className="w-full text-left justify-start py-6 text-lg"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'recommendations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Your Personalized Growing Plan</h2>
              
              <div className="bg-card p-6 rounded-lg space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-background/50 p-4 rounded-md">
                    <p className="text-lg">{rec}</p>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4">
                <Button
                  onClick={handleProceedToPayment}
                  size="lg"
                  className="w-full md:w-auto px-8 py-6 text-lg bg-primary hover:bg-primary/90"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
