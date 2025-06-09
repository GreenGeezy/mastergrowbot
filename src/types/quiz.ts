
export type GrowExperience = 'new' | 'intermediate' | 'advanced'
export type GrowingMethod = 'indoor' | 'outdoor' | 'greenhouse'
export type MonitoringMethod = 'manual' | 'basic_sensors' | 'advanced_systems'
export type NutrientType = 'organic' | 'synthetic' | 'both' | 'none'

export interface QuizResponse {
  goals: string[]
  experience_level: GrowExperience
  growing_method: GrowingMethod
  challenges: string[]
  monitoring_method: MonitoringMethod
  nutrient_type: NutrientType
}
