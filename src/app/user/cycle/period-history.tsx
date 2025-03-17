"use client";

import React from "react";
import { format, differenceInDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PeriodRecord } from "@/app/user/cycle/page"

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
};

// Helper function for readable time ago
const timeAgo = (dateString: string): string => {
  const days = differenceInDays(new Date(), new Date(dateString));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

interface PeriodHistoryProps {
  pastPeriods: PeriodRecord[];
}

export default function PeriodHistory({ pastPeriods }: PeriodHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Periods</CardTitle>
        <CardDescription>Your menstrual cycle history</CardDescription>
      </CardHeader>
      <CardContent>
        {pastPeriods.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No period history recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastPeriods.map((period) => (
              <div key={period.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium">
                    {formatDate(period.startDate)} - {period.endDate ? formatDate(period.endDate) : "Ongoing"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Duration: {period.durationDays || "?"} days
                    {period.notes && ` • ${period.notes}`}
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <Badge variant="outline" className="bg-gray-50">
                    {timeAgo(period.startDate)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}