type ExerciseSectionProps = {
  phase: string;
};

export default function ExerciseSection({ phase }: ExerciseSectionProps) {
  // Different exercises based on cycle phase
  const exercisesByPhase: Record<string, { title: string, description: string, intensity: string }[]> = {
    "Menstrual": [
      { title: "Gentle Yoga", description: "Focus on restorative poses", intensity: "Low" },
      { title: "Walking", description: "Light 15-20 min walks", intensity: "Low" },
      { title: "Stretching", description: "Full body gentle stretching", intensity: "Low" },
    ],
    "Follicular": [
      { title: "HIIT", description: "High intensity interval training", intensity: "High" },
      { title: "Running", description: "Moderate to fast pace", intensity: "High" },
      { title: "Weight Training", description: "Focus on building strength", intensity: "Medium-High" },
    ],
    "Ovulatory": [
      { title: "Circuit Training", description: "Full body workout circuits", intensity: "High" },
      { title: "Group Fitness", description: "Classes like dance or kickboxing", intensity: "High" },
      { title: "Team Sports", description: "Basketball, volleyball, etc", intensity: "High" },
    ],
    "Luteal": [
      { title: "Pilates", description: "Core strengthening", intensity: "Medium" },
      { title: "Swimming", description: "Low impact cardio", intensity: "Medium" },
      { title: "Light Weightlifting", description: "Maintenance, not max effort", intensity: "Medium" },
    ]
  };

  // Default to follicular if phase not found
  const exercises = exercisesByPhase[phase] || exercisesByPhase["Follicular"];

  return (
    <div className="space-y-4">
      {exercises.map((exercise, i) => (
        <div key={i} className="bg-white border rounded-md p-3 shadow-sm">
          <div className="flex justify-between">
            <h4 className="font-medium">{exercise.title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              exercise.intensity === "Low" ? "bg-green-100 text-green-800" :
              exercise.intensity === "Medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {exercise.intensity}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
        </div>
      ))}
      <button className="w-full text-sm text-purple-600 font-medium mt-2">
        View more exercises →
      </button>
    </div>
  );
}