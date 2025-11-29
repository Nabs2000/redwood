import { type PendingRequest } from "./pendingRequest.types";
import { type UpcomingSession } from "./upcomingSession.types";
export interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  registrationComplete: boolean;
  mentoredCount: number;
  pendingRequests: PendingRequest[];
  upcomingSessions: UpcomingSession[];

  // Profile information
  title: string; // e.g., "Senior Software Engineer", "Marketing Director"
  bio: string;
  profilePhotoUrl?: string;
  linkedInUrl?: string;

  // Expertise and specialties
  industry: string; // e.g., "Technology", "Healthcare", "Finance"
  specialties: string[]; // e.g., ["Software Engineering", "Career Transitions", "Interview Prep"]
  yearsOfExperience: number;

  // Availability
  availability: WeeklyAvailability;
  timezone: string; // e.g., "America/New_York"

  // Services offered
  servicesOffered: ServiceType[];

  // Settings
  isActive: boolean; // Whether accepting new mentees
  maxMenteesPerMonth?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  rating?: number; // Average rating from mentees
  totalMeetings?: number;
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
}

export type ServiceType =
  | "initial-consultation"
  | "referral-request"
  | "resume-review"
  | "mock-interview"
  | "career-advice";

export const ServiceTypeLabels: Record<ServiceType, string> = {
  "initial-consultation": "Initial Consultation",
  "referral-request": "Referral Request",
  "resume-review": "Resume Review",
  "mock-interview": "Mock Interview",
  "career-advice": "Career Advice",
};

export const ServiceTypeDescriptions: Record<ServiceType, string> = {
  "initial-consultation":
    "Get to know your mentor and discuss your career goals",
  "referral-request": "Request a referral to your mentor's company or network",
  "resume-review": "Get feedback and suggestions on your resume",
  "mock-interview": "Practice interviewing with personalized feedback",
  "career-advice": "General career guidance and mentorship",
};
