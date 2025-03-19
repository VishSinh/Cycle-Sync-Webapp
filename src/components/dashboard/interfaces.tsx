interface DashboardData {
  currentPhase: string;
  lastPeriodStart: string;
  avgCycleLength?: number;
  nextPeriodStart?: string;
  daysUntilNextPeriod?: number;
  daysUntilNextPhase: number;
}

interface PhaseInfoData {
  name: string;
  daysInCycle: string;
  hormoneChanges: string;
  commonSymptoms: string[];
  description: string;
}

interface RecommendationsData {
  nutrition: {
    foodsToEmphasize: string[];
    foodsToMinimize: string[];
    nutrientsToFocusOn: string[];
  };
  exercise: {
    recommendedTypes: string[];
    intensityLevel: string;
    exercisesToAvoid: string[];
  };
  selfCare: {
    physical: string[];
    emotional: string[];
    sleep: string[];
  };
}

interface ExerciseDetailsData {
  name: string;
  description: string;
  benefitsDuringPhase: string;
  difficulty: string;
  duration: string;
  modifications: string;
}

interface NutritionDetailsData {
  keyNutrients: {
    nutrient: string;
    benefitsDuringPhase: string;
    foodSources: string[];
  }[];
  mealPlan: {
    breakfastIdeas: string[];
    lunchIdeas: string[];
    dinnerIdeas: string[];
    snackIdeas: string[];
  };
  hydrationTips: string;
  supplementRecommendations: string[];
}

interface LifestyleAdjustmentsData {
  work: string[];
  social: string[];
  relationships: string[];
}

interface HealthWarningData {
  whenToSeekHelp: string[];
}

interface DashboardDetailsData {
  phaseInfo: PhaseInfoData;
  recommendations: RecommendationsData;
  exerciseDetails: ExerciseDetailsData[];
  nutritionDetails: NutritionDetailsData;
  lifestyleAdjustments: LifestyleAdjustmentsData;
  healthWarning: HealthWarningData;
}

export type {
  DashboardData,
  DashboardDetailsData,
  PhaseInfoData,
  RecommendationsData,
  ExerciseDetailsData,
  NutritionDetailsData,
  LifestyleAdjustmentsData,
  HealthWarningData,
};