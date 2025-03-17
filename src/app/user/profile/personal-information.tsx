import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInformationProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
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
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Helper function to calculate age
const calculateAge = (dob: string): number => {
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName || ''} 
                  onChange={handleInputChange} 
                />
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
              <Input 
                id="dob" 
                name="dob"
                type="date" 
                value={formData.dob || ''} 
                onChange={handleInputChange} 
              />
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
                <p>{formatDate(userData.dob)} ({age} years old)</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {editingSection === "personal" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
}