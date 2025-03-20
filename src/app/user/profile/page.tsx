"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import CircleLoader from "react-spinners/CircleLoader";
import { UserService } from "@/service/api/user-service";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

// Import components
import PersonalInformation from "./personal-information";
import HealthInformation from "./health-information";
import CycleTracking from "./cycle-tracking";
import AccountSettings from "./account-settings";

// Define user data interface
interface UserProfile {
  firstName: string;
  lastName: string;
  dob: string;
  height: number;
  weight: number;
  email: string;
  currentPeriodRecordId: string | null;
  lastPeriodRecordId: string | null;
}

// Helper function to convert snake_case to camelCase


// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

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

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await UserService.getUserDetails();

      if (response.success) {
        
        const processedData: UserProfile = {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          dob: response.data.dob,
          height: response.data.height,
          weight: response.data.weight,
          email: response.data.email,
          currentPeriodRecordId: response.data.currentPeriodRecordId,
          lastPeriodRecordId: response.data.lastPeriodRecordId
        };

        setUserData(processedData);
        setFormData({ ...processedData });
      }
      
      setLoading(false);
    };

    getUserDetails();
  }, [router]);

  // Handle scroll events to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["personal", "health", "cycle", "account"];
      
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert input name from HTML form (possibly with underscores) to camelCase
    const camelName = name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    setFormData({
      ...formData,
      [camelName]: value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    
    const response = await UserService.updateUserDetails(
      formData.firstName || '',
      formData.lastName || '',
      formData.dob || '',
      formData.height || 0,
      formData.weight || 0
    );

    if (response.success) {
      // Update user data directly from form data regardless of API response
      setUserData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          firstName: formData.firstName || prevData.firstName,
          lastName: formData.lastName || prevData.lastName,
          dob: formData.dob || prevData.dob,
          height: formData.height || prevData.height,
          weight: formData.weight || prevData.weight
        };
      });
    }
    
    setEditingSection(null); // Clear editing section instead of editMode
    setLoading(false);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (userData) {
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        dob: userData.dob,
        height: userData.height,
        weight: userData.weight,
        email: userData.email,
      });
    }
    setEditingSection(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircleLoader />
      </div>
    );
  }

  if (!userData) {
    return <div>Error loading profile data</div>;
  }

  const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;

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
                className="flex items-center gap-4 mb-6"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatars/profile.png" alt={`${userData.firstName} ${userData.lastName}`} />
                  <AvatarFallback className="text-xl bg-purple-100 text-purple-700">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold">{userData.firstName} {userData.lastName}</h1>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              </motion.div>
              
              <nav className="space-y-1">
                <Button 
                  variant={activeSection === "personal" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => scrollToSection("personal")}
                >
                  Personal Info
                </Button>
                <Button 
                  variant={activeSection === "health" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => scrollToSection("health")}
                >
                  Health Data
                </Button>
                <Button 
                  variant={activeSection === "cycle" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => scrollToSection("cycle")}
                >
                  Cycle Tracking
                </Button>
                <Button 
                  variant={activeSection === "account" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => scrollToSection("account")}
                >
                  Account Settings
                </Button>
              </nav>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <Section id="personal" title="Personal Information">
              <PersonalInformation 
                userData={userData}
                formData={formData}
                editingSection={editingSection}
                setEditingSection={setEditingSection}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            </Section>

            <Section id="health" title="Health Information">
              <HealthInformation 
                userData={userData}
                formData={formData}
                editingSection={editingSection}
                setEditingSection={setEditingSection}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            </Section>

            <Section id="cycle" title="Cycle Tracking">
              <CycleTracking userData={userData} />
            </Section>

            <Section id="account" title="Account Settings">
              <AccountSettings />
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}