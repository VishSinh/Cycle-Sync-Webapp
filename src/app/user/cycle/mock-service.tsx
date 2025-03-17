import { PeriodRecord, Symptom, UserProfile } from "@/app/user/cycle/page";
import { v4 as uuidv4 } from "uuid";

// Mock user data
const mockUserData = {
  first_name: "Jane",
  last_name: "Doe",
  current_period_record_id: "period-1",
  last_period_record_id: "period-2"
};

// Mock period data
const mockCurrentPeriod: PeriodRecord = {
  id: "period-1",
  startDate: "2025-03-12",
  endDate: null,
  durationDays: null,
  notes: "Heavier than usual",
  symptoms: []
};

const mockPastPeriods: PeriodRecord[] = [
  {
    id: "period-2",
    startDate: "2025-02-12",
    endDate: "2025-02-17",
    durationDays: 6,
    notes: "Normal flow",
    symptoms: []
  },
  {
    id: "period-3",
    startDate: "2025-01-15",
    endDate: "2025-01-20",
    durationDays: 5,
    notes: "Light flow",
    symptoms: []
  },
  {
    id: "period-4",
    startDate: "2024-12-18",
    endDate: "2024-12-24",
    durationDays: 7,
    notes: "Heavy cramps",
    symptoms: []
  }
];

// Mock symptom data
const mockSymptoms: Symptom[] = [
  {
    id: "symptom-1",
    type: "Cramps",
    severity: 3,
    date: "2025-03-13",
    notes: "Severe lower abdomen pain"
  },
  {
    id: "symptom-2",
    type: "Headache",
    severity: 2,
    date: "2025-03-12",
    notes: "Frontal headache, resolved with ibuprofen"
  },
  {
    id: "symptom-3",
    type: "Bloating",
    severity: 2,
    date: "2025-02-14",
    notes: null
  },
  {
    id: "symptom-4",
    type: "Mood swings",
    severity: 1,
    date: "2025-02-13",
    notes: "Mild irritability"
    },
    {
        id: "symptom-11",
        type: "Cramps",
        severity: 3,
        date: "2025-03-13",
        notes: "Severe lower abdomen pain"
      },
      {
        id: "symptom-22",
        type: "Headache",
        severity: 2,
        date: "2025-03-12",
        notes: "Frontal headache, resolved with ibuprofen"
      },
];

// Mock User Service
export const UserService = {
  getUserDetails: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: mockUserData
    };
  }
};

// Mock Period Service
export const PeriodService = {
  getCurrentPeriod: async (periodId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      data: mockCurrentPeriod
    };
  },
  
  getPastPeriods: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      data: mockPastPeriods
    };
  },
  
  startPeriod: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPeriod: PeriodRecord = {
      id: uuidv4(),
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      durationDays: null,
      notes: null,
      symptoms: []
    };
    
    return {
      success: true,
      data: newPeriod
    };
  },
  
  endPeriod: async (periodId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const today = new Date().toISOString().split('T')[0];
    const startDate = mockCurrentPeriod.startDate;
    const durationDays = Math.floor((new Date(today).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const endedPeriod: PeriodRecord = {
      ...mockCurrentPeriod,
      endDate: today,
      durationDays: durationDays
    };
    
    return {
      success: true,
      data: endedPeriod
    };
  }
};

// Mock Symptom Service
export const SymptomService = {
  getSymptoms: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockSymptoms
    };
  },
  
  addSymptom: async (symptomData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSymptom: Symptom = {
      id: uuidv4(),
      type: symptomData.type,
      severity: symptomData.severity,
      date: symptomData.date,
      notes: symptomData.notes
    };
    
    return {
      success: true,
      data: newSymptom
    };
  }
};