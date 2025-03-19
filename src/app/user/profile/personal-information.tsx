import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface PersonalInformationProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    dob?: string;
  };
  formData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    dob?: string;
  };
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not provided";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Helper function to calculate age
const calculateAge = (dob?: string): number | null => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function PersonalInformation({
  userData,
  formData,
  editingSection,
  setEditingSection,
  handleInputChange,
  handleSave,
  handleCancel
}: PersonalInformationProps) {
  const age = calculateAge(userData.dob);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.dob ? new Date(formData.dob) : undefined
  );
  
  // Update selectedDate when formData.dob changes (for example, when editing is cancelled)
  useEffect(() => {
    if (formData.dob) {
      setSelectedDate(new Date(formData.dob));
    } else {
      setSelectedDate(undefined);
    }
  }, [formData.dob]);
  
  // Handle date changes from the DatePicker
  const handleDateChange = (date: Date | undefined) => {
    // Update the selectedDate state
    setSelectedDate(date);
    
    // Create a synthetic event to work with the existing handleInputChange
    const syntheticEvent = {
      target: {
        name: 'dob',
        value: date ? date.toISOString().split('T')[0] : ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  // Validate form before saving
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // First name validation
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Date of birth validation
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(dobDate.getTime())) {
        newErrors.dob = 'Please enter a valid date';
      } 
      // Check if date is in the future
      else if (dobDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
      // Check if person is too old (e.g., over 120 years)
      else {
        const age = calculateAge(formData.dob);
        if (age !== null && age > 120) {
          newErrors.dob = 'Please enter a valid date of birth';
        }
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

  // Function to disable future dates in the DatePicker
  const disableFutureDates = (date: Date) => {
    return date > new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <CardTitle className="text-xl">Your Details</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </div>
          {editingSection !== "personal" && (
            <Button onClick={() => setEditingSection("personal")} className="self-start">Edit Profile</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {editingSection === "personal" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName || ''} 
                  onChange={handleInputChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName || ''} 
                  onChange={handleInputChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={userData.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className={errors.dob ? "border border-red-500 rounded-md" : ""}>
                <DatePicker
                  date={selectedDate}
                  onSelect={handleDateChange}
                  disabled={disableFutureDates}
                  placeholder="Select your date of birth"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
              {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p>{userData.firstName} {userData.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{userData.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p>
                  {formatDate(userData.dob)}
                  {age !== null && ` (${age} years old)`}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {editingSection === "personal" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
}