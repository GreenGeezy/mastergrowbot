import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, CheckCircle, Leaf, Droplets, Sun, Bug, Home } from 'lucide-react';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface QuizQuestion {
  id: string;
  question: string;
  icon: React.ReactNode;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

interface PlantCareQuizProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: (answers: Record<string, string>) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'plant_type',
    question: 'What type of plant are you caring for?',
    icon: <Leaf className="w-6 h-6 text-green-400" />,
    options: [
      { value: 'cannabis', label: 'Cannabis', description: 'Indoor or outdoor cultivation' },
      { value: 'houseplant', label: 'Houseplant', description: 'Decorative indoor plants' },
      { value: 'vegetable', label: 'Vegetables', description: 'Edible garden plants' },
      { value: 'flower', label: 'Flowers', description: 'Ornamental flowering plants' },
      { value: 'herb', label: 'Herbs', description: 'Culinary or medicinal herbs' },
    ]
  },
  {
    id: 'growing_location',
    question: 'Where are you growing your plants?',
    icon: <Home className="w-6 h-6 text-blue-400" />,
    options: [
      { value: 'indoor', label: 'Indoor', description: 'Inside your home or grow room' },
      { value: 'outdoor', label: 'Outdoor', description: 'In your garden or yard' },
      { value: 'greenhouse', label: 'Greenhouse', description: 'Controlled environment structure' },
      { value: 'balcony', label: 'Balcony/Patio', description: 'Outdoor container growing' },
    ]
  },
  {
    id: 'watering_schedule',
    question: 'How often do you typically water your plants?',
    icon: <Droplets className="w-6 h-6 text-blue-400" />,
    options: [
      { value: 'daily', label: 'Daily', description: 'Every day' },
      { value: 'every_2_3_days', label: 'Every 2-3 days', description: 'Regular frequent watering' },
      { value: 'weekly', label: 'Weekly', description: 'Once a week' },
      { value: 'when_dry', label: 'When soil feels dry', description: 'Check soil moisture first' },
      { value: 'irregular', label: 'No set schedule', description: 'Whenever I remember' },
    ]
  },
  {
    id: 'lighting_setup',
    question: 'What kind of lighting do your plants receive?',
    icon: <Sun className="w-6 h-6 text-yellow-400" />,
    options: [
      { value: 'natural_sunlight', label: 'Natural sunlight', description: 'Window or outdoor light' },
      { value: 'led_grow_lights', label: 'LED grow lights', description: 'Full spectrum LED panels' },
      { value: 'fluorescent', label: 'Fluorescent lights', description: 'T5 or CFL bulbs' },
      { value: 'mixed', label: 'Mixed lighting', description: 'Combination of natural and artificial' },
    ]
  },
  {
    id: 'main_concern',
    question: 'What\'s your main concern with plant care?',
    icon: <Bug className="w-6 h-6 text-red-400" />,
    options: [
      { value: 'pests', label: 'Pest control', description: 'Bugs and insects' },
      { value: 'diseases', label: 'Plant diseases', description: 'Mold, rot, or infections' },
      { value: 'nutrition', label: 'Nutrition & feeding', description: 'Proper fertilization' },
      { value: 'growth', label: 'Healthy growth', description: 'Maximizing plant development' },
      { value: 'beginner', label: 'I\'m just starting out', description: 'Learning the basics' },
    ]
  }
];

const PlantCareQuiz = ({ isVisible, onClose, onComplete }: PlantCareQuizProps) => {
  const haptic = useHapticFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isVisible) return null;

  const handleAnswerSelect = (questionId: string, value: string) => {
    haptic.light();
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!answers[quizQuestions[currentQuestion].id]) return;

    haptic.medium();
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Quiz complete
        onComplete(answers);
      }
      setIsAnimating(false);
    }, 150);
  };

  const handlePrevious = () => {
    haptic.light();
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      }
      setIsAnimating(false);
    }, 150);
  };

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];
  const isAnswered = !!answers[question.id];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md bg-gradient-to-br from-background/95 to-card/95 border border-border/50 shadow-2xl transition-all duration-200 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {question.icon}
              <div>
                <h2 className="text-lg font-bold text-foreground">Plant Care Quiz</h2>
                <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quizQuestions.length}</p>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Question */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {question.question}
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose the option that best describes your situation
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.value;
              
              return (
                <div
                  key={option.value}
                  onClick={() => handleAnswerSelect(question.id, option.value)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isSelected
                      ? 'border-green-500 bg-green-500/10 shadow-md'
                      : 'border-border hover:border-border/80 bg-card/50 hover:bg-card/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-green-500 bg-green-500' : 'border-muted-foreground'
                        }`}>
                          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          {option.description && (
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex items-center gap-2 ${
                isLastQuestion
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantCareQuiz;