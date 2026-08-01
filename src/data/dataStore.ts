import { Job, ApplicationRecord, ApplicationStatus, SiteSettings } from '../types';
import { MOCK_JOBS } from './mockJobs';
import { supabase, isSupabaseConfigured, uploadImageToSupabaseStorage } from '../lib/supabase';

const JOBS_STORAGE_KEY = 'jobshub_jobs_v2';
const APPS_STORAGE_KEY = 'jobshub_applications_v2';
const ADMIN_SESSION_KEY = 'jobshub_admin_session_v1';
const SETTINGS_STORAGE_KEY = 'jobshub_site_settings_v1';
const ADMIN_CREDS_STORAGE_KEY = 'jobshub_admin_creds_v3';

const DEFAULT_ADMIN_USERNAME = 'umar';
const DEFAULT_ADMIN_PASSWORD = 'Sho2026@';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  websiteName: 'JobsHub Official',
  whatsappNumber: '03477957267',
  jazzCashAccountName: 'JobsHub Official Portal',
  jazzCashAccountNumber: '0300-1234567',
  easyPaisaAccountName: 'JobsHub Official Portal',
  easyPaisaAccountNumber: '0312-9876543',
  applicationFee: 499,
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
  }
];

// Helper to notify all subscribers across components of data updates
export function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jobshub_data_updated'));
  }
}

// --- SUPABASE DATA MAPPER HELPERS ---

function mapDbJobToJob(row: any): Job {
  return {
    id: String(row.id),
    title: row.title || '',
    department: row.department || row.company_name || '',
    companyLogo: row.company_logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    sector: row.sector || 'Government',
    jobType: row.job_type || 'Full Time',
    location: row.location || 'Pakistan',
    city: row.city || 'Islamabad',
    salaryRange: row.salary_range || row.salary || 'Rs. 75,000 - 120,000',
    minSalary: Number(row.min_salary) || 75000,
    experience: row.experience || '1 - 3 Years',
    qualification: row.qualification || 'Bachelor (BS/BA)',
    vacancies: Number(row.vacancies || row.available_seats) || 10,
    availableSeats: Number(row.available_seats || row.vacancies) || 10,
    postedDate: row.posted_date || new Date().toISOString().split('T')[0],
    deadline: row.deadline || row.application_deadline || '',
    isFeatured: Boolean(row.is_featured),
    isUrgent: Boolean(row.is_urgent),
    isVerified: row.is_verified !== undefined ? Boolean(row.is_verified) : true,
    category: row.category || 'General',
    categorySlug: row.category_slug || 'general',
    description: row.description || '',
    responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    howToApply: row.how_to_apply || 'Apply online through JobsHub Official Portal.',
    contactEmail: row.contact_email || 'info@jobshub.pk',
    contactPhone: row.contact_phone || '+92-51-111-562-748',
    address: row.address || 'JobsHub Recruitment HQ, Blue Area, Islamabad',
  };
}

function mapJobToDbRow(job: Partial<Job>): any {
  return {
    title: job.title,
    department: job.department,
    company_name: job.department || 'JobsHub Official',
    company_logo: job.companyLogo,
    sector: job.sector,
    job_type: job.jobType,
    location: job.location,
    city: job.city,
    salary: job.salaryRange,
    salary_range: job.salaryRange,
    min_salary: job.minSalary,
    experience: job.experience,
    qualification: job.qualification,
    vacancies: job.vacancies || job.availableSeats || 10,
    available_seats: job.availableSeats || job.vacancies || 10,
    posted_date: job.postedDate,
    deadline: job.deadline,
    application_deadline: job.deadline,
    is_featured: job.isFeatured || false,
    is_urgent: job.isUrgent || false,
    is_verified: job.isVerified !== undefined ? job.isVerified : true,
    category: job.category,
    category_slug: job.categorySlug,
    description: job.description,
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    how_to_apply: job.howToApply || '',
    contact_email: job.contactEmail || '',
    contact_phone: job.contactPhone || '',
    address: job.address || '',
  };
}

function mapDbAppToApp(row: any): ApplicationRecord {
  return {
    id: String(row.id),
    trackingId: row.tracking_id || row.application_id || String(row.id),
    jobId: String(row.job_id || ''),
    jobTitle: row.job_title || '',
    department: row.department || '',
    category: row.category || '',
    categorySlug: row.category_slug || '',
    applicantName: row.applicant_name || row.full_name || '',
    fatherName: row.father_name || '',
    cnic: row.cnic || '',
    email: row.email || '',
    mobileNumber: row.mobile_number || row.mobile || '',
    qualification: row.qualification || 'Bachelor (BS/BA)',
    address: row.address || '',
    postalCode: row.postal_code || '',
    appliedDate: row.applied_date || new Date().toISOString().split('T')[0],
    status: row.status || row.application_status || 'Pending',
    cnicFrontPreview: row.cnic_front_preview || row.cnic_front_url || undefined,
    cnicBackPreview: row.cnic_back_preview || row.cnic_back_url || undefined,
    paymentProofPreview: row.payment_proof_preview || row.payment_screenshot_url || undefined,
    resumeFileName: row.resume_file_name || undefined,
    coverNote: row.cover_note || undefined,
    rejectionReason: row.rejection_reason || undefined,
    adminNotes: row.admin_notes || undefined,
  };
}

function mapAppToDbRow(app: Partial<ApplicationRecord>): any {
  return {
    tracking_id: app.trackingId,
    application_id: app.trackingId,
    job_id: app.jobId,
    job_title: app.jobTitle,
    department: app.department,
    category: app.category,
    category_slug: app.categorySlug,
    applicant_name: app.applicantName,
    full_name: app.applicantName,
    father_name: app.fatherName,
    cnic: app.cnic,
    email: app.email,
    mobile_number: app.mobileNumber,
    mobile: app.mobileNumber,
    qualification: app.qualification,
    address: app.address,
    postal_code: app.postalCode,
    applied_date: app.appliedDate,
    status: app.status || 'Pending',
    application_status: app.status || 'Pending',
    cnic_front_preview: app.cnicFrontPreview || null,
    cnic_front_url: app.cnicFrontPreview || null,
    cnic_back_preview: app.cnicBackPreview || null,
    cnic_back_url: app.cnicBackPreview || null,
    payment_proof_preview: app.paymentProofPreview || null,
    payment_screenshot_url: app.paymentProofPreview || null,
    resume_file_name: app.resumeFileName || null,
    cover_note: app.coverNote || null,
    rejection_reason: app.rejectionReason || null,
    admin_notes: app.adminNotes || null,
  };
}

// --- JOBS STORE ---

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
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(MOCK_JOBS));
  return MOCK_JOBS;
}

export function saveJobsLocally(jobs: Job[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    notifyDataChanged();
  } catch (err) {
    console.error('Error saving jobs to localStorage:', err);
  }
}

// Track if Supabase schema tables need creation
export let isSupabaseSchemaMissing = false;

export async function fetchJobsFromSupabase(): Promise<Job[]> {
  if (!isSupabaseConfigured() || !supabase) return getStoredJobs();

  try {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    
    if (error) {
      if (error.message.includes('Could not find the table') || error.message.includes('schema cache')) {
        isSupabaseSchemaMissing = true;
        console.warn('JobsHub Supabase Notice: Database tables not found. Please run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.error('Error fetching jobs from Supabase:', error.message);
      }
      return getStoredJobs();
    }

    isSupabaseSchemaMissing = false;
    if (!data || data.length === 0) {
      // Seed default jobs into Supabase
      console.log('Seeding initial jobs to Supabase database...');
      const rowsToInsert = MOCK_JOBS.map((j) => mapJobToDbRow(j));
      await supabase.from('jobs').insert(rowsToInsert);
      return MOCK_JOBS;
    }

    const loaded = data.map(mapDbJobToJob);
    saveJobsLocally(loaded);
    return loaded;
  } catch (err) {
    console.error('Exception fetching jobs from Supabase:', err);
    return getStoredJobs();
  }
}

export function saveJobs(jobs: Job[]): void {
  saveJobsLocally(jobs);
}

export async function addJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  const jobs = getStoredJobs();
  const tempId = `jh-${jobData.categorySlug || 'custom'}-${Date.now()}`;
  const newJob: Job = { ...jobData, id: tempId };
  
  // Save locally immediately
  const updated = [newJob, ...jobs];
  saveJobsLocally(updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = mapJobToDbRow(newJob);
      const { data, error } = await supabase.from('jobs').insert([dbRow]).select().single();
      if (!error && data) {
        const createdFromDb = mapDbJobToJob(data);
        const replaced = updated.map((j) => (j.id === tempId ? createdFromDb : j));
        saveJobsLocally(replaced);
        return createdFromDb;
      }
    } catch (err) {
      console.error('Error inserting job into Supabase:', err);
    }
  }

  return newJob;
}

export async function updateJob(updatedJob: Job): Promise<void> {
  const jobs = getStoredJobs();
  const index = jobs.findIndex((j) => j.id === updatedJob.id);
  if (index !== -1) {
    jobs[index] = updatedJob;
    saveJobsLocally(jobs);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = mapJobToDbRow(updatedJob);
      await supabase.from('jobs').update(dbRow).eq('id', updatedJob.id);
    } catch (err) {
      console.error('Error updating job in Supabase:', err);
    }
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  const jobs = getStoredJobs();
  const updated = jobs.filter((j) => j.id !== jobId);
  saveJobsLocally(updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('jobs').delete().eq('id', jobId);
    } catch (err) {
      console.error('Error deleting job from Supabase:', err);
    }
  }
}

// --- APPLICATIONS STORE ---

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
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
}

export function saveApplicationsLocally(apps: ApplicationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
    notifyDataChanged();
  } catch (err) {
    console.error('Error saving applications to localStorage:', err);
  }
}

export async function fetchApplicationsFromSupabase(): Promise<ApplicationRecord[]> {
  if (!isSupabaseConfigured() || !supabase) return getStoredApplications();

  try {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });

    if (error) {
      if (error.message.includes('Could not find the table') || error.message.includes('schema cache')) {
        isSupabaseSchemaMissing = true;
      } else {
        console.error('Error fetching applications from Supabase:', error.message);
      }
      return getStoredApplications();
    }

    if (!data || data.length === 0) {
      // Seed default applications into Supabase
      console.log('Seeding initial applications to Supabase database...');
      const rowsToInsert = INITIAL_APPLICATIONS.map((a) => mapAppToDbRow(a));
      await supabase.from('applications').insert(rowsToInsert);
      return INITIAL_APPLICATIONS;
    }

    const loaded = data.map(mapDbAppToApp);
    saveApplicationsLocally(loaded);
    return loaded;
  } catch (err) {
    console.error('Exception fetching applications from Supabase:', err);
    return getStoredApplications();
  }
}

export function saveApplications(apps: ApplicationRecord[]): void {
  saveApplicationsLocally(apps);
}

export async function addApplication(
  appData: Omit<ApplicationRecord, 'id' | 'status'> & { status?: ApplicationStatus }
): Promise<ApplicationRecord> {
  const trackingId = appData.trackingId || `JH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const tempId = `app-${Date.now()}`;

  let cnicFrontUrl = appData.cnicFrontPreview;
  let cnicBackUrl = appData.cnicBackPreview;
  let paymentProofUrl = appData.paymentProofPreview;

  // If Supabase is configured, upload documents to Supabase Storage buckets
  if (isSupabaseConfigured() && supabase) {
    try {
      if (appData.cnicFrontPreview) {
        const uploaded = await uploadImageToSupabaseStorage(
          appData.cnicFrontPreview,
          'cnic-documents',
          `cnic_front_${trackingId}`
        );
        if (uploaded) cnicFrontUrl = uploaded;
      }

      if (appData.cnicBackPreview) {
        const uploaded = await uploadImageToSupabaseStorage(
          appData.cnicBackPreview,
          'cnic-documents',
          `cnic_back_${trackingId}`
        );
        if (uploaded) cnicBackUrl = uploaded;
      }

      if (appData.paymentProofPreview) {
        const uploaded = await uploadImageToSupabaseStorage(
          appData.paymentProofPreview,
          'payment-proofs',
          `payment_${trackingId}`
        );
        if (uploaded) paymentProofUrl = uploaded;
      }
    } catch (err) {
      console.error('Error uploading application documents to Supabase storage:', err);
    }
  }

  const newApp: ApplicationRecord = {
    ...appData,
    id: tempId,
    trackingId,
    status: appData.status || 'Pending',
    cnicFrontPreview: cnicFrontUrl,
    cnicBackPreview: cnicBackUrl,
    paymentProofPreview: paymentProofUrl,
  };

  const currentApps = getStoredApplications();
  const updated = [newApp, ...currentApps];
  saveApplicationsLocally(updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = mapAppToDbRow(newApp);
      const { data, error } = await supabase.from('applications').insert([dbRow]).select().single();

      if (!error && data) {
        const createdFromDb = mapDbAppToApp(data);
        const replaced = updated.map((a) => (a.id === tempId ? createdFromDb : a));
        saveApplicationsLocally(replaced);
        return createdFromDb;
      }
    } catch (err) {
      console.error('Error inserting application into Supabase database:', err);
    }
  }

  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  rejectionReason?: string,
  adminNotes?: string
): Promise<void> {
  const apps = getStoredApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index !== -1) {
    apps[index] = {
      ...apps[index],
      status,
      ...(rejectionReason !== undefined ? { rejectionReason } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    };
    saveApplicationsLocally(apps);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const payload: any = { status };
      if (rejectionReason !== undefined) payload.rejection_reason = rejectionReason;
      if (adminNotes !== undefined) payload.admin_notes = adminNotes;

      await supabase.from('applications').update(payload).eq('id', id);
    } catch (err) {
      console.error('Error updating application status in Supabase:', err);
    }
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const apps = getStoredApplications();
  const updated = apps.filter((a) => a.id !== id);
  saveApplicationsLocally(updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('applications').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting application from Supabase:', err);
    }
  }
}

// --- ADMIN SESSION & CREDENTIALS STORE ---

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

  // Try fetching from Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('admin_credentials').select('*').eq('id', 1).maybeSingle();
      if (!error && data) {
        const fetched = {
          username: data.username || DEFAULT_ADMIN_USERNAME,
          passwordHash: data.password_hash || defaultHash,
        };
        localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(fetched));
        return fetched;
      } else if (!data) {
        // Seed initial admin credentials in Supabase
        await supabase.from('admin_credentials').upsert({
          id: 1,
          username: DEFAULT_ADMIN_USERNAME,
          password_hash: defaultHash,
        });
      }
    } catch (err) {
      console.error('Error fetching admin credentials from Supabase:', err);
    }
  }

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

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('admin_credentials').upsert({
        id: 1,
        username: updatedCreds.username,
        password_hash: updatedCreds.passwordHash,
        updated_at: new Date().toISOString(),
      });
      await supabase.from('admin_users').upsert({
        username: updatedCreds.username,
        password_hash: updatedCreds.passwordHash,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'username' });
    }

    notifyDataChanged();
    return {
      success: true,
      message: 'Admin account credentials updated successfully! Changes persisted in database.',
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

export async function fetchSettingsFromSupabase(): Promise<SiteSettings> {
  if (!isSupabaseConfigured() || !supabase) return getStoredSettings();

  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (error) {
      if (error.message.includes('Could not find the table') || error.message.includes('schema cache')) {
        isSupabaseSchemaMissing = true;
      } else {
        console.error('Error fetching site_settings from Supabase:', error.message);
      }
      return getStoredSettings();
    }

    if (data) {
      const loaded: SiteSettings = {
        websiteName: data.website_name || DEFAULT_SITE_SETTINGS.websiteName,
        whatsappNumber: data.whatsapp_number || DEFAULT_SITE_SETTINGS.whatsappNumber,
        jazzCashAccountName: data.jazz_cash_account_name || data.jazzcash_name || DEFAULT_SITE_SETTINGS.jazzCashAccountName,
        jazzCashAccountNumber: data.jazz_cash_account_number || data.jazzcash_number || DEFAULT_SITE_SETTINGS.jazzCashAccountNumber,
        easyPaisaAccountName: data.easy_paisa_account_name || data.easypaisa_name || DEFAULT_SITE_SETTINGS.easyPaisaAccountName,
        easyPaisaAccountNumber: data.easy_paisa_account_number || data.easypaisa_number || DEFAULT_SITE_SETTINGS.easyPaisaAccountNumber,
        applicationFee: Number(data.application_fee) || DEFAULT_SITE_SETTINGS.applicationFee,
      };
      saveSettingsLocally(loaded);
      return loaded;
    } else {
      // Seed initial settings
      await supabase.from('site_settings').upsert({
        id: 1,
        website_name: DEFAULT_SITE_SETTINGS.websiteName,
        whatsapp_number: DEFAULT_SITE_SETTINGS.whatsappNumber,
        whatsapp_link: `https://wa.me/${(DEFAULT_SITE_SETTINGS.whatsappNumber || '').replace(/\D/g, '')}`,
        jazzcash_name: DEFAULT_SITE_SETTINGS.jazzCashAccountName,
        jazzcash_number: DEFAULT_SITE_SETTINGS.jazzCashAccountNumber,
        jazz_cash_account_name: DEFAULT_SITE_SETTINGS.jazzCashAccountName,
        jazz_cash_account_number: DEFAULT_SITE_SETTINGS.jazzCashAccountNumber,
        easypaisa_name: DEFAULT_SITE_SETTINGS.easyPaisaAccountName,
        easypaisa_number: DEFAULT_SITE_SETTINGS.easyPaisaAccountNumber,
        easy_paisa_account_name: DEFAULT_SITE_SETTINGS.easyPaisaAccountName,
        easy_paisa_account_number: DEFAULT_SITE_SETTINGS.easyPaisaAccountNumber,
        application_fee: DEFAULT_SITE_SETTINGS.applicationFee,
        contact_email: 'info@jobshub.pk',
        website_address: 'JobsHub HQ, Blue Area, Islamabad',
      });
      return DEFAULT_SITE_SETTINGS;
    }
  } catch (err) {
    console.error('Exception fetching settings from Supabase:', err);
    return getStoredSettings();
  }
}

export function saveSettingsLocally(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notifyDataChanged();
  } catch (err) {
    console.error('Error saving settings to localStorage:', err);
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  saveSettingsLocally(settings);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('site_settings').upsert({
        id: 1,
        website_name: settings.websiteName,
        whatsapp_number: settings.whatsappNumber,
        whatsapp_link: `https://wa.me/${(settings.whatsappNumber || '').replace(/\D/g, '')}`,
        jazzcash_name: settings.jazzCashAccountName,
        jazzcash_number: settings.jazzCashAccountNumber,
        jazz_cash_account_name: settings.jazzCashAccountName,
        jazz_cash_account_number: settings.jazzCashAccountNumber,
        easypaisa_name: settings.easyPaisaAccountName,
        easypaisa_number: settings.easyPaisaAccountNumber,
        easy_paisa_account_name: settings.easyPaisaAccountName,
        easy_paisa_account_number: settings.easyPaisaAccountNumber,
        application_fee: settings.applicationFee,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving site_settings to Supabase:', err);
    }
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

// Automatically sync store with Supabase on module import
export async function syncStoreWithSupabase(): Promise<void> {
  if (isSupabaseConfigured()) {
    await Promise.all([
      fetchJobsFromSupabase(),
      fetchApplicationsFromSupabase(),
      fetchSettingsFromSupabase(),
      getAdminCredentials(),
    ]);
  }
}

if (typeof window !== 'undefined') {
  syncStoreWithSupabase();
}
