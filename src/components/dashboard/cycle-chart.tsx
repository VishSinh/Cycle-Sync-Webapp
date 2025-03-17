import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CycleChart() {
  // This would normally contain chart logic, using a library like Chart.js or Recharts
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Cycle Overview</CardTitle>
        <CardDescription>Visualize your cycle phases and symptoms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-gray-100 rounded flex flex-col items-center justify-center p-6">
          <div className="w-full flex justify-between mb-6">
            <div className="text-center">
              <div className="rounded-full w-12 h-12 bg-red-200 mx-auto mb-2"></div>
              <p className="text-xs">Menstrual</p>
            </div>
            <div className="text-center">
              <div className="rounded-full w-12 h-12 bg-yellow-200 mx-auto mb-2"></div>
              <p className="text-xs">Follicular</p>
            </div>
            <div className="text-center">
              <div className="rounded-full w-12 h-12 bg-green-200 mx-auto mb-2"></div>
              <p className="text-xs">Ovulatory</p>
            </div>
            <div className="text-center">
              <div className="rounded-full w-12 h-12 bg-blue-200 mx-auto mb-2"></div>
              <p className="text-xs">Luteal</p>
            </div>
          </div>
          <div className="w-full h-24 bg-gray-200 rounded-lg relative">
            <div className="absolute h-full w-1/4 bg-yellow-200 opacity-70 rounded-l-lg"></div>
            <div className="absolute h-full w-4 bg-yellow-500 left-[24%]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Interactive chart coming soon</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}