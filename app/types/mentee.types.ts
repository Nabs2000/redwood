export interface Mentee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // Professional background
  currentRole?: string;
  currentCompany?: string;
  careerGoals?: string;
  profilePhotoUrl?: string;
  linkedInUrl?: string;
  resumeUrl?: string;

  // Interests for matching
  interestedIndustries: string[];
  interestedRoles: string[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
