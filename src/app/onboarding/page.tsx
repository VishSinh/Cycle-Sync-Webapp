"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import CircleLoader from "react-spinners/CircleLoader";
import { UserService } from "@/service/api/user-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Routes from "@/lib/routes";

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Personal information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState<Date | undefined>(undefined);
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");

    // Period information
    const [lastPeriodStart, setLastPeriodStart] = useState<Date | undefined>(undefined);
    const [ongoingPeriod, setOngoingPeriod] = useState(true);
    const [lastPeriodEnd, setLastPeriodEnd] = useState<Date | undefined>(undefined);

    // Convert date to datetime with time set to beginning of day (00:00:00)
    const handlePeriodStartDateSelect = (date: Date | undefined) => {
        if (date) {
            // Set time to beginning of day (00:00:00)
            const dateWithTime = setSeconds(setMinutes(setHours(date, 0), 0), 0);
            setLastPeriodStart(dateWithTime);
        } else {
            setLastPeriodStart(undefined);
        }
    };

    // Convert date to datetime with time set to end of day (23:59:59)
    const handlePeriodEndDateSelect = (date: Date | undefined) => {
        if (date) {
            // Set time to end of day (23:59:59)
            const dateWithTime = setSeconds(setMinutes(setHours(date, 23), 59), 59);
            setLastPeriodEnd(dateWithTime);
        } else {
            setLastPeriodEnd(undefined);
        }
    };

    const validateStep1 = () => {
        if (!firstName.trim()) return "First name is required";
        if (!lastName.trim()) return "Last name is required";
        return null;
    };

    const validateStep2 = () => {
        if (!lastPeriodStart) return "Last period start date is required";
        if (!ongoingPeriod && !lastPeriodEnd) return "Please provide when your last period ended";

        const startDate = new Date(lastPeriodStart);
        const endDate = new Date(lastPeriodEnd ? lastPeriodEnd : new Date());
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays < 3 && !ongoingPeriod) {
            return "Your period length seems too short (less than 3 days). Please verify the dates.";
        }

        if (differenceInDays > 8) {
            return "Your period length seems too long (more than 8 days). Please verify the dates.";
        }

        return null;
    };

    const handleNextStep = () => {
        const error = validateStep1();
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);
        setCurrentStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        

        const error = validateStep2();
        if (error) {
            setFormError(error);
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        try {
            const response = await UserService.addUserDetails(
                firstName,
                lastName,
                lastPeriodStart ? format(lastPeriodStart, "yyyy-MM-dd'T'HH:mm:ss") : "",
                dob ? format(dob, "yyyy-MM-dd") : null,
                height ? parseFloat(height) : null,
                weight ? parseFloat(weight) : null,
                lastPeriodEnd ? format(lastPeriodEnd, "yyyy-MM-dd'T'HH:mm:ss") : null,
                ongoingPeriod
            );

            if (response.success) {
                router.push(Routes.DASHBOARD);
                window.location.reload();
            } else {
                setFormError(response.error?.details || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setFormError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10"></div>
                <Image 
                    src="/images/auth-background.jpg" 
                    alt="Background" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    priority
                    className="z-0"
                />
            </div>
            
            {/* Content */}
            <div className="relative z-20 flex flex-1 flex-col min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center p-4 flex-grow">
                    <Card className="w-full max-w-xl mx-auto shadow-lg border-white bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            {/* <CardTitle className="text-2xl font-bold text-purple-800">Welcome to CycleSync</CardTitle> */}
                            <CardDescription>Let&apos;s personalize your experience</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                                    {formError}
                                </div>
                            )}

                            <Tabs value={`step-${currentStep}`} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger
                                        value="step-1"
                                        disabled={currentStep !== 1}
                                        className={currentStep === 1 ? "font-bold" : "text-gray-500"}
                                    >
                                        Personal Details
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="step-2"
                                        disabled={currentStep !== 2}
                                        className={currentStep === 2 ? "font-bold" : "text-gray-500"}
                                    >
                                        Period Information
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="step-1">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    placeholder="Jane"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dob">Date of Birth (Optional)</Label>
                                            <DatePicker
                                                date={dob}
                                                onSelect={setDob}
                                                disabled={(date) => date > new Date()}
                                            />
                                        </div>

                                        <Separator className="my-4" />
                                        <p className="text-sm text-gray-500 mb-2">Optional physical details</p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="height">Height (cm)</Label>
                                                <Input
                                                    id="height"
                                                    type="number"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    placeholder="165"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="weight">Weight (kg)</Label>
                                                <Input
                                                    id="weight"
                                                    type="number"
                                                    value={weight}
                                                    onChange={(e) => setWeight(e.target.value)}
                                                    placeholder="60"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <Button onClick={handleNextStep}>
                                            Next Step
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="step-2">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="periodStartDate">
                                                When did your last period start?
                                            </Label>
                                            <DatePicker
                                                date={lastPeriodStart}
                                                onSelect={handlePeriodStartDateSelect}
                                                disabled={(date) => date > new Date()}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2 my-6">
                                            <Switch
                                                id="ongoing"
                                                checked={ongoingPeriod}
                                                onCheckedChange={(checked) => {
                                                    setOngoingPeriod(checked);
                                                    if (checked) {
                                                        setLastPeriodEnd(undefined);
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="ongoing">
                                                My period is still ongoing
                                            </Label>
                                        </div>

                                        {!ongoingPeriod && (
                                            <div className="space-y-2">
                                                <Label htmlFor="periodEndDate">
                                                    When did your last period end?
                                                </Label>
                                                <DatePicker
                                                    date={lastPeriodEnd}
                                                    onSelect={handlePeriodEndDateSelect}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        (lastPeriodStart ? date < lastPeriodStart : false)
                                                    }
                                                />
                                            </div>
                                        )}

                                        <div className="pt-6 flex justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setCurrentStep(1)}
                                            >
                                                Back
                                            </Button>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <CircleLoader size={16} color="#ffffff" className="mr-2" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Complete Setup"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-2 border-t pt-4">
                            <p className="text-xs text-center text-gray-500">
                                Your information is private and secure. We use this data only to provide personalized cycle insights.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}