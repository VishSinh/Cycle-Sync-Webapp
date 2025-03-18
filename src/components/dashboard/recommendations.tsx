type RecommendationsProps = {
  recommendations: {
    nutrition: {
      foods_to_emphasize: string[];
      foods_to_minimize: string[];
      nutrients_to_focus_on: string[];
    };
    exercise: {
      recommended_types: string[];
      intensity_level: string;
      exercises_to_avoid: string[];
    };
    self_care: {
      physical: string[];
      emotional: string[];
      sleep: string[];
    };
  };
  phase: string | undefined;
};

export default function RecommendationsList({ recommendations, phase }: RecommendationsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-1">Nutrition</h3>
        <div className="text-sm space-y-2">
          <p className="font-medium text-xs text-purple-700">Foods to Emphasize:</p>
          <ul className="list-disc pl-5">
            {recommendations.nutrition.foods_to_emphasize.slice(0, 3).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          
          <p className="font-medium text-xs text-purple-700 mt-2">Key Nutrients:</p>
          <ul className="list-disc pl-5">
            {recommendations.nutrition.nutrients_to_focus_on.slice(0, 3).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Exercise</h3>
        <p className="text-xs text-gray-500 mb-1">Recommended Intensity: {recommendations.exercise.intensity_level}</p>
        <ul className="list-disc pl-5 text-sm">
          {recommendations.exercise.recommended_types.slice(0, 3).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Self-care</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium text-xs text-purple-700">Physical:</p>
            <ul className="list-disc pl-5">
              {recommendations.self_care.physical.slice(0, 2).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-xs text-purple-700">Emotional:</p>
            <ul className="list-disc pl-5">
              {recommendations.self_care.emotional.slice(0, 2).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <button className="w-full text-sm text-purple-600 font-medium mt-2">
        View all recommendations →
      </button>
    </div>
  );
}