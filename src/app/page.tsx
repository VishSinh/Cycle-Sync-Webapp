"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CircleLoader from "react-spinners/CircleLoader";
import HashLoader from "react-spinners/HashLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { DashoardService } from "@/service/api/dashboard-service";
import PhaseInfo from "@/components/dashboard/phase-info";
import { DashboardData, ExerciseDetailsData, HealthWarningData, LifestyleAdjustmentsData, NutritionDetailsData, PhaseInfoData, RecommendationsData } from "@/components/dashboard/interfaces";
import { convert_phase_to_string } from "@/lib/helpers";


// Lazy loaded components
const CycleChart = lazy(() => import('@/components/dashboard/cycle-chart'));
const RecommendationsList = lazy(() => import('@/components/dashboard/recommendations'));
const ExerciseSection = lazy(() => import('@/components/dashboard/exercise-section'));
const NutritionTips = lazy(() => import('@/components/dashboard/nutrition-tips'));



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
          className={`transition-all duration-700 ease-out ${hasLoaded
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [nextPeriodDate, setNextPeriodDate] = useState<Date>(new Date());

  const [phaseInfo, setPhaseInfo] = useState<PhaseInfoData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetailsData[] | null>(null);
  const [nutritionDetails, setNutritionDetails] = useState<NutritionDetailsData | null>(null);
  const [lifestyleAdjustments, setLifestyleAdjustments] = useState<LifestyleAdjustmentsData | null>(null);
  const [healthWarning, setHealthWarning] = useState<HealthWarningData | null>(null);


  // Check authentication
  useEffect(() => {
    const getDashboardDetails = async () => {

      const response = await DashoardService.getDashboardDetails();

      if (response.success) {
        const currPhase = response.data.currentPhase;

        response.data.currentPhase = convert_phase_to_string(response.data.currentPhase);

        if (response.data.nextPeriodStart) {
          setNextPeriodDate(new Date(response.data.nextPeriodStart));

          // Convert date to Month Day format
          response.data.nextPeriodStart = new Date(response.data.nextPeriodStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        }

        setDashboardData(response.data);

        const detailsResponse = await DashoardService.getDashboardDetailsData(currPhase);

        if (detailsResponse.success) {
          setPhaseInfo(detailsResponse.data.phaseInfo);

          // Transform recommendations data structure to match expected format
          // The API returns data structures that need to be transformed for the components
          if (detailsResponse.data.recommendations) {
            const recs = detailsResponse.data.recommendations;
            const formattedRecs = {
              nutrition: {
                foodsToEmphasize: recs.nutrition?.[0].foodsToEmphasize || [],
                foodsToMinimize: recs.nutrition?.[0]?.foodsToMinimize || [],
                nutrientsToFocusOn: recs.nutrition?.[0]?.nutrientsToFocusOn || []
              },
              exercise: {
                recommendedTypes: recs.exercise?.[0]?.recommendedTypes || [],
                intensityLevel: recs.exercise?.[0]?.intensityLevel || '',
                exercisesToAvoid: recs.exercise?.[0]?.exercisesToAvoid || []
              },
              selfCare: {
                physical: recs.selfCare?.[0]?.physical || [],
                emotional: recs.selfCare?.[0]?.emotional || [],
                sleep: recs.selfCare?.[0]?.sleep || []
              }
            };
            setRecommendations(formattedRecs);
          }

          setExerciseDetails(detailsResponse.data.exerciseDetails);

          // Transform nutrition details to match the expected interface format
          // if (detailsResponse.data.nutritionDetails) {
          //   const nutr = detailsResponse.data.nutritionDetails;
          //   const formattedNutr: NutritionDetailsData = {
          //     keyNutrients: nutr.keyNutrients || [],
          //     mealPlan: {
          //       breakfastIdeas: nutr.mealPlan?.breakfastIdeas || [],
          //       lunchIdeas: nutr.mealPlan?.lunchIdeas || [],
          //       dinnerIdeas: nutr.mealPlan?.dinnerIdeas || [],
          //       snackIdeas: nutr.mealPlan?.snackIdeas || []
          //     },
          //     hydrationTips: nutr.hydrationTips || '',
          //     supplementRecommendations: nutr.supplementRecommendations || []
          //   };
          //   setNutritionDetails(formattedNutr);
          // } else {
          //   console.warn("Nutrition details data is missing or malformed");
          // }
          setNutritionDetails(detailsResponse.data.nutrientDetails);
          setLifestyleAdjustments(detailsResponse.data.lifestyleAdjustments);
          setHealthWarning(detailsResponse.data.healthWarning);
        }
      }

      setLoading(false);
    };

    getDashboardDetails();
  }, [router]);

  // // Optional: Add this effect to log state changes when they actually occur
  // useEffect(() => {
  //   if (phaseInfo) console.log("Updated phaseInfo:", phaseInfo);
  //   if (recommendations) console.log("Updated recommendations:", recommendations);
  //   if (exerciseDetails) console.log("Updated exerciseDetails:", exerciseDetails);
  //   if (nutritionDetails) console.log("Updated nutritionDetails:", nutritionDetails);
  //   if (lifestyleAdjustments) console.log("Updated lifestyleAdjustments:", lifestyleAdjustments);
  //   if (healthWarning) console.log("Updated healthWarning:", healthWarning);
  // }, [phaseInfo, recommendations, exerciseDetails, nutritionDetails, lifestyleAdjustments, healthWarning]);


  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircleLoader size={50} color="#8b5cf6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="container mx-auto pt-24 pb-12 px-4 flex-grow">

        {/* Stats cards - DO NOT MODIFY */}
        <LazyLoad id="stats-cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="overflow-hidden border-gray-200 shadow-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg"></div>
              <div className="absolute top-0 left-0 h-1 w-full bg-purple-400 rounded-t"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </span>
                  Current Phase
                </CardTitle>
                <CardDescription>Your menstrual cycle status</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-gray-800">{dashboardData?.currentPhase}</div>
                <p className="text-sm text-gray-600 mt-1">
                  {dashboardData?.daysUntilNextPhase} days until next phase
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-gray-200 shadow-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg"></div>
              <div className="absolute top-0 left-0 h-1 w-full bg-teal-400 rounded-t"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                  Cycle Length
                </CardTitle>
                <CardDescription>Your average cycle duration</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                {
                  dashboardData && dashboardData.avgCycleLength ?
                    <>
                      <div className="text-3xl font-bold text-gray-800">{dashboardData?.avgCycleLength}</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Based on your last cycles
                      </p>
                    </>
                    :
                    <div className="flex flex-col items-center text-center py-2">
                      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-base text-gray-700 font-medium">No cycle data yet</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Log at least 2 cycles to calculate your average
                      </p>
                    </div>
                }
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-gray-200 shadow-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg"></div>
              <div className="absolute top-0 left-0 h-1 w-full bg-rose-400 rounded-t"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-rose-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  Next Period
                </CardTitle>
                <CardDescription>Estimated start date</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                {
                  dashboardData && dashboardData.nextPeriodStart ?
                    <>
                      <div className="text-3xl font-bold text-gray-800">{dashboardData?.nextPeriodStart}</div>
                      <p className="text-sm text-gray-600 mt-1">
                        {dashboardData?.daysUntilNextPeriod} days from today
                      </p>
                    </>
                    :
                    <div className="flex flex-col items-center text-center py-2">
                      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-base text-gray-700 font-medium">Prediction unavailable</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Continue tracking to get period predictions
                      </p>
                    </div>
                }
              </CardContent>
            </Card>
          </div>
        </LazyLoad>

        {/* Chart section (lazy loaded) - DO NOT MODIFY */}
        <LazyLoad id="cycle-chart">
          {dashboardData ?
            <CycleChart
              currentPhase={dashboardData?.currentPhase}
              daysUntilNextPhase={dashboardData?.daysUntilNextPhase}
              cycleLength={dashboardData?.avgCycleLength ?? 28}
              nextPeriodDate={nextPeriodDate}
              lastPeriodStart={new Date(dashboardData?.lastPeriodStart)}
            />
            :
            <Card>
              <CardHeader>
                <CardTitle>Menstrual Cycle Chart</CardTitle>
                <CardDescription>Track your cycle phases</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <HashLoader size={30} color="#8b5cf6" />
              </CardContent>
            </Card>
          }
        </LazyLoad>

        {/* Main recommendations grid */}
        <LazyLoad id="recommendations-grid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Recommendations section */}
            <Card>
              <CardHeader>
                <CardTitle>Phase-based Recommendations</CardTitle>
                <CardDescription>Optimized for your {dashboardData?.currentPhase} phase</CardDescription>
              </CardHeader>
              <CardContent>
                <LazyLoad id="recommendations-list">
                  {recommendations ? (
                    <RecommendationsList
                      recommendations={recommendations}
                      phase={dashboardData?.currentPhase}
                    />
                  ) : (
                    <div className="flex justify-center py-4">
                      <HashLoader size={30} color="#8b5cf6" />
                    </div>
                  )}
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
                  {exerciseDetails ? (
                    <ExerciseSection
                      phase={dashboardData?.currentPhase}
                      exerciseDetails={exerciseDetails}
                    />
                  ) : (
                    <div className="flex justify-center py-4">
                      <HashLoader size={30} color="#8b5cf6" />
                    </div>
                  )}
                </LazyLoad>
              </CardContent>
            </Card>
          </div>
        </LazyLoad>

        {/* Nutrition section */}
        <div className="mt-8">
          <LazyLoad id="nutrition-tips">
            {nutritionDetails ? (
              <NutritionTips
                phase={dashboardData?.currentPhase}
                nutritionDetails={nutritionDetails}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition for {dashboardData?.currentPhase} Phase</CardTitle>
                  <CardDescription>Dietary recommendations</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <HashLoader size={30} color="#8b5cf6" />
                </CardContent>
              </Card>
            )}
          </LazyLoad>
        </div>

        {/* Self-care section (new) */}
        <div className="mt-8">
          <LazyLoad id="self-care-section">
            <Card>
              <CardHeader>
                <CardTitle>Self-Care Practices</CardTitle>
                <CardDescription>Support your body during the {dashboardData?.currentPhase} phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-purple-700 mb-2">Physical Self-Care</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recommendations?.selfCare?.physical?.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      )) || (
                        <div className="flex justify-center py-4">
                          <HashLoader size={25} color="#8b5cf6" />
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </LazyLoad>
        </div>

        {/* Phase Info Section */}
        <div className="mt-8">
          <LazyLoad id="phase-info">
            {phaseInfo ? (
              <PhaseInfo phaseInfo={phaseInfo} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>About Your Current Phase</CardTitle>
                  <CardDescription>Understanding your cycle</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <HashLoader size={30} color="#8b5cf6" />
                </CardContent>
              </Card>
            )}
          </LazyLoad>
        </div>

        {/* Lifestyle Tips Section */}
        <div className="mt-8">
          <LazyLoad id="lifestyle-tips">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Lifestyle Adjustments</CardTitle>
                <CardDescription>Making your daily life easier during your {dashboardData?.currentPhase} phase</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Work & Productivity</h3>
                    <ul className="space-y-2">
                      {lifestyleAdjustments?.work?.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      )) || (
                        <div className="flex justify-center py-4">
                          <HashLoader size={25} color="#8b5cf6" />
                        </div>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Social Life</h3>
                    <ul className="space-y-2">
                      {lifestyleAdjustments?.social?.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      )) || (
                        <div className="flex justify-center py-4">
                          <HashLoader size={25} color="#8b5cf6" />
                        </div>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Relationships</h3>
                    <ul className="space-y-2">
                      {lifestyleAdjustments?.relationships?.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      )) || (
                        <div className="flex justify-center py-4">
                          <HashLoader size={25} color="#8b5cf6" />
                        </div>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 bg-red-50 p-4 rounded-md border border-red-100">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">When to Seek Help</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {healthWarning?.whenToSeekHelp?.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <span className="text-sm text-red-800">{item}</span>
                      </div>
                    )) || (
                      <div className="flex justify-center py-4 col-span-2">
                        <HashLoader size={25} color="#ef4444" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </LazyLoad>
        </div>
      </main>

      {/* Add Footer component */}
      <Footer />
    </div>
  );
}