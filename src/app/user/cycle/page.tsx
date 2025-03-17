"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { CircleLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Service imports
import { UserService, PeriodService,SymptomService  } from "./mock-service";

// Component imports
import CurrentStatus from "./current-status";
import PeriodHistory from "./period-history";
import SymptomTracking from "./symptom-tracking";


// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export interface UserProfile {
    firstName: string;
    lastName: string;
    currentPeriodRecordId: string | null;
    lastPeriodRecordId: string | null;
  }
  
export interface PeriodRecord {
id: string;
startDate: string;
endDate: string | null;
durationDays: number | null;
notes: string | null;
symptoms: Symptom[];
}

export interface Symptom {
id: string;
type: string;
severity: number;
date: string;
notes: string | null;
}

// Section component with animation and lazy loading
function Section({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="mb-10 scroll-mt-24"
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </motion.section>
  );
}

export default function PeriodsPage() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<PeriodRecord | null>(null);
    const [pastPeriods, setPastPeriods] = useState<PeriodRecord[]>([]);
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [activeSection, setActiveSection] = useState("status");

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                // Get user details
                const response = await UserService.getUserDetails();
        
                if (response.success) {
                    // Set basic user data
                    setUserData({
                        firstName: response.data.first_name,
                        lastName: response.data.last_name,
                        currentPeriodRecordId: response.data.current_period_record_id,
                        lastPeriodRecordId: response.data.last_period_record_id
                    });
          
                    // Fetch period data in parallel
                    await Promise.all([
                        fetchCurrentPeriod(response.data.current_period_record_id),
                        fetchPastPeriods(),
                        fetchSymptoms()
                    ]);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
    }, []);

    // Handle scroll events to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ["status", "history", "symptoms"];
            
            for (const section of sections) {
                const element = document.getElementById(section);
                if (!element) continue;
                
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (section: string) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch current period details if exists
    const fetchCurrentPeriod = async (periodId: string | null) => {
        if (!periodId) return;
        
        const response = await PeriodService.getCurrentPeriod(periodId);
        
        if (response.success) {
            setCurrentPeriod(response.data);
        }
    };

    // Fetch past periods
    const fetchPastPeriods = async () => {
        const response = await PeriodService.getPastPeriods();
        
        if (response.success) {
            setPastPeriods(response.data);
        }
    };

    // Fetch symptoms
    const fetchSymptoms = async () => {
        const response = await SymptomService.getSymptoms();
        
        if (response.success) {
            setSymptoms(response.data);
        }
    };

    // Handle starting a new period
    const handleStartPeriod = async () => {
        setLoading(true);
    
        try {
            const response = await PeriodService.startPeriod();
            
            if (response.success) {
                // Set the newly created period as current
                setCurrentPeriod(response.data);
                
                // Update user data
                if (userData) {
                    setUserData({
                        ...userData,
                        currentPeriodRecordId: response.data.id,
                        lastPeriodRecordId: userData.lastPeriodRecordId || null
                    });
                }
            }
        } catch (error) {
            console.error("Error starting period:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle ending current period
    const handleEndPeriod = async () => {
        if (!currentPeriod) return;
        setLoading(true);
    
        try {
            const response = await PeriodService.endPeriod(currentPeriod.id);
            
            if (response.success) {
                // Add ended period to past periods
                setPastPeriods([response.data, ...pastPeriods]);
                
                // Clear current period
                setCurrentPeriod(null);
                
                // Update user data
                if (userData) {
                    setUserData({
                        ...userData,
                        currentPeriodRecordId: null,
                        lastPeriodRecordId: response.data.id
                    });
                }
            }
        } catch (error) {
            console.error("Error ending period:", error);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading && !userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <CircleLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
      
            <main className="container mx-auto pt-24 pb-12 px-4">
                
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sticky Navigation */}
                    <aside className="md:w-64 shrink-0">
                        <div className="sticky top-24 space-y-1">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mb-6"
                            >
                                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 mb-4">
                                    {currentPeriod ? (
                                        <div className="text-center">
                                            <Badge variant="destructive" className="mb-1">Active Period</Badge>
                                            <p className="text-sm text-pink-800 mb-2">Day {differenceInDays(new Date(), new Date(currentPeriod.startDate)) + 1}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Badge variant="outline" className="mb-1">No Active Period</Badge>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            
                            <nav className="space-y-1">
                                <Button 
                                    variant={activeSection === "status" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => scrollToSection("status")}
                                >
                                    Current Status
                                </Button>
                                <Button 
                                    variant={activeSection === "history" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => scrollToSection("history")}
                                >
                                    Period History
                                </Button>
                                <Button 
                                    variant={activeSection === "symptoms" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => scrollToSection("symptoms")}
                                >
                                    Symptoms
                                </Button>
                            </nav>
                        </div>
                    </aside>
                    
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <Section id="status" title="Current Status">
                            <CurrentStatus 
                                currentPeriod={currentPeriod}
                                pastPeriods={pastPeriods}
                                handleStartPeriod={handleStartPeriod}
                                handleEndPeriod={handleEndPeriod}
                                loading={loading}
                            />
                        </Section>
                        
                        <Section id="history" title="Period History">
                            <PeriodHistory pastPeriods={pastPeriods} />
                        </Section>
                        
                        <Section id="symptoms" title="Symptom Tracking">
                            <SymptomTracking 
                                symptoms={symptoms}
                                setSymptoms={setSymptoms}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        </Section>
                    </div>
                </div>
            </main>
        </div>
    );
}