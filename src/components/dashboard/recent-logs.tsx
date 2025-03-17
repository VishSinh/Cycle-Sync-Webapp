import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LogEntry = {
  date: string;
  symptom: string;
  mood: string;
  notes?: string;
};

type RecentLogsProps = {
  logs: LogEntry[];
};

export default function RecentLogs({ logs }: RecentLogsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>Your latest symptom and mood entries</CardDescription>
        </div>
        <Button size="sm" variant="outline">Add New Log</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium">{log.date}</p>
                <p className="text-sm text-muted-foreground">Symptoms: {log.symptom}</p>
                {log.notes && <p className="text-xs text-gray-400 mt-1">{log.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm">Mood: {log.mood}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}