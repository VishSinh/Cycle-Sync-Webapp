import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type NutritionTipsProps = {
  phase: any;
};

export default function NutritionTips({ phase }: NutritionTipsProps) {
  // Different nutrition tips based on cycle phase
  const nutritionByPhase: Record<string, { title: string, description: string, foods: string[] }> = {
    "Follicular": {
      title: "Light & Fresh Foods",
      description: "Focus on foods that support estrogen metabolism as estrogen begins to rise in this phase.",
      foods: ["Leafy greens", "Sprouts", "Fermented foods", "Fresh fruits", "Light proteins"]
    },
    "Ovulatory": {
      title: "Raw & Cooling Foods",
      description: "Include foods that support liver function and keep you cool during this high-energy phase.",
      foods: ["Raw vegetables", "Cilantro", "Cucumber", "Mint", "Coconut water"]
    },
    "Luteal": {
      title: "Grounding & Complex Carbs",
      description: "Include foods that support progesterone production and stabilize blood sugar.",
      foods: ["Sweet potatoes", "Brown rice", "Lentils", "Avocados", "Dark chocolate"]
    },
    "Menstrual": {
      title: "Warming & Iron-Rich Foods",
      description: "Focus on foods that replenish iron and provide comfort during menstruation.",
      foods: ["Bone broth", "Dark leafy greens", "Grass-fed meat", "Beets", "Warming spices"]
    }
  };

  // Default to follicular if phase not found
  const nutrition = nutritionByPhase[phase] || nutritionByPhase["Follicular"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition for {phase} Phase</CardTitle>
        <CardDescription>{nutrition.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{nutrition.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {nutrition.foods.map((food, i) => (
            <div key={i} className="bg-purple-50 p-2 rounded-md text-center">
              <p className="text-sm font-medium">{food}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-100">
          <h4 className="font-medium text-yellow-800 mb-1">Pro Tip</h4>
          <p className="text-sm text-yellow-800">
            Meal prep on weekends to ensure you have phase-appropriate foods ready during busy days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}