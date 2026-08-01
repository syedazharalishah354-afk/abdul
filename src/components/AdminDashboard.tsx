import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  FileText, 
  Building2, 
  Landmark, 
  Calendar, 
  MapPin, 
  Check, 
  X,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  BarChart3,
  Layers,
  Sparkles,
  Settings,
  Save,
  RotateCcw,
  Wallet,
  DollarSign,
  Phone,
  Globe,
  CreditCard,
  AlertCircle,
  User,
  Lock,
  Key
} from 'lucide-react';
import { Job, ApplicationRecord, ApplicationStatus, SiteSettings } from '../types';
import { 
  getStoredJobs, 
  saveJobs, 
  addJob, 
  updateJob, 
  deleteJob, 
  getStoredApplications, 
  updateApplicationStatus, 
  deleteApplication, 
  setAdminLoggedIn,
  getStoredSettings,
  saveSettings,
  getAdminCredentials,
  updateAdminCredentials,
  DEFAULT_SITE_SETTINGS,
  formatWhatsAppUrl,
  formatPhoneDisplay
} from '../data/dataStore';
import { AddEditJobModal } from './AddEditJobModal';
import { AdminApplicationDetailModal } from './AdminApplicationDetailModal';
import { ImageLightboxModal } from './ImageLightboxModal';
import { POPULAR_CATEGORIES } from '../data/mockJobs';

interface AdminDashboardProps {
  onBackToPublicSite: () => void;
  onSelectJobForPublicView?: (job: Job) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToPublicSite,
  onSelectJobForPublicView,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'settings'>('overview');
  
  // Data state synced from store
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  // Admin Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(() => getStoredSettings());
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');
  const [settingsErrorMsg, setSettingsErrorMsg] = useState('');

  // Admin Account & Security Settings State
  const [securityUsername, setSecurityUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState('');
  const [securityErrorMsg, setSecurityErrorMsg] = useState('');

  // Search & Filters state
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('all');
  const [jobSectorFilter, setJobSectorFilter] = useState('all');

  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddEditJobModalOpen, setIsAddEditJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);

  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Lightbox modal state
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  const loadDataFromStore = async () => {
    setJobs(getStoredJobs());
    setApplications(getStoredApplications());
    setSettingsForm(getStoredSettings());
    try {
      const creds = await getAdminCredentials();
      setSecurityUsername(creds.username);
    } catch (err) {
      console.error('Error fetching admin credentials:', err);
    }
  };

  const handleSaveAdminSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErrorMsg('');
    setSecuritySuccessMsg('');

    if (!currentPassword) {
      setSecurityErrorMsg('Current Password is required to verify identity.');
      return;
    }

    if (!securityUsername.trim()) {
      setSecurityErrorMsg('Admin Username cannot be empty.');
      return;
    }

    if (newPassword || confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        setSecurityErrorMsg('New Password and Confirm New Password do not match.');
        return;
      }
      if (newPassword.length < 6) {
        setSecurityErrorMsg('New password must be at least 6 characters long.');
        return;
      }
    }

    setIsSavingSecurity(true);

    try {
      const result = await updateAdminCredentials(
        currentPassword,
        securityUsername.trim(),
        newPassword ? newPassword : currentPassword
      );

      setIsSavingSecurity(false);

      if (result.success) {
        setSecuritySuccessMsg(result.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        const creds = await getAdminCredentials();
        setSecurityUsername(creds.username);
        setTimeout(() => setSecuritySuccessMsg(''), 5000);
      } else {
        setSecurityErrorMsg(result.message);
      }
    } catch (err) {
      setIsSavingSecurity(false);
      setSecurityErrorMsg('An error occurred while updating security settings.');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsErrorMsg('');
    setSettingsSuccessMsg('');

    if (!settingsForm.websiteName.trim()) {
      setSettingsErrorMsg('Website Name cannot be empty.');
      return;
    }
    if (!settingsForm.whatsappNumber.trim()) {
      setSettingsErrorMsg('WhatsApp Number is required.');
      return;
    }
    if (!settingsForm.jazzCashAccountName.trim() || !settingsForm.jazzCashAccountNumber.trim()) {
      setSettingsErrorMsg('JazzCash Account Name and Number are required.');
      return;
    }
    if (!settingsForm.easyPaisaAccountName.trim() || !settingsForm.easyPaisaAccountNumber.trim()) {
      setSettingsErrorMsg('Easypaisa Account Name and Number are required.');
      return;
    }
    if (isNaN(Number(settingsForm.applicationFee)) || Number(settingsForm.applicationFee) < 0) {
      setSettingsErrorMsg('Application Fee must be a valid non-negative number.');
      return;
    }

    setIsSavingSettings(true);

    setTimeout(() => {
      saveSettings({
        ...settingsForm,
        applicationFee: Number(settingsForm.applicationFee),
      });
      setIsSavingSettings(false);
      setSettingsSuccessMsg('Admin Settings updated and saved successfully! Public site will automatically use these settings.');
      setTimeout(() => setSettingsSuccessMsg(''), 4000);
    }, 400);
  };

  const handleResetDefaultSettings = () => {
    if (window.confirm('Are you sure you want to reset all site settings to default values?')) {
      setSettingsForm(DEFAULT_SITE_SETTINGS);
      saveSettings(DEFAULT_SITE_SETTINGS);
      setSettingsSuccessMsg('Site settings reset to default values.');
      setTimeout(() => setSettingsSuccessMsg(''), 3000);
    }
  };

  useEffect(() => {
    loadDataFromStore();

    const handleDataUpdate = () => {
      loadDataFromStore();
    };

    window.addEventListener('jobshub_data_updated', handleDataUpdate);
    return () => window.removeEventListener('jobshub_data_updated', handleDataUpdate);
  }, []);

  const handleLogout = () => {
    setAdminLoggedIn(false);
    onBackToPublicSite();
  };

  // --- JOB ACTIONS ---
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setIsAddEditJobModalOpen(true);
  };

  const handleOpenEditJob = (job: Job) => {
    setEditingJob(job);
    setIsAddEditJobModalOpen(true);
  };

  const handleSaveJob = (jobData: any) => {
    if (jobData.id) {
      updateJob(jobData as Job);
    } else {
      addJob(jobData);
    }
    setIsAddEditJobModalOpen(false);
    setEditingJob(null);
    loadDataFromStore();
  };

  const handleDeleteJobConfirm = (job: Job) => {
    setJobToDelete(job);
  };

  const executeDeleteJob = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      setJobToDelete(null);
      loadDataFromStore();
    }
  };

  // --- APPLICATION ACTIONS ---
  const handleOpenAppDetail = (app: ApplicationRecord) => {
    setSelectedApplication(app);
    setIsAppDetailModalOpen(true);
  };

  const handleUpdateAppStatus = (
    id: string, 
    newStatus: ApplicationStatus, 
    rejectionReason?: string, 
    adminNotes?: string
  ) => {
    updateApplicationStatus(id, newStatus, rejectionReason, adminNotes);
    setIsAppDetailModalOpen(false);
    setSelectedApplication(null);
    loadDataFromStore();
  };

  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightboxState({
      isOpen: true,
      imageUrl,
      title,
    });
  };

  // --- STATS CALCULATIONS ---
  const totalJobsCount = jobs.length;
  const totalAppsCount = applications.length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;
  const approvedAppsCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedAppsCount = applications.filter((a) => a.status === 'Rejected').length;
  const reviewAppsCount = applications.filter((a) => a.status === 'Under Review').length;

  // --- FILTERED LISTS ---
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = 
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.department.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.city.toLowerCase().includes(jobSearch.toLowerCase());

    const matchesCategory = jobCategoryFilter === 'all' || j.categorySlug === jobCategoryFilter;
    const matchesSector = jobSectorFilter === 'all' || j.sector === jobSectorFilter;

    return matchesSearch && matchesCategory && matchesSector;
  });

  const filteredApplications = applications.filter((a) => {
    const matchesSearch = 
      a.applicantName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.cnic.includes(appSearch) ||
      a.trackingId.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.department.toLowerCase().includes(appSearch.toLowerCase());

    const matchesStatus = appStatusFilter === 'all' || a.status === appStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex flex-col">
      
      {/* Admin Top Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md font-black text-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white tracking-tight">JobsHub</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Government & Corporate Vacancy Management System
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Quick Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onBackToPublicSite}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Back to</span> Public Website
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Sub-Bar */}
        <div className="bg-slate-900 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Statistics</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Manage Jobs ({totalJobsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap relative ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Manage Applications ({totalAppsCount})</span>
              {pendingAppsCount > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Settings</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW & STATS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-blue-900/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-md border border-blue-400/20">
                  Live System Overview
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome, Portal Administrator
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Manage active vacancy listings across Pakistan, inspect online candidate application slips, review CNIC & payment documents, and update recruitment status in real time.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={handleOpenAddJob}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Job Vacancy</span>
                </button>
              </div>
            </div>

            {/* 5 Core Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Total Jobs */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Total Jobs</span>
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">{totalJobsCount.toLocaleString()}</div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Active Listings in Database</p>
                </div>
              </div>

              {/* Total Applications */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Total Applications</span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">{totalAppsCount.toLocaleString()}</div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Candidate Slips Submitted</p>
                </div>
              </div>

              {/* Pending Applications */}
              <div className="bg-slate-800/80 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm bg-amber-500/5">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Pending Review</span>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-black text-amber-400">{pendingAppsCount.toLocaleString()}</div>
                  <p className="text-[11px] text-amber-300/80 font-medium mt-1">Awaiting Admin Verification</p>
                </div>
              </div>

              {/* Approved Applications */}
              <div className="bg-slate-800/80 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm bg-emerald-500/5">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Approved</span>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-400">{approvedAppsCount.toLocaleString()}</div>
                  <p className="text-[11px] text-emerald-300/80 font-medium mt-1">Verified & Shortlisted</p>
                </div>
              </div>

              {/* Rejected Applications */}
              <div className="bg-slate-800/80 border border-red-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm bg-red-500/5">
                <div className="flex items-center justify-between text-red-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Rejected</span>
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-black text-red-400">{rejectedAppsCount.toLocaleString()}</div>
                  <p className="text-[11px] text-red-300/80 font-medium mt-1">Ineligible / Rejected Slips</p>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Applications Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Applications Preview */}
              <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Recent Candidate Submissions</h3>
                    <p className="text-xs text-slate-400">Latest online application slips requiring review</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center cursor-pointer"
                  >
                    <span>View All ({applications.length})</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-extrabold text-[10px]">
                      <tr>
                        <th className="p-3">Tracking ID</th>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Applied Job</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 font-medium">
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-blue-400">{app.trackingId}</td>
                          <td className="p-3 font-bold text-white">{app.applicantName}</td>
                          <td className="p-3 text-slate-300 max-w-[180px] truncate">{app.jobTitle}</td>
                          <td className="p-3 text-slate-400">{app.appliedDate}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              app.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              app.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleOpenAppDetail(app)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Breakdown & Quick Management Shortcuts */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Jobs Category Summary</h3>
                  <p className="text-xs text-slate-400">Distribution of active jobs by category</p>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {POPULAR_CATEGORIES.map((cat) => {
                    const catJobsCount = jobs.filter((j) => j.categorySlug === cat.slug).length;
                    return (
                      <div key={cat.slug} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-700/50 rounded-2xl text-xs">
                        <span className="font-bold text-slate-200">{cat.name}</span>
                        <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                          {catJobsCount} Jobs
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANAGE JOBS */}
        {/* ========================================================================= */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Controls & Filter Bar */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Job Vacancies Management ({filteredJobs.length})</h2>
                  <p className="text-xs text-slate-400">Add, edit, view, or delete active job listings across Pakistan</p>
                </div>

                <button
                  onClick={handleOpenAddJob}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Job</span>
                </button>
              </div>

              {/* Search & Select Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-700/60">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search by job title, department, city..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <select
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {POPULAR_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={jobSectorFilter}
                    onChange={(e) => setJobSectorFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Sectors</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Semi-Government">Semi-Government</option>
                    <option value="Multinational">Multinational</option>
                    <option value="NGO">NGO</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="p-4">Job Title & ID</th>
                      <th className="p-4">Department / Company</th>
                      <th className="p-4">Category & Sector</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Vacancies</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-medium">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No jobs found matching your search query or category filters.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="p-4 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 block">{j.id}</span>
                            <span className="font-extrabold text-white text-sm block">{j.title}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-200">{j.department}</td>
                          <td className="p-4 space-y-1">
                            <span className="text-xs text-slate-300 font-bold block">{j.category}</span>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {j.sector}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300">{j.city}</td>
                          <td className="p-4 font-bold text-emerald-400">{j.vacancies} Seats</td>
                          <td className="p-4 text-slate-400">{j.deadline}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleOpenEditJob(j)}
                                className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Edit Job"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJobConfirm(j)}
                                className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MANAGE APPLICATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Controls & Filter Bar */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Candidate Online Applications ({filteredApplications.length})</h2>
                  <p className="text-xs text-slate-400">Review submitted slips, inspect CNIC and fee payment proofs, approve or reject applications</p>
                </div>
              </div>

              {/* Status Pills & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-700/60">
                <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto py-1">
                  {[
                    { key: 'all', label: `All (${applications.length})` },
                    { key: 'Pending', label: `Pending (${pendingAppsCount})` },
                    { key: 'Under Review', label: `Under Review (${reviewAppsCount})` },
                    { key: 'Approved', label: `Approved (${approvedAppsCount})` },
                    { key: 'Rejected', label: `Rejected (${rejectedAppsCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setAppStatusFilter(tab.key)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                        appStatusFilter === tab.key
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search name, CNIC, tracking ID..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="p-4">Tracking ID & Date</th>
                      <th className="p-4">Applicant Name</th>
                      <th className="p-4">CNIC & Contact</th>
                      <th className="p-4">Job Applied</th>
                      <th className="p-4">Qualification</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-medium">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No candidate applications found for current status or search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="p-4 space-y-1">
                            <span className="font-mono font-extrabold text-blue-400 text-xs block">{app.trackingId}</span>
                            <span className="text-[11px] text-slate-400 block">{app.appliedDate}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-white text-sm block">{app.applicantName}</span>
                            <span className="text-[11px] text-slate-400 block">S/O {app.fatherName || 'N/A'}</span>
                          </td>
                          <td className="p-4 space-y-1">
                            <span className="font-mono font-semibold text-slate-200 block">{app.cnic}</span>
                            <span className="text-[11px] text-slate-400 block">{app.mobileNumber}</span>
                          </td>
                          <td className="p-4 max-w-[200px] truncate">
                            <span className="font-bold text-slate-100 block">{app.jobTitle}</span>
                            <span className="text-[11px] text-slate-400 block truncate">{app.department}</span>
                          </td>
                          <td className="p-4 font-semibold text-emerald-400">{app.qualification}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase inline-block ${
                              app.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              app.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              app.status === 'Under Review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleOpenAppDetail(app)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Slip & CNIC</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ADMIN SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Settings Header */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      JobsHub Admin System Settings
                      <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase">
                        Live Persistent Store
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Manage website identity, support helpline, mobile wallet account details (JazzCash & Easypaisa), and candidate processing fee.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetDefaultSettings}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Success / Error Messages */}
            {settingsSuccessMsg && (
              <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-200 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{settingsSuccessMsg}</span>
              </div>
            )}

            {settingsErrorMsg && (
              <div className="bg-red-950/80 border border-red-500/40 p-4 rounded-2xl flex items-center space-x-3 text-xs text-red-200 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="font-semibold">{settingsErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* 3 Grid Column Layout for Settings Forms */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Section 1: General Site Configuration */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 pb-3 border-b border-slate-700/60">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      1. Website & Helpline Info
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Website Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                        <input
                          type="text"
                          value={settingsForm.websiteName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                          placeholder="e.g. jobshubofficial"
                          className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Website title displayed across browser header & footer.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        WhatsApp Support Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-2.5" />
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          placeholder="e.g. 03477957267"
                          className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Candidate WhatsApp support helpline number (e.g. 03477957267).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Mobile Wallet Accounts */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 pb-3 border-b border-slate-700/60">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      2. Mobile Wallet Accounts
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* JazzCash Grid */}
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-red-500/20 space-y-3">
                      <span className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider block">
                        JazzCash Official Account
                      </span>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Account Name (Title)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.jazzCashAccountName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, jazzCashAccountName: e.target.value })}
                          placeholder="e.g. Muhammad Amir"
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.jazzCashAccountNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, jazzCashAccountNumber: e.target.value })}
                          placeholder="e.g. 03247459091"
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    {/* Easypaisa Grid */}
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-3">
                      <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                        Easypaisa Official Account
                      </span>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Account Name (Title)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.easyPaisaAccountName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, easyPaisaAccountName: e.target.value })}
                          placeholder="e.g. Muhammad Shajehan"
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.easyPaisaAccountNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, easyPaisaAccountNumber: e.target.value })}
                          placeholder="e.g. 03471713065"
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Fee & Live Preview Card */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 pb-3 border-b border-slate-700/60">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        3. Application Fee (PKR)
                      </h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Candidate Application Fee (Rs.) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="text-slate-400 font-bold text-xs absolute left-3.5 top-2.5">Rs.</span>
                        <input
                          type="number"
                          value={settingsForm.applicationFee}
                          onChange={(e) => setSettingsForm({ ...settingsForm, applicationFee: Number(e.target.value) })}
                          placeholder="e.g. 500"
                          className="w-full pl-12 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-extrabold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Official processing fee required from candidate before slip generation.
                      </p>
                    </div>

                    {/* Live Preview Card */}
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700/80 space-y-2">
                      <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block">
                        Live Public Preview
                      </span>
                      <div className="text-xs text-slate-300 space-y-1">
                        <div>Site Title: <strong className="text-white">{settingsForm.websiteName || 'jobshubofficial'}</strong></div>
                        <div>WhatsApp: <strong className="text-emerald-400">{formatPhoneDisplay(settingsForm.whatsappNumber)}</strong></div>
                        <div>JazzCash: <strong className="text-white">{settingsForm.jazzCashAccountNumber}</strong> ({settingsForm.jazzCashAccountName})</div>
                        <div>Easypaisa: <strong className="text-white">{settingsForm.easyPaisaAccountNumber}</strong> ({settingsForm.easyPaisaAccountName})</div>
                        <div>Application Fee: <strong className="text-amber-400">Rs. {settingsForm.applicationFee}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSavingSettings ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Settings...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Admin Settings</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

            </form>

            {/* ========================================================================= */}
            {/* ADMIN ACCOUNT & SECURITY SETTINGS */}
            {/* ========================================================================= */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Admin Account / Security Settings
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                        Hashed Credentials
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update administrator login username and password. Current password verification is required before changes take effect.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Secure Logout</span>
                </button>
              </div>

              {securitySuccessMsg && (
                <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-200 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{securitySuccessMsg}</span>
                </div>
              )}

              {securityErrorMsg && (
                <div className="bg-red-950/80 border border-red-500/40 p-4 rounded-2xl flex items-center space-x-3 text-xs text-red-200 shadow-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="font-semibold">{securityErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveAdminSecurity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Change Admin Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Admin Username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        required
                        value={securityUsername}
                        onChange={(e) => setSecurityUsername(e.target.value)}
                        placeholder="e.g. umar"
                        className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Current administrator username used for portal login.
                    </p>
                  </div>

                  {/* Current Password Verification */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Current Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-2.5" />
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Required to verify identity"
                        className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Must verify current password before changing username or password.
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      New Password (Optional)
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter new password if you wish to change it.
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Must match New Password field exactly.
                    </p>
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Passwords are securely hashed using SHA-256 and stored in persistent state.
                  </span>
                  <button
                    type="submit"
                    disabled={isSavingSecurity}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSavingSecurity ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Saving...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Save Account Security Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* Add / Edit Job Modal */}
      <AddEditJobModal
        isOpen={isAddEditJobModalOpen}
        jobToEdit={editingJob}
        onClose={() => setIsAddEditJobModalOpen(false)}
        onSave={handleSaveJob}
      />

      {/* Admin Application Detail Modal */}
      <AdminApplicationDetailModal
        isOpen={isAppDetailModalOpen}
        application={selectedApplication}
        onClose={() => setIsAppDetailModalOpen(false)}
        onUpdateStatus={handleUpdateAppStatus}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Image Lightbox Modal for CNIC and Payment Proof Zoom */}
      <ImageLightboxModal
        isOpen={lightboxState.isOpen}
        imageUrl={lightboxState.imageUrl}
        title={lightboxState.title}
        onClose={() => setLightboxState({ isOpen: false, imageUrl: '', title: '' })}
      />

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Confirm Job Deletion
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong className="text-white">{jobToDelete.title}</strong> ({jobToDelete.department})? This change will remove the job from the public portal immediately.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteJob}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Yes, Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        JobsHub Official Pakistan Government & Corporate Recruitment Admin Engine • Version 2.4.0
      </footer>

    </div>
  );
};
