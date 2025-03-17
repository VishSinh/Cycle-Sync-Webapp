type RecommendationsProps = {
  recommendations: {
    nutrition: string[];
    exercise: string[];
    selfCare: string[];
  };
  phase: string;
};

export default function RecommendationsList({ recommendations, phase }: RecommendationsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-1">Nutrition</h3>
        <ul className="list-disc pl-5 text-sm">
          {recommendations.nutrition.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Exercise</h3>
        <ul className="list-disc pl-5 text-sm">
          {recommendations.exercise.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Self-care</h3>
        <ul className="list-disc pl-5 text-sm">
          {recommendations.selfCare.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}