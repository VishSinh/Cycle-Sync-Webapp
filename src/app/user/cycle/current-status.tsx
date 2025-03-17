"use client";

import React from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { PeriodRecord } from "@/app/user/cycle/page"

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
};

interface CurrentStatusProps {
  currentPeriod: PeriodRecord | null;
  pastPeriods: PeriodRecord[];
  handleStartPeriod: () => Promise<void>; // Changed from onStartPeriod
  handleEndPeriod: () => Promise<void>;   // Changed from onEndPeriod
  loading: boolean;
}

export default function CurrentStatus({ 
  currentPeriod, 
  pastPeriods, 
  handleStartPeriod, // Use the correct prop name to match parent component
  handleEndPeriod,   // Use the correct prop name to match parent component
  loading 
}: CurrentStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Period Status</CardTitle>
        <CardDescription>Track your current period</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          {currentPeriod ? (
            <div className="text-center space-y-3">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                <AlertCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Period in progress</p>
              </div>
              <p className="text-lg">
                Started on {formatDate(currentPeriod.startDate)} ({differenceInDays(new Date(), new Date(currentPeriod.startDate)) + 1} days so far)
              </p>
              <Button
                variant="destructive"
                onClick={handleEndPeriod}
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Saving..." : "End Period"}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">No active period</p>
              </div>
              {pastPeriods.length > 0 && (
                <p className="text-lg">
                  Last period ended {formatDate(pastPeriods[0].endDate || "")}
                </p>
              )}
              <Button
                onClick={handleStartPeriod}
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Starting..." : "Start Period"}
              </Button>
            </div>
          )}
        </div>
        
        {/* Period Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm font-medium text-purple-800">Average Cycle Length</p>
            <p className="text-2xl font-bold text-purple-900">28 days</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800">Average Period Duration</p>
            <p className="text-2xl font-bold text-blue-900">
              {pastPeriods.length > 0
                ? `${Math.round(pastPeriods.reduce((sum, p) => sum + (p.durationDays || 0), 0) / pastPeriods.length)} days`
                : "No data"
              }
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <p className="text-sm font-medium text-pink-800">Next Period (Predicted)</p>
            <p className="text-2xl font-bold text-pink-900">
              {pastPeriods.length > 0
                ? formatDate(format(addDays(new Date(pastPeriods[0].startDate), 28), "yyyy-MM-dd"))
                : "No data"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}