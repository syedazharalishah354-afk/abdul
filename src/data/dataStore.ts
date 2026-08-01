import { Job, ApplicationRecord, ApplicationStatus, SiteSettings } from '../types';
import { MOCK_JOBS } from './mockJobs';

const JOBS_STORAGE_KEY = 'jobshub_jobs_v2';
const APPS_STORAGE_KEY = 'jobshub_applications_v2';
const ADMIN_SESSION_KEY = 'jobshub_admin_session_v1';
const SETTINGS_STORAGE_KEY = 'jobshub_site_settings_v1';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  websiteName: 'jobshubofficial',
  whatsappNumber: '03477957267',
  jazzCashAccountName: 'Muhammad Amir',
  jazzCashAccountNumber: '03247459091',
  easyPaisaAccountName: 'Muhammad Shajehan',
  easyPaisaAccountNumber: '03471713065',
  applicationFee: 500,
};

// Sample CNIC and document mock images for realistic initial applications
const SAMPLE_CNIC_FRONT = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
const SAMPLE_CNIC_BACK = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80';
const SAMPLE_PAYMENT_PROOF = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80';

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1001',
    trackingId: 'JH-2026-98412',
    jobId: 'jh-government-1001',
    jobTitle: 'Assistant Director (BPS-17)',
    department: 'Federal Public Service Commission (FPSC)',
    category: 'Government Jobs',
    categorySlug: 'government',
    applicantName: 'Muhammad Hamza Khan',
    fatherName: 'Tariq Mehmood Khan',
    cnic: '35202-4918234-1',
    email: 'hamza.khan@gmail.com',
    mobileNumber: '0300-8472910',
    qualification: 'Master (MS/MA)',
    address: 'House #45, Block C, Johar Town, Lahore',
    postalCode: '54000',
    appliedDate: '2026-07-28',
    status: 'Pending',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK,
    paymentProofPreview: SAMPLE_PAYMENT_PROOF,
    coverNote: 'I have completed my Masters in Public Administration with 4 years of administrative experience.'
  },
  {
    id: 'app-1002',
    trackingId: 'JH-2026-45109',
    jobId: 'jh-it-1001',
    jobTitle: 'React & Node.js Developer',
    department: 'Systems Limited Pakistan',
    category: 'IT Jobs',
    categorySlug: 'it',
    applicantName: 'Syeda Fatima Zahra',
    fatherName: 'Syed Ali Raza',
    cnic: '61101-9238412-4',
    email: 'fatima.zahra@dev.pk',
    mobileNumber: '0313-5592184',
    qualification: 'Bachelor (BS/BA)',
    address: 'Street 12, F-8/3, Islamabad',
    postalCode: '44000',
    appliedDate: '2026-07-29',
    status: 'Approved',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK,
    paymentProofPreview: SAMPLE_PAYMENT_PROOF,
    adminNotes: 'Candidate passed technical screening. Approved for final interview call.'
  },
  {
    id: 'app-1003',
    trackingId: 'JH-2026-77310',
    jobId: 'jh-private-1001',
    jobTitle: 'Operations Manager',
    department: 'Interloop Corporate Services Ltd.',
    category: 'Private Jobs',
    categorySlug: 'private',
    applicantName: 'Zubair Ahmed Chaudhry',
    fatherName: 'Muhammad Bashir Chaudhry',
    cnic: '38403-1192843-9',
    email: 'zubair.chaudhry@outlook.com',
    mobileNumber: '0333-4129853',
    qualification: 'Master (MS/MA)',
    address: 'Sector G-11/2, Street 4, Islamabad',
    postalCode: '44000',
    appliedDate: '2026-07-25',
    status: 'Pending',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK,
    paymentProofPreview: SAMPLE_PAYMENT_PROOF
  },
  {
    id: 'app-1004',
    trackingId: 'JH-2026-12948',
    jobId: 'jh-hospital-1001',
    jobTitle: 'Charge Nurse (BPS-16)',
    department: 'Mayo Hospital Lahore',
    category: 'Hospital Jobs',
    categorySlug: 'hospital',
    applicantName: 'Ayesha Bibi',
    fatherName: 'Allah Ditta',
    cnic: '35102-8823910-2',
    email: 'ayesha.nurse@gmail.com',
    mobileNumber: '0302-9912834',
    qualification: 'Bachelor (BS/BA)',
    address: 'Mughalpura Post Office Street, Lahore',
    postalCode: '54840',
    appliedDate: '2026-07-26',
    status: 'Approved',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK,
    adminNotes: 'PNC Nursing Registration Certificate Verified.'
  },
  {
    id: 'app-1005',
    trackingId: 'JH-2026-66381',
    jobId: 'jh-suthra-punjab-1001',
    jobTitle: 'Zone Sanitation Officer',
    department: 'Chief Minister Suthra Punjab Program',
    category: 'Suthra Punjab / Cleaning Jobs',
    categorySlug: 'suthra-punjab',
    applicantName: 'Bilal Hassan Bhatti',
    fatherName: 'Hassan Akhtar Bhatti',
    cnic: '34101-5528391-7',
    email: 'bilal.bhatti@yahoo.com',
    mobileNumber: '0321-7712390',
    qualification: 'Bachelor (BS/BA)',
    address: 'Model Town Block Q, Gujranwala',
    postalCode: '52250',
    appliedDate: '2026-07-27',
    status: 'Rejected',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK,
    rejectionReason: 'Age limit exceeded as per department recruitment rules.'
  },
  {
    id: 'app-1006',
    trackingId: 'JH-2026-30492',
    jobId: 'jh-army-1001',
    jobTitle: 'PMA Long Course Officer Cadet',
    department: 'Pakistan Army GHQ Rawalpindi',
    category: 'Army Jobs',
    categorySlug: 'army',
    applicantName: 'Usman Ghani',
    fatherName: 'Major (R) Ghani ur Rehman',
    cnic: '37405-2291823-3',
    email: 'usman.ghani@army.pk',
    mobileNumber: '0301-5129847',
    qualification: 'Intermediate / FSc',
    address: 'Lalkurti Cantonment, Rawalpindi',
    postalCode: '46000',
    appliedDate: '2026-07-30',
    status: 'Pending',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK,
    paymentProofPreview: SAMPLE_PAYMENT_PROOF
  },
  {
    id: 'app-1007',
    trackingId: 'JH-2026-88120',
    jobId: 'jh-banking-1001',
    jobTitle: 'Branch Manager',
    department: 'National Bank of Pakistan (NBP)',
    category: 'Banking Jobs',
    categorySlug: 'banking',
    applicantName: 'Sana Malik',
    fatherName: 'Tariq Malik',
    cnic: '42101-9982310-6',
    email: 'sana.malik@nbp.com.pk',
    mobileNumber: '0332-9182345',
    qualification: 'Master (MS/MA)',
    address: 'Clifton Block 5, Karachi',
    postalCode: '75600',
    appliedDate: '2026-07-31',
    status: 'Under Review',
    cnicFrontPreview: SAMPLE_CNIC_FRONT,
    cnicBackPreview: SAMPLE_CNIC_BACK
  }
];

// Helper to notify all subscribers across components of data updates
function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jobshub_data_updated'));
  }
}

// --- JOBS DATA STORE ---
export function getStoredJobs(): Job[] {
  if (typeof window === 'undefined') return MOCK_JOBS;
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading jobs from localStorage:', err);
  }
  // Initialize with MOCK_JOBS if missing
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(MOCK_JOBS));
  return MOCK_JOBS;
}

export function saveJobs(jobs: Job[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    notifyDataChanged();
  } catch (err) {
    console.error('Error saving jobs to localStorage:', err);
  }
}

export function addJob(jobData: Omit<Job, 'id'>): Job {
  const jobs = getStoredJobs();
  const id = `jh-${jobData.categorySlug || 'custom'}-${Date.now()}`;
  const newJob: Job = { ...jobData, id };
  const updated = [newJob, ...jobs];
  saveJobs(updated);
  return newJob;
}

export function updateJob(updatedJob: Job): void {
  const jobs = getStoredJobs();
  const index = jobs.findIndex((j) => j.id === updatedJob.id);
  if (index !== -1) {
    jobs[index] = updatedJob;
    saveJobs(jobs);
  }
}

export function deleteJob(jobId: string): void {
  const jobs = getStoredJobs();
  const updated = jobs.filter((j) => j.id !== jobId);
  saveJobs(updated);
}

// --- APPLICATIONS DATA STORE ---
export function getStoredApplications(): ApplicationRecord[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading applications from localStorage:', err);
  }
  // Initialize with INITIAL_APPLICATIONS if missing
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
}

export function saveApplications(apps: ApplicationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
    notifyDataChanged();
  } catch (err) {
    console.error('Error saving applications to localStorage:', err);
  }
}

export function addApplication(appData: Omit<ApplicationRecord, 'id' | 'status'> & { status?: ApplicationStatus }): ApplicationRecord {
  const apps = getStoredApplications();
  const newApp: ApplicationRecord = {
    ...appData,
    id: `app-${Date.now()}`,
    status: appData.status || 'Pending',
  };
  const updated = [newApp, ...apps];
  saveApplications(updated);
  return newApp;
}

export function updateApplicationStatus(
  id: string, 
  status: ApplicationStatus, 
  rejectionReason?: string, 
  adminNotes?: string
): void {
  const apps = getStoredApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index !== -1) {
    apps[index] = {
      ...apps[index],
      status,
      ...(rejectionReason !== undefined ? { rejectionReason } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    };
    saveApplications(apps);
  }
}

export function deleteApplication(id: string): void {
  const apps = getStoredApplications();
  const updated = apps.filter((a) => a.id !== id);
  saveApplications(updated);
}

// --- ADMIN SESSION & CREDENTIALS STORE ---
const ADMIN_CREDS_STORAGE_KEY = 'jobshub_admin_creds_v3';
const DEFAULT_ADMIN_USERNAME = 'umar';
const DEFAULT_ADMIN_PASSWORD = 'Sho2026@';

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

export async function getAdminCredentials(): Promise<AdminCredentials> {
  const defaultHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
  const defaultCreds: AdminCredentials = {
    username: DEFAULT_ADMIN_USERNAME,
    passwordHash: defaultHash,
  };

  if (typeof window === 'undefined') return defaultCreds;

  try {
    const raw = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.username === 'string' && typeof parsed.passwordHash === 'string') {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading admin credentials from localStorage:', err);
  }

  try {
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(defaultCreds));
  } catch (e) {
    console.error('Error initializing admin credentials:', e);
  }
  return defaultCreds;
}

export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
  const currentCreds = await getAdminCredentials();
  const inputHash = await hashPassword(pass);
  const userMatches = user.trim().toLowerCase() === currentCreds.username.trim().toLowerCase();
  const passwordMatches = inputHash === currentCreds.passwordHash;
  return userMatches && passwordMatches;
}

export async function updateAdminCredentials(
  currentPasswordVerification: string,
  newUsername: string,
  newPasswordToSet: string
): Promise<{ success: boolean; message: string }> {
  const currentCreds = await getAdminCredentials();
  const currentInputHash = await hashPassword(currentPasswordVerification);

  if (currentInputHash !== currentCreds.passwordHash) {
    return {
      success: false,
      message: 'Current password verification failed. Please enter your correct current password.',
    };
  }

  if (!newUsername || !newUsername.trim()) {
    return {
      success: false,
      message: 'New admin username cannot be empty.',
    };
  }

  let newHash = currentCreds.passwordHash;
  if (newPasswordToSet && newPasswordToSet.trim()) {
    newHash = await hashPassword(newPasswordToSet.trim());
  }

  const updatedCreds: AdminCredentials = {
    username: newUsername.trim(),
    passwordHash: newHash,
  };

  try {
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(updatedCreds));
    notifyDataChanged();
    return {
      success: true,
      message: 'Admin account credentials updated successfully! Old credentials will no longer work.',
    };
  } catch (err) {
    console.error('Error saving updated admin credentials:', err);
    return {
      success: false,
      message: 'Failed to save updated credentials to persistent storage.',
    };
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function setAdminLoggedIn(status: boolean): void {
  if (typeof window === 'undefined') return;
  if (status) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
  notifyDataChanged();
}

// --- ADMIN SETTINGS STORE ---
export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        websiteName: parsed.websiteName || DEFAULT_SITE_SETTINGS.websiteName,
        whatsappNumber: parsed.whatsappNumber || DEFAULT_SITE_SETTINGS.whatsappNumber,
        jazzCashAccountName: parsed.jazzCashAccountName || DEFAULT_SITE_SETTINGS.jazzCashAccountName,
        jazzCashAccountNumber: parsed.jazzCashAccountNumber || DEFAULT_SITE_SETTINGS.jazzCashAccountNumber,
        easyPaisaAccountName: parsed.easyPaisaAccountName || DEFAULT_SITE_SETTINGS.easyPaisaAccountName,
        easyPaisaAccountNumber: parsed.easyPaisaAccountNumber || DEFAULT_SITE_SETTINGS.easyPaisaAccountNumber,
        applicationFee: typeof parsed.applicationFee === 'number' && !isNaN(parsed.applicationFee)
          ? parsed.applicationFee
          : Number(parsed.applicationFee) || DEFAULT_SITE_SETTINGS.applicationFee,
      };
    }
  } catch (err) {
    console.error('Error loading settings from localStorage:', err);
  }
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  return DEFAULT_SITE_SETTINGS;
}

export function saveSettings(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notifyDataChanged();
  } catch (err) {
    console.error('Error saving settings to localStorage:', err);
  }
}

export function formatWhatsAppUrl(whatsappNumber: string, customMessage?: string): string {
  const digits = (whatsappNumber || '').replace(/\D/g, '');
  let formatted = digits;
  if (formatted.startsWith('0')) {
    formatted = '92' + formatted.slice(1);
  } else if (!formatted.startsWith('92') && formatted.length === 10) {
    formatted = '92' + formatted;
  }
  const text = customMessage ? encodeURIComponent(customMessage) : '';
  return `https://wa.me/${formatted}${text ? `?text=${text}` : ''}`;
}

export function formatPhoneDisplay(whatsappNumber: string): string {
  const digits = (whatsappNumber || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return whatsappNumber || '03477957267';
}

