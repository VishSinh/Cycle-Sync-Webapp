import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Preferences</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Email Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cycleAlert" className="rounded text-purple-600" />
                <label htmlFor="cycleAlert">Period reminders</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="tipsAlert" className="rounded text-purple-600" />
                <label htmlFor="tipsAlert">Cycle-based tips and recommendations</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="weeklyAlert" className="rounded text-purple-600" />
                <label htmlFor="weeklyAlert">Weekly summary reports</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Privacy</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="dataSharing" className="rounded text-purple-600" />
                <label htmlFor="dataSharing">Share anonymized data for research</label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card className="bg-red-50 mt-6">
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
    </>
  );
}