import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Routes from "@/lib/routes";
import { useRouter } from "next/navigation";

interface CycleTrackingProps {
  userData: {
    currentPeriodRecordId: string | null;
    lastPeriodRecordId: string | null;
  };
}

export default function CycleTracking({ userData }: CycleTrackingProps) {
  const router = useRouter();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Menstrual Cycle Information</CardTitle>
        <CardDescription>Track and manage your cycle data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Current Period</h3>
            {userData.currentPeriodRecordId ? (
              <div className="bg-red-50 border border-red-100 p-4 rounded-md">
                <p>You have an active period record.</p>
                <Button variant="link" className="p-0 h-auto text-red-600">
                  View Details
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-md">
                <p>No active period currently recorded.</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => router.push(Routes.CYCLE)}>
                  Start Tracking
                </Button>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Last Period</h3>
            {userData.lastPeriodRecordId ? (
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-md">
                <p>You have previous period records.</p>
                <Button variant="link" className="p-0 h-auto text-purple-600" onClick={() => router.push(Routes.CYCLE)}>
                  View History
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-md">
                <p>No previous periods recorded yet.</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Cycle Overview</h3>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => router.push('/user/cycle/overview')}
              >
                View Complete Cycle Analysis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}