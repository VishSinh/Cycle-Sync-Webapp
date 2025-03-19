import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HealthInformationProps {
  userData: {
    height?: number;
    weight?: number;
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Validate health metrics before saving
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Height validation
    if (formData.height !== undefined) {
      const height = Number(formData.height);
      if (isNaN(height)) {
        newErrors.height = 'Height must be a number';
      } else if (height <= 0) {
        newErrors.height = 'Height must be positive';
      } else if (height > 300) {
        newErrors.height = 'Height cannot be more than 300 cm';
      }
    }
    
    // Weight validation
    if (formData.weight !== undefined) {
      const weight = Number(formData.weight);
      if (isNaN(weight)) {
        newErrors.weight = 'Weight must be a number';
      } else if (weight <= 0) {
        newErrors.weight = 'Weight must be positive';
      } else if (weight > 500) {
        newErrors.weight = 'Weight cannot be more than 500 kg';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      handleSave();
    }
  };

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
                  className={errors.height ? "border-red-500" : ""}
                  min="0"
                  max="300"
                />
                {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
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
                  className={errors.weight ? "border-red-500" : ""}
                  min="0"
                  max="500"
                />
                {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Height</p>
              <p>{userData.height ?? '--'} cm</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Weight</p>
              <p>{userData.weight ?? '--'} kg</p>
            </div>
          </div>
        )}
      </CardContent>
      {editingSection === "health" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
}