"use client";

import React from "react";
import { format, differenceInDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Info, Calendar, Clock, CalendarCheck } from "lucide-react";
import { CurrentStatusData, PeriodRecord } from "@/app/user/cycle/page"

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
};

interface CurrentStatusProps {
  currentStatus: CurrentStatusData | null;
  currentPeriod: PeriodRecord | null;
  pastPeriods: PeriodRecord[];
  handleStartPeriod: () => Promise<void>;
  handleEndPeriod: () => Promise<void>;
  loading: boolean;
}

export default function CurrentStatus({ 
  currentStatus,
  currentPeriod, 
  pastPeriods, 
  handleStartPeriod,
  handleEndPeriod,
  loading 
}: CurrentStatusProps) {
  // Calculate how many more periods are needed for accurate predictions
  const getNeededPeriods = () => {
    return Math.max(0, 2 - pastPeriods.length);
  };

  // Custom empty state messages based on context
  const getEmptyStateMessage = (type: 'cycle' | 'duration' | 'prediction') => {
    const neededPeriods = getNeededPeriods();
    
    if (neededPeriods === 0) return "Calculating...";
    
    switch (type) {
      case 'cycle':
        return `Track ${neededPeriods} more ${neededPeriods === 1 ? 'cycle' : 'cycles'} for average`;
      case 'duration':
        return `Need ${neededPeriods} more ${neededPeriods === 1 ? 'cycle' : 'cycles'}`;
      case 'prediction':
        return neededPeriods + 2 >= 4 ? "Start tracking to predict" : `${neededPeriods + 2} more ${neededPeriods === 1 ? 'cycle' : 'cycles'} needed`;
      default:
        return "No data yet";
    }
  };

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
                Started on {formatDate(currentPeriod.startDatetime)} ({differenceInDays(new Date(), new Date(currentPeriod.startDatetime)) + 1} days so far)
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
                  Last period ended {formatDate(pastPeriods[0].endDatetime || "")}
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
          {/* Average Cycle Length */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Average Cycle Length</p>
                {currentStatus && currentStatus.avgCycleLength ? (
                  <p className="text-2xl font-bold text-purple-900">{currentStatus.avgCycleLength} days</p>
                ) : (
                  <div className="mt-1 space-y-1">
                    <p className="text-lg font-medium text-purple-900">–</p>
                    <p className="text-xs text-purple-700">{getEmptyStateMessage('cycle')}</p>
                  </div>
                )}
              </div>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          
          {/* Average Period Duration */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Average Period Duration</p>
                {currentStatus && currentStatus.avgPeriodLength ? (
                  <p className="text-2xl font-bold text-blue-900">{currentStatus.avgPeriodLength} days</p>
                ) : (
                  <div className="mt-1 space-y-1">
                    <p className="text-lg font-medium text-blue-900">–</p>
                    <p className="text-xs text-blue-700">{getEmptyStateMessage('duration')}</p>
                  </div>
                )}
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          {/* Next Period Prediction */}
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-pink-800">Next Period (Predicted)</p>
                {currentStatus && currentStatus.nextPeriodStart ? (
                  <p className="text-2xl font-bold text-pink-900">{formatDate(currentStatus.nextPeriodStart)}</p>
                ) : (
                  <div className="mt-1 space-y-1">
                    <p className="text-lg font-medium text-pink-900">–</p>
                    <p className="text-xs text-pink-700">{getEmptyStateMessage('prediction')}</p>
                  </div>
                )}
              </div>
              <CalendarCheck className="h-5 w-5 text-pink-600" />
            </div>
          </div>
        </div>
        
        {/* Help text when not enough data */}
        {pastPeriods.length < 3 && (
          <div className="text-center text-sm text-gray-500 flex items-center justify-center mt-2">
            <Info className="h-4 w-4 mr-1" />
            <span>
              {pastPeriods.length === 0 
                ? "Start tracking your periods to see predictions and statistics" 
                : `Track ${3 - pastPeriods.length} more ${3 - pastPeriods.length === 1 ? 'cycle' : 'cycles'} for more accurate statistics`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}