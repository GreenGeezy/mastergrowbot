
export type GrowExperience = 'new' | 'intermediate' | 'advanced'
export type GrowingMethod = 'indoor' | 'outdoor' | 'greenhouse'
export type MonitoringMethod = 'manual' | 'basic_sensors' | 'advanced_systems'
export type NutrientType = 'organic' | 'synthetic' | 'both' | 'none'

export interface QuizResponse {
  experience_level: GrowExperience
  growing_method: GrowingMethod
  challenges: string[]
  monitoring_method: MonitoringMethod
  nutrient_type: NutrientType
  goals: string[]
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'What is your experience level with growing?',
    options: ['Complete beginner', 'Some experience', 'Experienced grower']
  },
  {
    id: 'growing_method',
    question: 'Where do you plan to grow?',
    options: ['Indoor grow room', 'Outdoor garden', 'Greenhouse']
  },
  {
    id: 'monitoring',
    question: 'How would you like to monitor your plants?',
    options: ['Manual monitoring', 'Basic sensors', 'Advanced automation']
  },
  {
    id: 'nutrients',
    question: 'What type of nutrients do you prefer?',
    options: ['Organic only', 'Synthetic nutrients', 'Mix of both', 'Not sure yet']
  }
];
