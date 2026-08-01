export type ViewMode = 'home' | 'jobs' | 'job-detail' | 'contact' | 'saved' | 'about' | 'admin' | 'admin-login';

export type JobSector = 'Government' | 'Private' | 'Multinational' | 'NGO' | 'Semi-Government';

export type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Remote' | 'Internship';

export type QualificationLevel = 
  | 'Matriculation' 
  | 'Intermediate / FSc' 
  | 'Bachelor (BS/BA)' 
  | 'Master (MS/MA)' 
  | 'Doctorate (PhD)' 
  | 'DAE / Diploma'
  | 'MBBS / Medical Degree';

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface ApplicationRecord {
  id: string;
  trackingId: string;
  jobId: string;
  jobTitle: string;
  department: string;
  category: string;
  categorySlug: string;
  applicantName: string;
  fatherName: string;
  cnic: string;
  email: string;
  mobileNumber: string;
  qualification: QualificationLevel;
  address: string;
  postalCode: string;
  appliedDate: string;
  status: ApplicationStatus;
  cnicFrontPreview?: string;
  cnicBackPreview?: string;
  paymentProofPreview?: string;
  resumeFileName?: string;
  coverNote?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  companyLogo: string;
  sector: JobSector;
  jobType: JobType;
  location: string;
  city: string;
  salaryRange: string;
  minSalary: number;
  experience: string;
  qualification: QualificationLevel;
  vacancies: number; // Available Seats (10 to 50)
  availableSeats?: number;
  postedDate: string;
  deadline: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isVerified?: boolean;
  category: string;
  categorySlug: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  howToApply: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface JobCategory {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  count: number;
  description: string;
}

export interface ApplicationFormData {
  jobId: string;
  jobTitle: string;
  department: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  mobileNumber: string;
  email: string;
  qualification: QualificationLevel;
  address: string;
  postalCode: string;
  cnicFront: File | string | null;
  cnicBack: File | string | null;
  cnicFrontPreview?: string;
  cnicBackPreview?: string;
  paymentProof?: File | string | null;
  paymentProofPreview?: string;
  resumeFile?: File | string | null;
  coverNote?: string;
  agreedToTerms: boolean;
}

export interface ApplicationReceipt {
  trackingId: string;
  appliedDate: string;
  jobTitle: string;
  department: string;
  applicantName: string;
  fatherName: string;
  cnic: string;
  email: string;
  mobileNumber: string;
  qualification: QualificationLevel;
  status: 'Received' | 'Under Review' | 'Shortlisted';
}

export interface FilterState {
  searchQuery: string;
  city: string;
  category: string;
  categorySlug: string;
  sector: string;
  jobType: string;
  qualification: string;
  experience: string;
  minSalaryFilter: number;
  sortBy: 'newest' | 'closing-soon' | 'salary-high' | 'popular';
}

export interface SiteSettings {
  websiteName: string;
  whatsappNumber: string;
  jazzCashAccountName: string;
  jazzCashAccountNumber: string;
  easyPaisaAccountName: string;
  easyPaisaAccountNumber: string;
  applicationFee: number;
}

