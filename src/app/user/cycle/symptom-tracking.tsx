"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Symptom } from "@/app/user/cycle/page"
import { CycleService } from "@/service/api/cycle-serice";
import { apiWrapper } from "@/lib/api-wrapper";
import logger from "@/lib/logger";
// import { SymptomService } from "./mock-service";

// Symptom options
const symptomTypes = [
  "Cramps", "Headache", "Bloating", "Fatigue", 
  "Mood swings", "Breast tenderness", "Acne", "Back pain",
  "Nausea", "Food cravings", "Insomnia", "Other"
];

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
};

// Get severity label
const getSeverityLabel = (severity: number) => {
  
  switch (severity) {

    case 1: return "Mild";
    case 2: return "Moderate";
    case 3: return "Severe";
    default: return "Unknown";
  }
};

interface SymptomTrackingProps {
  symptoms: Symptom[];
  setSymptoms: React.Dispatch<React.SetStateAction<Symptom[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SymptomTracking({ symptoms, setSymptoms, loading, setLoading }: SymptomTrackingProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    type: "Cramps",
    severity: 2,
    notes: "",
    date: format(new Date(), "yyyy-MM-dd")
  });

  // Add new symptom
  const handleAddSymptom = async () => {
    setLoading(true);

    const { response, error: _ } = await apiWrapper(
      () => CycleService.createSymptom(Number(newSymptom.severity), newSymptom.date, newSymptom.type, newSymptom.notes),
      { showToast: true, errorMessage: "Error adding symptom" }
    )

    logger.info("Symptom added", response);

    if (response.success) {
      setSymptoms([(response.data), ...symptoms]);

      setNewSymptom({
        type: "Cramps",
        severity: 2,
        notes: "",
        date: format(new Date(), "yyyy-MM-dd")
      });


      setDialogOpen(false);
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <CardTitle>Symptom Tracker</CardTitle>
          <CardDescription>Record and monitor your symptoms</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="self-start mt-2 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Symptom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record a Symptom</DialogTitle>
              <DialogDescription>
                Track your symptoms to identify patterns in your cycle.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="symptom-type">Symptom Type</Label>
                <Select
                  value={newSymptom.type}
                  onValueChange={(value) => setNewSymptom({ ...newSymptom, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select symptom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Common Symptoms</SelectLabel>
                      {symptomTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={String(newSymptom.severity)}
                  onValueChange={(value) => setNewSymptom({ ...newSymptom, severity: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Mild</SelectItem>
                    <SelectItem value="2">2 - Moderate</SelectItem>
                    <SelectItem value="3">3 - Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex">
                  <Input
                    id="date"
                    type="date"
                    value={newSymptom.date}
                    onChange={(e) => setNewSymptom({ ...newSymptom, date: e.target.value })}
                    max={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant details..."
                  value={newSymptom.notes}
                  onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSymptom} disabled={loading}>
                {loading ? "Saving..." : "Add Symptom"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {symptoms.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No symptoms recorded</h3>
            <p className="text-gray-500 mt-1">
              Start tracking your symptoms to identify patterns
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              Record First Symptom
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {symptoms.map((symptom) => (
              <div key={symptom.symptomId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${
                      symptom.severity === 3 ? "bg-red-100 text-red-800" :
                      symptom.severity === 2 ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {getSeverityLabel(symptom.severity)}
                    </Badge>
                    <h3 className="font-medium">{symptom.symptom}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatDate(symptom.createdDatetime)}
                  </Badge>
                </div>

                {symptom.comments && (
                  <p className="text-sm text-gray-600 mt-2">
                    {symptom.comments}
                  </p>
                )}

                {symptom.periodRecordId && (
                  <Badge variant="outline" className="text-xs mt-2">
                    Symptom occurred during period
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}