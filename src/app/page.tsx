"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import Navbar from "@/components/navbar";
import CircleLoader from "react-spinners/CircleLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/service/api/auth-service";
import { useRouter } from "next/navigation";
import { DashoardService } from "@/service/api/dashboard-service";
import PhaseInfo from "@/components/dashboard/phase-info";
import LifestyleTips from "@/components/dashboard/lifestyle-tips";

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

  // Create properly structured dummy data based on the provided JSON
  const phaseInfo = {
    name: "Luteal Phase",
    days_in_cycle: "Approximately days 15-28 of a 28-day cycle (can vary depending on ovulation)",
    hormone_changes: "Progesterone levels rise significantly after ovulation. Estrogen also increases initially, then declines. If pregnancy doesn't occur, both progesterone and estrogen levels drop dramatically towards the end of the phase.",
    common_symptoms: [
      "Bloating", "Breast tenderness", "Mood swings", "Irritability",
      "Anxiety", "Headaches", "Fatigue", "Changes in appetite", 
      "Difficulty sleeping", "Acne breakouts"
    ],
    description: "The luteal phase begins after ovulation and lasts until the start of the next menstrual period. The dominant hormone during this phase is progesterone, which prepares the uterine lining for a potential pregnancy. If fertilization doesn't occur, hormone levels drop, leading to menstruation."
  };
  
  // Format recommendations for the RecommendationsList component
  const recommendations = {
    nutrition: {
      foods_to_emphasize: [
        "Complex carbohydrates (whole grains, sweet potatoes, brown rice)",
        "Fiber-rich foods (fruits, vegetables, beans, lentils)",
        "Lean protein (chicken, fish, tofu, beans)",
        "Foods rich in calcium and magnesium (leafy greens, dairy, nuts, seeds)",
        "Healthy fats (avocados, nuts, seeds, olive oil)"
      ],
      foods_to_minimize: [
        "Processed foods",
        "Salty foods (to reduce bloating)",
        "Sugary foods (to avoid blood sugar spikes and mood swings)",
        "Caffeine (can exacerbate anxiety and sleep problems)",
        "Alcohol (can worsen mood swings and fatigue)"
      ],
      nutrients_to_focus_on: [
        "Vitamin B6",
        "Magnesium",
        "Calcium",
        "Fiber",
        "Omega-3 fatty acids"
      ]
    },
    exercise: {
      recommended_types: [
        "Yoga",
        "Pilates",
        "Walking",
        "Light jogging",
        "Swimming",
        "Strength training (lighter weights, higher reps)"
      ],
      intensity_level: "Moderate",
      exercises_to_avoid: [
        "High-intensity interval training (HIIT)",
        "Heavy weightlifting",
        "Excessive cardio"
      ]
    },
    self_care: {
      physical: [
        "Take warm baths with Epsom salts",
        "Get a massage",
        "Use a heating pad for cramps",
        "Stretch regularly",
        "Practice deep breathing exercises"
      ],
      emotional: [
        "Journaling",
        "Meditation",
        "Spending time in nature",
        "Connecting with loved ones",
        "Practicing mindfulness",
        "Engaging in creative activities"
      ],
      sleep: [
        "Maintain a regular sleep schedule",
        "Create a relaxing bedtime routine",
        "Ensure a dark, quiet, and cool sleep environment",
        "Avoid caffeine and alcohol before bed"
      ]
    }
  };
  
  // Exercise details with more comprehensive information
  const exerciseDetails = [
    {
      name: "Yoga (Gentle Flow)",
      description: "Gentle yoga focuses on stretching, balance, and relaxation. It involves holding poses for longer periods and emphasizes mindful breathing.",
      benefits_during_phase: "Reduces stress, eases muscle tension, improves sleep quality, and helps with bloating and cramps.",
      difficulty: "easy",
      duration: "30-60 minutes",
      modifications: "Use props like blocks and blankets for support. Modify poses as needed to accommodate discomfort or fatigue."
    },
    {
      name: "Walking",
      description: "A low-impact cardio exercise that can be easily incorporated into your daily routine.",
      benefits_during_phase: "Boosts mood, improves circulation, reduces bloating, and helps with fatigue.",
      difficulty: "easy",
      duration: "30-60 minutes",
      modifications: "Walk at a comfortable pace. Break it up into shorter walks throughout the day if needed."
    },
    {
      name: "Pilates",
      description: "A low-impact exercise that focuses on core strength, flexibility, and body awareness.",
      benefits_during_phase: "Strengthens core muscles, improves posture, relieves back pain, and reduces stress.",
      difficulty: "medium",
      duration: "30-45 minutes",
      modifications: "Focus on proper form over intensity. Modify exercises as needed to accommodate any discomfort."
    }
  ];
  
  // Enhanced nutrition details
  const nutritionDetails = {
    key_nutrients: [
      {
        nutrient: "Vitamin B6",
        benefits_during_phase: "Helps regulate mood, reduce bloating, and alleviate breast tenderness.",
        food_sources: [
          "Chicken", "Fish", "Potatoes", "Bananas", "Fortified cereals"
        ]
      },
      {
        nutrient: "Magnesium",
        benefits_during_phase: "Reduces muscle cramps, headaches, and fatigue. Helps regulate blood sugar levels.",
        food_sources: [
          "Leafy green vegetables", "Nuts", "Seeds", "Dark chocolate", "Avocado"
        ]
      },
      {
        nutrient: "Calcium",
        benefits_during_phase: "May help reduce PMS symptoms such as mood swings, bloating, and fatigue.",
        food_sources: [
          "Dairy products", "Leafy green vegetables", "Fortified plant-based milks", "Tofu"
        ]
      }
    ],
    meal_plan: {
      breakfast_ideas: [
        "Oatmeal with berries and nuts",
        "Scrambled eggs with spinach and whole-wheat toast",
        "Greek yogurt with fruit and granola",
        "Smoothie with spinach, banana, and protein powder"
      ],
      lunch_ideas: [
        "Turkey sandwich on whole-grain bread with avocado and sprouts",
        "Salad with grilled chicken or tofu, mixed greens, and a variety of vegetables",
        "Leftovers from dinner",
        "Lentil soup with a side salad"
      ],
      dinner_ideas: [
        "Baked chicken breast with roasted vegetables",
        "Salmon with quinoa and steamed asparagus",
        "Vegetarian chili with cornbread",
        "Turkey meatballs with zucchini noodles and marinara sauce"
      ],
      snack_ideas: [
        "Trail mix with nuts, seeds, and dried fruit",
        "Apple slices with peanut butter",
        "Hard-boiled eggs",
        "Greek yogurt with berries",
        "Dark chocolate"
      ]
    },
    hydration_tips: "Drink plenty of water throughout the day to stay hydrated and reduce bloating. Herbal teas like chamomile and ginger can also be beneficial.",
    supplement_recommendations: [
      "Vitamin B6 (consult with a doctor before taking supplements)",
      "Magnesium (consult with a doctor before taking supplements)",
      "Calcium (consult with a doctor before taking supplements)",
      "Omega-3 fatty acids (consult with a doctor before taking supplements)"
    ]
  };
  
  // Lifestyle adjustments with more detailed information
  const lifestyleAdjustments = {
    work: [
      "Take frequent breaks to stretch and move around",
      "Prioritize tasks and avoid overcommitting",
      "Communicate your needs to your colleagues",
      "Create a calm and comfortable workspace"
    ],
    social: [
      "Don't feel pressured to attend social events if you're not feeling up to it",
      "Communicate your needs to your friends and family",
      "Engage in activities that you enjoy and that help you relax",
      "Set healthy boundaries"
    ],
    relationships: [
      "Communicate your feelings and needs to your partner",
      "Practice patience and understanding",
      "Spend quality time together doing activities that you both enjoy",
      "Seek professional help if needed"
    ]
  };
  
  // When to seek help guidelines
  const whenToSeekHelp = [
    "Severe PMS symptoms that interfere with daily life",
    "Prolonged or unusually heavy menstrual bleeding",
    "Sudden changes in mood or behavior",
    "Persistent fatigue or exhaustion",
    "Severe pelvic pain",
    "Signs of depression or anxiety"
  ];

  // Dummy log entries
  const recentLogs = [
    { date: "March 15", symptom: "Energy levels high", mood: "Optimistic", notes: "Productive day at work" },
    { date: "March 14", symptom: "Mild cramps", mood: "Focused", notes: "Started new project" },
    { date: "March 13", symptom: "None", mood: "Energetic", notes: "Went for a long walk" },
    { date: "March 12", symptom: "Slight headache", mood: "Calm", notes: "Meditation session helped" },
    { date: "March 11", symptom: "Bloating", mood: "Irritable", notes: "Stressful day" },
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

        {/* Stats cards - DO NOT MODIFY */}
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

        {/* Chart section (lazy loaded) - DO NOT MODIFY */}
        <LazyLoad id="cycle-chart">
          <CycleChart
            currentPhase={dashboardDetails?.currentPhase}
            daysUntilNextPhase={dashboardDetails?.daysUntilNextPhase}
            cycleLength={dashboardDetails?.avgCycleLength}
            nextPeriodDate={nextPeriodDate}
          />
        </LazyLoad>
        
        {/* Main recommendations grid */}
        <LazyLoad id="recommendations-grid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Recommendations section */}
          <Card>
            <CardHeader>
              <CardTitle>Phase-based Recommendations</CardTitle>
              <CardDescription>Optimized for your {dashboardDetails?.currentPhase} phase</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyLoad id="recommendations-list">
                <RecommendationsList
                  recommendations={recommendations}
                  phase={dashboardDetails?.currentPhase}
                />
              </LazyLoad>
            </CardContent>
          </Card>

          {/* Exercise section */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Tips</CardTitle>
              <CardDescription>Workouts for your current phase</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyLoad id="exercise-section">
                <ExerciseSection 
                  phase={dashboardDetails?.currentPhase}
                  exerciseDetails={exerciseDetails}
                />
              </LazyLoad>
            </CardContent>
          </Card>
        </div>
        </LazyLoad>

        {/* Nutrition section */}
        <div className="mt-8">
          <LazyLoad id="nutrition-tips">
            <NutritionTips 
              phase={dashboardDetails?.currentPhase}
              nutritionDetails={nutritionDetails}
            />
          </LazyLoad>
        </div>

        {/* Self-care section (new) */}
        <div className="mt-8">
          <LazyLoad id="self-care-section">
            <Card>
              <CardHeader>
                <CardTitle>Self-Care Practices</CardTitle>
                <CardDescription>Support your body during the {dashboardDetails?.currentPhase} phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-purple-700 mb-2">Physical Self-Care</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recommendations.self_care.physical.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-700 mb-2">Emotional Well-being</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recommendations.self_care.emotional.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-700 mb-2">Sleep Optimization</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recommendations.self_care.sleep.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </LazyLoad>
        </div>

        {/* Recent logs */}
        <div className="mt-8">
          <LazyLoad id="recent-logs">
            <RecentLogs logs={recentLogs} />
          </LazyLoad>
        </div>

        {/* Phase Info Section */}
        <div className="mt-8">
          <LazyLoad id="phase-info">
            <PhaseInfo phaseInfo={phaseInfo} />
          </LazyLoad>
        </div>

        {/* Lifestyle Tips Section */}
        <div className="mt-8">
          <LazyLoad id="lifestyle-tips">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Lifestyle Adjustments</CardTitle>
                <CardDescription>Making your daily life easier during your {dashboardDetails?.currentPhase} phase</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Work & Productivity</h3>
                    <ul className="space-y-2">
                      {lifestyleAdjustments.work.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Social Life</h3>
                    <ul className="space-y-2">
                      {lifestyleAdjustments.social.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Relationships</h3>
                    <ul className="space-y-2">
                      {lifestyleAdjustments.relationships.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 bg-red-50 p-4 rounded-md border border-red-100">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">When to Seek Help</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {whenToSeekHelp.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <span className="text-sm text-red-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </LazyLoad>
        </div>
      </main>
    </div>
  );
}