"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { CircleLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { toast, Toaster } from "sonner";
import { apiWrapper } from '@/lib/api-wrapper';

// Service imports
import { CycleService } from "@/service/api/cycle-serice";

// Component imports
import CurrentStatus from "./current-status";
import PeriodHistory from "./period-history";
import SymptomTracking from "./symptom-tracking";
import logger from "@/lib/logger";

// Animation variants
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export interface CurrentStatusData {
    currentPeriodRecordId: string | null;
    lastPeriodRecordId: string | null;
    avgCycleLength: number | null;
    avgPeriodLength: number | null;
    nextPeriodStart: string | null;
}

export interface PeriodRecord {
    periodRecordId: string;
    currentStatus: string;
    startDatetime: string;
    endDatetime: string | null;
    durationDays: number | null;
    notes: string | null;
    symptoms: Symptom[];
}

export interface Symptom {
    symptomId: string;
    symptom: string;
    severity: number | 1;
    createdDatetime: string;
    comments: string | null;
    periodRecordId: string;
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
    const [currentStatus, setCurrentStatus] = useState<CurrentStatusData | null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<PeriodRecord | null>(null);
    const [pastPeriods, setPastPeriods] = useState<PeriodRecord[]>([]);
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [activeSection, setActiveSection] = useState("status");

    useEffect(() => {
        const getUserDetails = async () => {
            const { response, error } = await apiWrapper(
                () => CycleService.getCurrentStatus(),
                {
                    showToast: true,
                    errorMessage: "Failed to get current status"
                }
            );

            if (response && response.success) {
                logger.info("Current Status", response.data);

                setCurrentStatus(response.data);

                // Fetch period data in parallel
                await Promise.all([
                    fetchCurrentPeriod(response.data.currentPeriodRecordId),
                    fetchPastPeriods(),
                    fetchSymptoms()
                ]);
            }

            setLoading(false);
        };

        getUserDetails();
    }, []);

    // Handle scroll events to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ["status", "history", "symptoms"];
            const viewportHeight = window.innerHeight;
            const scrollPosition = window.scrollY;

            // Calculate which section occupies most of the viewport
            let maxVisibleSection = "";
            let maxVisibleArea = 0;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (!element) continue;

                const rect = element.getBoundingClientRect();

                // Calculate how much of the section is visible in the viewport
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                // If this section has more visible area than previous maximum, update
                if (visibleHeight > maxVisibleArea) {
                    maxVisibleArea = visibleHeight;
                    maxVisibleSection = section;
                }

                // Special case: if section is near the top, prioritize it
                if (rect.top < 150 && rect.bottom > 100) {
                    maxVisibleSection = section;
                    break;  // Give priority to the top-most visible section
                }
            }

            // Only update if we found a visible section
            if (maxVisibleSection) {
                setActiveSection(maxVisibleSection);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Trigger once on mount to set initial section
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (section: string) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch current period details if exists
    const fetchCurrentPeriod = async (periodId: string | null) => {
        if (!periodId) return;

        const { response, error } = await apiWrapper(
            () => CycleService.getPeriodRecordDetails(periodId),
            { showToast: true, errorMessage: "Failed to load current period data" }
        );

        if (response && response.success) {
            setCurrentPeriod(response.data);
            logger.info("Current period details", response);
        }
    };

    // Fetch past periods
    const fetchPastPeriods = async () => {
        const { response, error } = await apiWrapper(
            () => CycleService.getPeriodRecords(),
            {
                showToast: true,
                errorMessage: "Failed to load period history"
            }
        );

        if (response && response.success) {
            setPastPeriods(response.data.periodRecords);
            logger.info("Past period records", response.data.periodRecords);
        }
    };

    // Fetch symptoms
    const fetchSymptoms = async () => {
        const { response, error } = await apiWrapper(
            () => CycleService.getSymptoms(),
            {
                showToast: true,
                errorMessage: "Failed to load symptoms data"
            }
        );

        
        if (response && response.success) {
            // Add random severity in each symptoms
            response.data.symptoms.forEach((symptom: Symptom) => {
                symptom.severity = Math.floor(Math.random() * 3) + 1;
            });

            setSymptoms(response.data.symptoms);
            logger.info("Symptoms", response.data.symptoms);
        }
    };

    // Handle starting a new period
    const handleStartPeriod = async () => {
        setLoading(true);

        const { response, error } = await apiWrapper(
            () => CycleService.creatPeriodStartEvent(),
            {
                showToast: true,
                successMessage: "Period started successfully",
                errorMessage: "Failed to start period tracking"
            }
        );

        if (response && response.success) {
            setCurrentPeriod(response.data);

            // Update user data
            if (currentStatus) {
                setCurrentStatus({
                    ...currentStatus,
                    currentPeriodRecordId: response.data.periodRecordId,
                    lastPeriodRecordId: currentStatus.lastPeriodRecordId || null
                });
            }
        }

        setLoading(false);
    };

    // Handle ending current period
    const handleEndPeriod = async () => {
        if (!currentPeriod) return;
        setLoading(true);

        const { response, error } = await apiWrapper(
            () => CycleService.creatPeriodEndEvent(),
            {
                showToast: true,
                successMessage: "Period ended successfully",
                errorMessage: "Failed to end period tracking"
            }
        );

        if (response && response.success) {
            // Add ended period to past periods
            setPastPeriods([response.data, ...pastPeriods]);

            // Clear current period
            setCurrentPeriod(null);

            // Update user data
            if (currentStatus) {
                setCurrentStatus({
                    ...currentStatus,
                    currentPeriodRecordId: null,
                    lastPeriodRecordId: response.data.periodRecordId
                });
            }
        }

        setLoading(false);
    };

    // Loading state
    if (loading && !currentStatus) {
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
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <Section id="status" title="Current Status">
                            <CurrentStatus
                                currentStatus={currentStatus}
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

                    {/* Sticky Navigation - Now on the right side */}
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
                                            <p className="text-sm text-pink-800 mb-2">Day {differenceInDays(new Date(), new Date(currentPeriod.startDatetime)) + 1}</p>
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
                </div>
            </main>
            <Toaster theme="dark" />
        </div>
    );
}