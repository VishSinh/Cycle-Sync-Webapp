type Exercise = {
  name: string;
  description: string;
  benefitsDuringPhase: string;
  difficulty: string;
  duration: string;
  modifications?: string;
};

type ExerciseSectionProps = {
  phase: any;
  exerciseDetails?: Exercise[];
};

export default function ExerciseSection({ phase, exerciseDetails }: ExerciseSectionProps) {
  
  // Default exercise data if none is provided
  const defaultExercises: Record<string, Exercise[]> = {
    "Menstrual": [
      { 
        name: "Gentle Yoga", 
        description: "Focus on restorative poses", 
        benefitsDuringPhase: "Relieves cramps and reduces stress",
        difficulty: "easy", 
        duration: "15-30 minutes" 
      },
      { 
        name: "Walking", 
        description: "Light 15-20 min walks", 
        benefitsDuringPhase: "Improves circulation without strain",
        difficulty: "easy", 
        duration: "15-20 minutes" 
      },
      { 
        name: "Stretching", 
        description: "Full body gentle stretching", 
        benefitsDuringPhase: "Reduces muscle tension",
        difficulty: "easy", 
        duration: "10-15 minutes" 
      },
    ],
    "Follicular": [
      { 
        name: "HIIT", 
        description: "High intensity interval training", 
        benefitsDuringPhase: "Takes advantage of increased energy levels",
        difficulty: "hard", 
        duration: "20-30 minutes" 
      },
      { 
        name: "Running", 
        description: "Moderate to fast pace", 
        benefitsDuringPhase: "Builds cardiovascular strength",
        difficulty: "hard", 
        duration: "30-45 minutes" 
      },
      { 
        name: "Weight Training", 
        description: "Focus on building strength", 
        benefitsDuringPhase: "Increases muscle mass when estrogen is high",
        difficulty: "medium", 
        duration: "45-60 minutes" 
      },
    ],
    "Ovulatory": [
      { 
        name: "Circuit Training", 
        description: "Full body workout circuits", 
        benefitsDuringPhase: "Takes advantage of peak energy levels",
        difficulty: "hard", 
        duration: "30-45 minutes" 
      },
      { 
        name: "Group Fitness", 
        description: "Classes like dance or kickboxing", 
        benefitsDuringPhase: "Harnesses social energy of this phase",
        difficulty: "hard", 
        duration: "45-60 minutes" 
      },
      { 
        name: "Team Sports", 
        description: "Basketball, volleyball, etc", 
        benefitsDuringPhase: "Utilizes peak coordination and energy",
        difficulty: "hard", 
        duration: "60+ minutes" 
      },
    ],
    "Luteal": [
      { 
        name: "Pilates", 
        description: "Core strengthening", 
        benefitsDuringPhase: "Gentler on the body while still effective",
        difficulty: "medium", 
        duration: "30-45 minutes" 
      },
      { 
        name: "Swimming", 
        description: "Low impact cardio", 
        benefitsDuringPhase: "Reduces bloating and water retention",
        difficulty: "medium", 
        duration: "30-45 minutes" 
      },
      { 
        name: "Light Weightlifting", 
        description: "Maintenance, not max effort", 
        benefitsDuringPhase: "Maintains strength without adding stress",
        difficulty: "medium", 
        duration: "30-45 minutes" 
      },
    ]
  };

  // Use provided details or fallback to default
  const exercises = exerciseDetails || defaultExercises[phase] || defaultExercises["Luteal"];

  return (
    <div className="space-y-4">
      {exercises.map((exercise, i) => (
        <div key={i} className="bg-white border rounded-md p-3 shadow-sm">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{exercise.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              exercise.difficulty === "easy" ? "bg-green-100 text-green-800" :
              exercise.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {exercise.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
          <div className="mt-2">
            <p className="text-xs text-purple-700 font-medium">Benefits during {phase} phase:</p>
            <p className="text-xs text-gray-600">{exercise.benefitsDuringPhase}</p>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{exercise.duration}</span>
          </div>
        </div>
      ))}
      <button className="w-full text-sm text-purple-600 font-medium mt-2">
        View more exercises →
      </button>
    </div>
  );
}