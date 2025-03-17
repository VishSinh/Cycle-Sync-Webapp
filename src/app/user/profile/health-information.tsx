import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HealthInformationProps {
  userData: {
    height: number;
    weight: number;
  };
  formData: {
    height?: number;
    weight?: number;
  };
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export default function HealthInformation({
  userData,
  formData,
  editingSection,
  setEditingSection,
  handleInputChange,
  handleSave,
  handleCancel
}: HealthInformationProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <CardTitle className="text-xl">Health Metrics</CardTitle>
            <CardDescription>Your physical health information</CardDescription>
          </div>
          {editingSection !== "health" && (
            <Button onClick={() => setEditingSection("health")} className="self-start">Update Health Data</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {editingSection === "health" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  name="height"
                  type="number" 
                  value={formData.height || ''} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  name="weight"
                  type="number" 
                  step="0.1" 
                  value={formData.weight || ''} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Height</p>
              <p>{userData.height} cm</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Weight</p>
              <p>{userData.weight} kg</p>
            </div>
          </div>
        )}
      </CardContent>
      {editingSection === "health" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
}