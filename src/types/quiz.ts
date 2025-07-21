
export type GrowExperience = 'new' | 'intermediate' | 'advanced'
export type GrowingMethod = 'indoor' | 'outdoor' | 'greenhouse'
export type MonitoringMethod = 'manual' | 'basic_sensors' | 'advanced_systems'
export type NutrientType = 'organic' | 'synthetic' | 'both' | 'none'
export type PlantQuantity = '1_4' | '5_20' | '21_100' | '101_500' | '500_plus'

export interface QuizResponse {
  goals: string[]
  experience_level: GrowExperience
  growing_method: GrowingMethod
  challenges: string[]
  monitoring_method: MonitoringMethod
  nutrient_type: NutrientType
  plant_quantity: PlantQuantity
}
