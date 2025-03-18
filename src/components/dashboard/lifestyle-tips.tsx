import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LifestyleTipsProps = {
  lifestyle: {
    work: string[];
    social: string[];
    relationships: string[];
  };
  when_to_seek_help: string[];
};

export default function LifestyleTips({ lifestyle, when_to_seek_help }: LifestyleTipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle Adjustments</CardTitle>
        <CardDescription>Tips for your daily routines</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="work">
          <TabsList className="mb-4 grid grid-cols-3 w-full">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          
          <TabsContent value="work">
            <ul className="space-y-2">
              {lifestyle.work.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-2 mt-1 text-purple-600">•</div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="social">
            <ul className="space-y-2">
              {lifestyle.social.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-2 mt-1 text-purple-600">•</div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="relationships">
            <ul className="space-y-2">
              {lifestyle.relationships.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-2 mt-1 text-purple-600">•</div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-100">
          <h4 className="font-medium text-red-800 mb-2">When to Seek Help</h4>
          <ul className="space-y-1">
            {when_to_seek_help.slice(0, 3).map((item, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start">
                <div className="mr-2 mt-1">•</div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {when_to_seek_help.length > 3 && (
            <button className="text-xs text-red-700 font-medium mt-2 underline">
              View all {when_to_seek_help.length} warning signs
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}