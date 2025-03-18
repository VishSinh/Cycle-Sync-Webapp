import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NutritionDetail = {
  key_nutrients: {
    nutrient: string;
    benefits_during_phase: string;
    food_sources: string[];
  }[];
  meal_plan: {
    breakfast_ideas: string[];
    lunch_ideas: string[];
    dinner_ideas: string[];
    snack_ideas: string[];
  };
  hydration_tips: string;
  supplement_recommendations: string[];
};

type NutritionTipsProps = {
  phase: any;
  nutritionDetails?: NutritionDetail;
};

export default function NutritionTips({ phase, nutritionDetails }: NutritionTipsProps) {
  // Default nutrition data if none provided
  const defaultNutrition: Record<string, { title: string, description: string, foods: string[], key_nutrients: string[] }> = {
    "Follicular": {
      title: "Light & Fresh Foods",
      description: "Focus on foods that support estrogen metabolism as estrogen begins to rise in this phase.",
      foods: ["Leafy greens", "Sprouts", "Fermented foods", "Fresh fruits", "Light proteins"],
      key_nutrients: ["Glutathione", "Vitamin B2", "Vitamin B6"]
    },
    "Ovulatory": {
      title: "Raw & Cooling Foods",
      description: "Include foods that support liver function and keep you cool during this high-energy phase.",
      foods: ["Raw vegetables", "Cilantro", "Cucumber", "Mint", "Coconut water"],
      key_nutrients: ["Zinc", "Magnesium", "Vitamin C"]
    },
    "Luteal": {
      title: "Grounding & Complex Carbs",
      description: "Include foods that support progesterone production and stabilize blood sugar.",
      foods: ["Sweet potatoes", "Brown rice", "Lentils", "Avocados", "Dark chocolate"],
      key_nutrients: ["Vitamin B6", "Magnesium", "Calcium"]
    },
    "Menstrual": {
      title: "Warming & Iron-Rich Foods",
      description: "Focus on foods that replenish iron and provide comfort during menstruation.",
      foods: ["Bone broth", "Dark leafy greens", "Grass-fed meat", "Beets", "Warming spices"],
      key_nutrients: ["Iron", "Vitamin C", "Vitamin B12"]
    }
  };

  // Get phase-specific nutrition or default
  const nutrition = defaultNutrition[phase] || defaultNutrition["Luteal"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition for {phase} Phase</CardTitle>
        <CardDescription>{nutrition.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nutrients">Key Nutrients</TabsTrigger>
            <TabsTrigger value="meals">Meal Ideas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <p className="text-sm mb-4">{nutrition.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {nutrition.foods.map((food, i) => (
                <div key={i} className="bg-purple-50 p-2 rounded-md text-center">
                  <p className="text-sm font-medium">{food}</p>
                </div>
              ))}
            </div>
            
            {nutritionDetails?.hydration_tips && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-100">
                <h4 className="font-medium text-yellow-800 mb-1">Hydration Tip</h4>
                <p className="text-sm text-yellow-800">
                  {nutritionDetails.hydration_tips}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nutrients">
            <div className="space-y-4">
              {(nutritionDetails?.key_nutrients || []).map((item, i) => (
                <div key={i} className="bg-white p-3 border rounded-md shadow-sm">
                  <h4 className="font-medium text-purple-700">{item.nutrient}</h4>
                  <p className="text-sm mt-1">{item.benefits_during_phase}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600">Food sources:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.food_sources.map((food, j) => (
                        <span key={j} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {!nutritionDetails?.key_nutrients && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Focus on these key nutrients:</p>
                  <ul className="list-disc pl-5 mt-2">
                    {nutrition.key_nutrients.map((nutrient, i) => (
                      <li key={i} className="text-sm">{nutrient}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="meals">
            {nutritionDetails?.meal_plan ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Breakfast Ideas</h4>
                  <ul className="list-disc pl-5 mt-1">
                    {nutritionDetails.meal_plan.breakfast_ideas.slice(0, 3).map((meal, i) => (
                      <li key={i} className="text-sm">{meal}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Lunch Ideas</h4>
                  <ul className="list-disc pl-5 mt-1">
                    {nutritionDetails.meal_plan.lunch_ideas.slice(0, 3).map((meal, i) => (
                      <li key={i} className="text-sm">{meal}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Dinner Ideas</h4>
                  <ul className="list-disc pl-5 mt-1">
                    {nutritionDetails.meal_plan.dinner_ideas.slice(0, 3).map((meal, i) => (
                      <li key={i} className="text-sm">{meal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm">Meal plan information not available.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}