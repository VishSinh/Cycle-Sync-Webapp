"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthService } from "@/service/api/auth-service";
import { useRouter } from "next/navigation";

// Define user data interface
interface UserProfile {
  first_name: string;
  last_name: string;
  dob: string;
  height: number;
  weight: number;
  email: string;
  current_period_record_id: string | null;
  last_period_record_id: string | null;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const router = useRouter();

  // Calculate age from DOB
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

  // Format date to display in a user-friendly way
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    const checkAuth = async () => {
      
      // Simulate API fetch with the provided data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set dummy data
      setUserData({
        first_name: "Vish",
        last_name: "Sinh",
        dob: "2001-07-23",
        height: 167,
        weight: 55.5,
        email: "vish@meow.com",
        current_period_record_id: null,
        last_period_record_id: null
      });
      
      setFormData({
        first_name: "Vish",
        last_name: "Sinh",
        dob: "2001-07-23",
        height: 167,
        weight: 55.5,
        email: "vish@meow.com",
      });
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call to save user data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update userData with form data
    if (userData) {
      const updatedUserData = {
        ...userData,
        ...formData
      };
      setUserData(updatedUserData);
    }
    
    setEditMode(false);
    setLoading(false);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (userData) {
      setFormData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        dob: userData.dob,
        height: userData.height,
        weight: userData.weight,
        email: userData.email,
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        
      </div>
    );
  }

  if (!userData) {
    return <div>Error loading profile data</div>;
  }

  const age = calculateAge(userData.dob);
  const initials = `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/avatars/profile.png" alt={`${userData.first_name} ${userData.last_name}`} />
                    <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{userData.first_name} {userData.last_name}</CardTitle>
                    <CardDescription>{userData.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input 
                          id="first_name" 
                          name="first_name"
                          value={formData.first_name || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input 
                          id="last_name" 
                          name="last_name"
                          value={formData.last_name || ''} 
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
                        value={formData.email || ''} 
                        onChange={handleInputChange} 
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p>{userData.first_name} {userData.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{userData.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p>{formatDate(userData.dob)} ({age} years old)</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Your physical health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
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
                  <div className="grid grid-cols-2 gap-4">
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
              <CardFooter className="flex justify-between">
                {!editMode && (
                  <Button variant="outline" onClick={() => setEditMode(true)}>Update Health Data</Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cycle Tracking</CardTitle>
                <CardDescription>Your menstrual cycle information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Current Period</h3>
                    {userData.current_period_record_id ? (
                      <div className="bg-red-50 border border-red-100 p-4 rounded-md">
                        <p>You have an active period record.</p>
                        <Button variant="link" className="p-0 h-auto text-red-600">
                          View Details
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-md">
                        <p>No active period currently recorded.</p>
                        <Button variant="link" className="p-0 h-auto">
                          Start Tracking
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Last Period</h3>
                    {userData.last_period_record_id ? (
                      <div className="bg-purple-50 border border-purple-100 p-4 rounded-md">
                        <p>You have previous period records.</p>
                        <Button variant="link" className="p-0 h-auto text-purple-600">
                          View History
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-md">
                        <p>No previous periods recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="cycleAlert" className="rounded text-purple-600" />
                    <label htmlFor="cycleAlert">Period reminders</label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" id="tipsAlert" className="rounded text-purple-600" />
                    <label htmlFor="tipsAlert">Cycle-based tips and recommendations</label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Privacy</h3>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="dataSharing" className="rounded text-purple-600" />
                    <label htmlFor="dataSharing">Share anonymized data for research</label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Save Preferences</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-4">
                  These actions are permanent and cannot be undone.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="bg-white text-red-600 border-red-300 hover:bg-red-50 w-full justify-start">
                    Reset All Data
                  </Button>
                  <Button variant="outline" className="bg-white text-red-600 border-red-300 hover:bg-red-50 w-full justify-start">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}