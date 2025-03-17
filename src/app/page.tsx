"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import Navbar from "@/components/navbar";
import CircleLoader from "react-spinners/CircleLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/service/api/auth-service";
import { useRouter } from "next/navigation";
import { DashoardService } from "@/service/api/dashboard-service";


interface DashboardDetails {
  currentPhase: string,
  avgCycleLength: number,
  nextPeriodStart: string,
  daysUntilNextPeriod: number,
  daysUntilNextPhase: number,
}

// Define event type to ensure consistency
type EventType = "cycle" | "exercise" | "health" | "wellness";

// Lazy loaded components
const CycleChart = lazy(() => import('@/components/dashboard/cycle-chart'));
const RecommendationsList = lazy(() => import('@/components/dashboard/recommendations'));
const RecentLogs = lazy(() => import('@/components/dashboard/recent-logs'));
const ExerciseSection = lazy(() => import('@/components/dashboard/exercise-section'));
const NutritionTips = lazy(() => import('@/components/dashboard/nutrition-tips'));
const UpcomingEvents = lazy(() => import('@/components/dashboard/upcoming-events'));

// Loading fallback component
const ComponentLoader = () => (
  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
  </div>
);

// LazyLoad component that uses Intersection Observer with animation
function LazyLoad({ children, id }: { children: React.ReactNode, id: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is in view, set it to visible and load the content
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    const element = document.getElementById(id);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [id]);

  // Set hasLoaded after a small delay to trigger animation after component loads
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div 
      id={id} 
      className="min-h-[100px]"
    >
      {isVisible && (
        <div 
          className={`transition-all duration-700 ease-out ${
            hasLoaded 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);
  const [nextPeriodDate, setNextPeriodDate] = useState<Date>(new Date());

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      
      const response = await DashoardService.getDashboardDetails();

      console.log(response.data);

      if (response.success) {
        if (response.data.currentPhase == 0) {
          response.data.currentPhase = "Menstrual";
        }
        else if (response.data.currentPhase == 1) {
          response.data.currentPhase = "Follicular";
        }
        else if (response.data.currentPhase == 2) {
          response.data.currentPhase = "Ovulation";
        }
        else if (response.data.currentPhase == 3) {
          response.data.currentPhase = "Luteal";
        }

        setNextPeriodDate(new Date(response.data.nextPeriodStart));

        // Convert date to Month Day format
        response.data.nextPeriodStart = new Date(response.data.nextPeriodStart).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric'
        });

        setDashboardDetails(response.data);

        console.log(dashboardDetails);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Dummy data
  const cyclePhase = "Follicular";

  // Dummy recommendations based on cycle phase
  const recommendations = {
    nutrition: ["Leafy greens", "Fresh fruits", "Lean proteins", "Complex carbohydrates", "Fermented foods"],
    exercise: ["Cardio", "HIIT", "Light strength training", "Dance", "Yoga"],
    selfCare: ["Journaling", "Social activities", "Creative projects", "Meditation", "Nature walks"]
  };

  // Dummy log entries
  const recentLogs = [
    { date: "March 15", symptom: "Energy levels high", mood: "Optimistic", notes: "Productive day at work" },
    { date: "March 14", symptom: "Mild cramps", mood: "Focused", notes: "Started new project" },
    { date: "March 13", symptom: "None", mood: "Energetic", notes: "Went for a long walk" },
    { date: "March 12", symptom: "Slight headache", mood: "Calm", notes: "Meditation session helped" },
    { date: "March 11", symptom: "Bloating", mood: "Irritable", notes: "Stressful day" },
  ];

  // Dummy upcoming events with properly typed event types
  const upcomingEvents = [
    { date: "March 24", title: "Period Start (predicted)", type: "cycle" as EventType },
    { date: "March 18", title: "Yoga Workshop", type: "exercise" as EventType },
    { date: "March 20", title: "Nutrition Consultation", type: "health" as EventType },
    { date: "March 22", title: "Self-care Day", type: "wellness" as EventType }
  ];

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <CircleLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main content */}
      <main className="container mx-auto pt-24 pb-12 px-4">

        {/* Stats cards */}
        <LazyLoad id = "stats-cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Phase</CardTitle>
              <CardDescription>Your menstrual cycle status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardDetails?.currentPhase}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {dashboardDetails?.daysUntilNextPhase} days until next phase
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cycle Length</CardTitle>
              <CardDescription>Your average cycle duration</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{dashboardDetails?.avgCycleLength}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your last cycles
              </p>
            </CardContent>
            </Card>
            
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Next Period</CardTitle>
              <CardDescription>Estimated start date</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{dashboardDetails?.nextPeriodStart}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {dashboardDetails?.daysUntilNextPeriod} days from today
              </p>
            </CardContent>
          </Card>
          </div>
          </LazyLoad>

        {/* Chart section (lazy loaded) */}
        <LazyLoad id="cycle-chart">
          <CycleChart
            currentPhase={dashboardDetails?.currentPhase}
            daysUntilNextPhase={dashboardDetails?.daysUntilNextPhase}
            cycleLength={dashboardDetails?.avgCycleLength}
            nextPeriodDate={nextPeriodDate}
          />
        </LazyLoad>
        
        <LazyLoad id="recommendations">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Recommendations section (lazy loaded) */}
          <Card>
            <CardHeader>
              <CardTitle>Phase-based Recommendations</CardTitle>
              <CardDescription>Optimized for your {dashboardDetails?.currentPhase} phase</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyLoad id="recommendations">
                <RecommendationsList recommendations={recommendations} phase={dashboardDetails?.currentPhase} />
              </LazyLoad>
            </CardContent>
          </Card>

          {/* Exercise section (lazy loaded) */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Tips</CardTitle>
              <CardDescription>Workouts for your current phase</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyLoad id="exercise-section">
                <ExerciseSection phase={dashboardDetails?.currentPhase} />
              </LazyLoad>
            </CardContent>
          </Card>

          {/* Upcoming events section (lazy loaded) */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Calendar for next 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyLoad id="upcoming-events">
                <UpcomingEvents events={upcomingEvents} />
              </LazyLoad>
            </CardContent>
          </Card>
          </div>
          </LazyLoad>

        {/* Nutrition section (lazy loaded) */}
        <div className="mt-8">
          <LazyLoad id="nutrition-tips">
            <NutritionTips phase={dashboardDetails?.currentPhase} />
          </LazyLoad>
        </div>

        {/* Recent logs (lazy loaded) */}
        <div className="mt-8">
          <LazyLoad id="recent-logs">
            <RecentLogs logs={recentLogs} />
          </LazyLoad>
        </div>
      </main>
    </div>
  );
}