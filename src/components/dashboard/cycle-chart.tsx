import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useMemo } from "react";
import { format, addDays, differenceInDays } from "date-fns";

// Define cycle phase types
type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

interface CycleChartProps {
  currentPhase?: string;
  daysUntilNextPhase?: number;
  cycleLength?: number;
  lastPeriodDate?: Date;
  nextPeriodDate?: Date; // Add optional next period date for better prediction
}

// Define default phase lengths (can be customized based on user data)
const defaultPhaseLengths = {
  menstrual: 5,
  follicular: 9,
  ovulatory: 1,
  luteal: 14,
};

// Phase colors
const phaseColors = {
  menstrual: "#FECACA", // red-200
  follicular: "#FEF3C7", // yellow-200
  ovulatory: "#A7F3D0", // green-200
  luteal: "#BFDBFE", // blue-200
};

// Phase accent colors
const phaseAccentColors = {
  menstrual: "#EF4444", // red-500
  follicular: "#F59E0B", // yellow-500
  ovulatory: "#10B981", // green-500
  luteal: "#3B82F6", // blue-500
};

export default function CycleChart({
  currentPhase = "follicular",
  daysUntilNextPhase = 3,
  cycleLength = 28,
  lastPeriodDate = new Date(2025, 2, 1),
  nextPeriodDate = new Date(2025, 2, 31),
}: CycleChartProps) {
  const [hoveredPhase, setHoveredPhase] = useState<CyclePhase | null>(null);

  // Normalize the phase name to match our CyclePhase type
  const normalizedPhase: CyclePhase = useMemo(() => {
    const phase = currentPhase?.toLowerCase() || "";
    
    if (phase.includes("menstrual")) return "menstrual";
    if (phase.includes("follicular")) return "follicular";
    if (phase.includes("ovulat")) return "ovulatory";
    if (phase.includes("luteal")) return "luteal";
    
    return "follicular"; // Default fallback
  }, [currentPhase]);

  // Calculate the days for each phase based on total cycle length
  const phaseDays = useMemo(() => {
    const totalDefaultDays = Object.values(defaultPhaseLengths).reduce((a, b) => a + b, 0);
    const scaleFactor = cycleLength / totalDefaultDays;
    
    // First calculate scaled values
    const scaledDays = {
      menstrual: Math.round(defaultPhaseLengths.menstrual * scaleFactor),
      follicular: Math.round(defaultPhaseLengths.follicular * scaleFactor),
      ovulatory: Math.round(defaultPhaseLengths.ovulatory * scaleFactor),
      luteal: Math.round(defaultPhaseLengths.luteal * scaleFactor),
    };
    
    // Ensure the total adds up to exactly cycleLength
    const calculatedTotal = Object.values(scaledDays).reduce((a, b) => a + b, 0);
    if (calculatedTotal !== cycleLength) {
      // Adjust luteal phase to make the total match cycleLength
      scaledDays.luteal += (cycleLength - calculatedTotal);
    }
    
    return scaledDays;
  }, [cycleLength]);

  // Calculate next phase dates - with special handling for luteal phase if we know the next period date
  const phaseStartDates = useMemo(() => {
    let currentDate = lastPeriodDate;
    const dates: Record<string, Date> = {
      menstrual: currentDate,
    };

    currentDate = addDays(currentDate, phaseDays.menstrual);
    dates.follicular = currentDate;

    currentDate = addDays(currentDate, phaseDays.follicular);
    dates.ovulatory = currentDate;

    currentDate = addDays(currentDate, phaseDays.ovulatory);
    dates.luteal = currentDate;
    
    // If we have a nextPeriodDate and are in luteal phase, adjust calculations
    if (nextPeriodDate && normalizedPhase === "luteal") {
      const actualLutealLength = differenceInDays(nextPeriodDate, dates.luteal);
      if (actualLutealLength > 0) {
        // Update luteal phase length based on the actual next period date
        phaseDays.luteal = actualLutealLength;
      }
    }

    return dates;
  }, [lastPeriodDate, nextPeriodDate, phaseDays, normalizedPhase]);

  // Prepare data for the chart
  const chartData = [
    { name: "Menstrual", value: phaseDays.menstrual, phase: "menstrual" },
    { name: "Follicular", value: phaseDays.follicular, phase: "follicular" },
    { name: "Ovulatory", value: phaseDays.ovulatory, phase: "ovulatory" },
    { name: "Luteal", value: phaseDays.luteal, phase: "luteal" },
  ];

  // Calculate progress within the current phase - ensure no negative values
  const currentPhaseLength = phaseDays[normalizedPhase];
  // Ensure daysUntilNextPhase is not greater than the phase length
  const safeDaysUntil = Math.min(Math.max(0, daysUntilNextPhase || 0), currentPhaseLength);
  const progress = ((currentPhaseLength + 1 - safeDaysUntil) / currentPhaseLength) * 100;
  
  // Determine next phase
  const phaseOrder: CyclePhase[] = ["menstrual", "follicular", "ovulatory", "luteal"];
  const currentPhaseIndex = phaseOrder.indexOf(normalizedPhase);
  const nextPhase = phaseOrder[(currentPhaseIndex + 1) % phaseOrder.length];

  const getDateDisplay = (date: Date) => {
    return format(date, "MMM d");
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{data.name} Phase</p>
          <p>{data.value} days</p>
        </div>
      );
    }
    return null;
  };

  // Calculate current day of phase safely
  const currentDay = Math.max(1, currentPhaseLength - safeDaysUntil);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Cycle Overview</CardTitle>
        <CardDescription>Visualize your cycle phases and symptoms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-gray-50 rounded flex flex-col items-center justify-center p-4">
          <div className="flex justify-between w-full mb-4">
            <div className="text-center">
              <div className={`rounded-full w-12 h-12 ${normalizedPhase === "menstrual" ? "ring-2 ring-red-500" : ""} bg-red-200 mx-auto mb-1 flex items-center justify-center`}>
                {normalizedPhase === "menstrual" && (
                  <div className="w-8 h-8 rounded-full bg-red-500 animate-pulse"></div>
                )}
              </div>
              <p className="text-xs font-medium">Menstrual</p>
              <p className="text-xs text-gray-500">{getDateDisplay(phaseStartDates.menstrual)}</p>
            </div>
            <div className="text-center">
              <div className={`rounded-full w-12 h-12 ${normalizedPhase === "follicular" ? "ring-2 ring-yellow-500" : ""} bg-yellow-200 mx-auto mb-1 flex items-center justify-center`}>
                {normalizedPhase === "follicular" && (
                  <div className="w-8 h-8 rounded-full bg-yellow-500 animate-pulse"></div>
                )}
              </div>
              <p className="text-xs font-medium">Follicular</p>
              <p className="text-xs text-gray-500">{getDateDisplay(phaseStartDates.follicular)}</p>
            </div>
            <div className="text-center">
              <div className={`rounded-full w-12 h-12 ${normalizedPhase === "ovulatory" ? "ring-2 ring-green-500" : ""} bg-green-200 mx-auto mb-1 flex items-center justify-center`}>
                {normalizedPhase === "ovulatory" && (
                  <div className="w-8 h-8 rounded-full bg-green-500 animate-pulse"></div>
                )}
              </div>
              <p className="text-xs font-medium">Ovulatory</p>
              <p className="text-xs text-gray-500">{getDateDisplay(phaseStartDates.ovulatory)}</p>
            </div>
            <div className="text-center">
              <div className={`rounded-full w-12 h-12 ${normalizedPhase === "luteal" ? "ring-2 ring-blue-500" : ""} bg-blue-200 mx-auto mb-1 flex items-center justify-center`}>
                {normalizedPhase === "luteal" && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse"></div>
                )}
              </div>
              <p className="text-xs font-medium">Luteal</p>
              <p className="text-xs text-gray-500">{getDateDisplay(phaseStartDates.luteal)}</p>
            </div>
          </div>

          <div className="w-full flex">
            <div className="w-3/5">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={(data) => setHoveredPhase(data.phase as CyclePhase)}
                    onMouseLeave={() => setHoveredPhase(null)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.phase === normalizedPhase ? phaseAccentColors[entry.phase as CyclePhase] : phaseColors[entry.phase as CyclePhase]} 
                        stroke={entry.phase === hoveredPhase ? phaseAccentColors[entry.phase as CyclePhase] : "none"} 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-2/5 p-4 flex flex-col justify-center">
              <div className="mb-4">
                <h3 className="text-sm font-medium">Current Phase</h3>
                <p className="text-lg font-semibold capitalize">{currentPhase}</p>
                <p className="text-xs text-gray-500">Day {currentDay} of {currentPhaseLength}</p>
              </div>
              
              <div className="mb-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>{safeDaysUntil} days until {nextPhase}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      normalizedPhase === "menstrual" ? "bg-red-500" : 
                      normalizedPhase === "follicular" ? "bg-yellow-500" : 
                      normalizedPhase === "ovulatory" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{width: `${progress}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}