import { type ServiceType } from './mentor.types';

export interface Meeting {
  id: string;
  mentorId: string;
  menteeId: string;

  // Meeting details
  type: ServiceType;
  scheduledDate: Date;
  scheduledTime: string; // Format: "HH:MM"
  durationMinutes: number; // e.g., 30, 60

  // Meeting platform
  meetingLink?: string; // Zoom, Google Meet, etc.
  location?: string; // For in-person meetings

  // Status tracking
  status: MeetingStatus;

  // Additional details
  menteeNotes?: string; // What the mentee wants to discuss
  mentorNotes?: string; // Mentor's notes after the meeting

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

export type MeetingStatus =
  | 'pending'      // Mentee requested, awaiting mentor approval
  | 'confirmed'    // Mentor approved, meeting scheduled
  | 'completed'    // Meeting happened
  | 'cancelled'    // Either party cancelled
  | 'no-show';     // Scheduled but didn't happen

export interface ServiceRequest {
  type: ServiceType;
  status: ServiceRequestStatus;

  // For referral requests
  referralDetails?: {
    targetCompany: string;
    targetRole: string;
    applicationDeadline?: Date;
  };

  // For resume reviews
  resumeReviewDetails?: {
    resumeUrl: string;
    targetRoles: string[];
    feedback?: string; // Mentor's feedback
  };

  // For mock interviews
  mockInterviewDetails?: {
    interviewType: string; // e.g., "Technical", "Behavioral", "Case Study"
    targetRole: string;
    focusAreas: string[];
    feedback?: string; // Mentor's feedback
  };

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type ServiceRequestStatus =
  | 'pending'      // Awaiting mentor review
  | 'approved'     // Mentor approved
  | 'in-progress'  // Mentor is working on it
  | 'completed'    // Service delivered
  | 'declined';    // Mentor declined

export const MeetingStatusLabels: Record<MeetingStatus, string> = {
  'pending': 'Pending Approval',
  'confirmed': 'Confirmed',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'no-show': 'No Show'
};

export const ServiceRequestStatusLabels: Record<ServiceRequestStatus, string> = {
  'pending': 'Pending',
  'approved': 'Approved',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'declined': 'Declined'
};
