import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PhaseInfoProps = {
  phaseInfo: {
    name: string;
    days_in_cycle: string;
    hormone_changes: string;
    common_symptoms: string[];
    description: string;
  };
};

export default function PhaseInfo({ phaseInfo }: PhaseInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Your Current Phase</CardTitle>
        <CardDescription>{phaseInfo.days_in_cycle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">{phaseInfo.description}</p>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Hormonal Changes</h3>
            <p className="text-sm bg-purple-50 p-3 rounded-md">{phaseInfo.hormone_changes}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Common Symptoms</h3>
            <div className="grid grid-cols-2 gap-2">
              {phaseInfo.common_symptoms.map((symptom, i) => (
                <div key={i} className="bg-gray-50 px-3 py-2 rounded-md text-sm">
                  {symptom}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}