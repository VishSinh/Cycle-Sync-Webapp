"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import Navbar from "@/components/navbar";
import CircleLoader from "react-spinners/CircleLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/service/api/auth-service";
import { useRouter } from "next/navigation";

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

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is logged in
      if (!AuthService.isLoggedIn()) {
        router.push("/auth");
        return;
      }
      
      // Simulate loading for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Dummy data
  const cyclePhase = "Follicular";
  const daysUntilNextPhase = 7;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
        {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-gray-600">{currentDate}</p>
        </div> */}

        {/* Stats cards */}
        <LazyLoad id = "stats-cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Phase</CardTitle>
              <CardDescription>Your menstrual cycle status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cyclePhase}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {daysUntilNextPhase} days until next phase
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cycle Length</CardTitle>
              <CardDescription>Your average cycle duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">28 days</div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your last 6 cycles
              </p>
            </CardContent>
            </Card>
            
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Next Period</CardTitle>
              <CardDescription>Estimated start date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">March 24</div>
              <p className="text-sm text-muted-foreground mt-1">
                8 days from today
              </p>
            </CardContent>
          </Card>
          </div>
          </LazyLoad>

        {/* Chart section (lazy loaded) */}
        <LazyLoad id="cycle-chart">
          <CycleChart />
        </LazyLoad>
        
        <LazyLoad id="recommendations">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Recommendations section (lazy loaded) */}
          <Card>
            <CardHeader>
              <CardTitle>Phase-based Recommendations</CardTitle>
              <CardDescription>Optimized for your {cyclePhase} phase</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyLoad id="recommendations">
                <RecommendationsList recommendations={recommendations} phase={cyclePhase} />
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
                <ExerciseSection phase={cyclePhase} />
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
            <NutritionTips phase={cyclePhase} />
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