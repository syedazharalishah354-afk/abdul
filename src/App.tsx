import React, { useState, useEffect } from 'react';
import { ViewMode, Job, FilterState, ApplicationReceipt } from './types';
import { POPULAR_CATEGORIES } from './data/mockJobs';
import { getStoredJobs, isAdminLoggedIn } from './data/dataStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { JobCategories } from './components/JobCategories';
import { FeaturedJobs } from './components/FeaturedJobs';
import { WhyChooseUs } from './components/WhyChooseUs';
import { JobListingPage } from './components/JobListingPage';
import { JobDetailPage } from './components/JobDetailPage';
import { JobApplicationModal } from './components/JobApplicationModal';
import { TrackApplicationModal } from './components/TrackApplicationModal';
import { ContactWhatsAppSection } from './components/ContactWhatsAppSection';
import { PostJobModal } from './components/PostJobModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Bookmark, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['jh-101', 'jh-105']);
  const [savedReceipts, setSavedReceipts] = useState<ApplicationReceipt[]>([]);
  
  const [activeFilters, setActiveFilters] = useState<Partial<FilterState>>({});
  
  // Modals state
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load jobs from shared persistent dataStore
  const refreshJobs = () => {
    setAllJobs(getStoredJobs());
  };

  useEffect(() => {
    refreshJobs();

    const handleDataUpdate = () => {
      refreshJobs();
    };

    window.addEventListener('jobshub_data_updated', handleDataUpdate);
    return () => window.removeEventListener('jobshub_data_updated', handleDataUpdate);
  }, []);

  // Synchronize hash URL with state for Category URLs & Direct links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      if (hash === 'admin' || hash === 'admin-login') {
        setCurrentView('admin');
      } else if (hash.startsWith('jobs/')) {
        const slug = hash.replace('jobs/', '');
        const cat = POPULAR_CATEGORIES.find((c) => c.slug === slug);
        setActiveFilters({ categorySlug: slug, category: cat ? cat.name : '' });
        setCurrentView('jobs');
      } else if (hash === 'jobs') {
        setActiveFilters({});
        setCurrentView('jobs');
      } else if (hash.startsWith('job/')) {
        const jobId = hash.replace('job/', '');
        const currentStored = getStoredJobs();
        const found = currentStored.find((j) => j.id === jobId);
        if (found) {
          setSelectedJob(found);
          setCurrentView('job-detail');
        }
      } else if (hash === 'saved') {
        setCurrentView('saved');
      } else if (hash === 'contact') {
        setCurrentView('contact');
      } else if (hash === 'home') {
        setCurrentView('home');
      }
    };

    // Initial check on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const updateHash = (newHash: string) => {
    if (window.location.hash !== `#${newHash}`) {
      window.location.hash = newHash;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('Job removed from saved bookmarks');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast('Job saved to your bookmarks!');
        return [...prev, jobId];
      }
    });
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('job-detail');
    updateHash(`job/${job.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyNow = (job: Job) => {
    setJobToApply(job);
    setIsApplicationModalOpen(true);
  };

  const handleHeroSearchSubmit = (searchFilters: Partial<FilterState>) => {
    setActiveFilters(searchFilters);
    setCurrentView('jobs');
    updateHash('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categorySlugOrName: string, categoryName?: string) => {
    // Check if categorySlugOrName is a slug or full name
    const foundBySlug = POPULAR_CATEGORIES.find((c) => c.slug === categorySlugOrName);
    const foundByName = POPULAR_CATEGORIES.find((c) => c.name.toLowerCase() === categorySlugOrName.toLowerCase());
    const cat = foundBySlug || foundByName;

    if (cat) {
      setActiveFilters({ categorySlug: cat.slug, category: cat.name });
      updateHash(`jobs/${cat.slug}`);
    } else if (categorySlugOrName) {
      setActiveFilters({ category: categorySlugOrName });
      updateHash('jobs');
    } else {
      setActiveFilters({});
      updateHash('jobs');
    }

    setCurrentView('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCity = (cityName: string) => {
    setActiveFilters({ city: cityName });
    setCurrentView('jobs');
    updateHash('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPopularTag = (tag: string) => {
    setActiveFilters({ searchQuery: tag });
    setCurrentView('jobs');
    updateHash('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionSuccess = (receipt: ApplicationReceipt) => {
    setSavedReceipts((prev) => [receipt, ...prev]);
    showToast(`Application Slip Generated! ID: ${receipt.trackingId}`);
  };

  const savedJobsList = allJobs.filter((j) => savedJobIds.includes(j.id));

  // If in admin mode, show Admin Dashboard or Admin Login
  if (currentView === 'admin') {
    if (isAdminLoggedIn()) {
      return (
        <AdminDashboard
          onBackToPublicSite={() => {
            setCurrentView('home');
            window.location.hash = 'home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectJobForPublicView={handleSelectJob}
        />
      );
    } else {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToSite={() => {
            setCurrentView('home');
            window.location.hash = 'home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'admin') updateHash('admin');
          else if (view === 'jobs') updateHash('jobs');
          else if (view === 'saved') updateHash('saved');
          else if (view === 'contact') updateHash('contact');
          else if (view === 'home') updateHash('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedJobIds.length}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div>
            <HeroSection
              onSearchSubmit={handleHeroSearchSubmit}
              onSelectTag={handleSelectPopularTag}
            />

            <JobCategories onSelectCategory={handleSelectCategory} />

            <FeaturedJobs
              jobs={allJobs}
              savedJobIds={savedJobIds}
              onToggleSave={handleToggleSave}
              onSelectJob={handleSelectJob}
              onApplyNow={handleApplyNow}
              onViewAllJobs={() => {
                setActiveFilters({});
                setCurrentView('jobs');
                updateHash('jobs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <WhyChooseUs />
          </div>
        )}

        {/* VIEW 2: ALL JOBS CATALOG */}
        {currentView === 'jobs' && (
          <JobListingPage
            jobs={allJobs}
            initialFilters={activeFilters}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onSelectJob={handleSelectJob}
            onApplyNow={handleApplyNow}
            onCategoryChange={(slug) => {
              if (slug) updateHash(`jobs/${slug}`);
              else updateHash('jobs');
            }}
          />
        )}

        {/* VIEW 3: JOB DETAILS PAGE */}
        {currentView === 'job-detail' && selectedJob && (
          <JobDetailPage
            job={selectedJob}
            isSaved={savedJobIds.includes(selectedJob.id)}
            onToggleSave={handleToggleSave}
            onApplyNow={handleApplyNow}
            onBack={() => {
              setCurrentView('jobs');
              if (selectedJob.categorySlug) updateHash(`jobs/${selectedJob.categorySlug}`);
              else updateHash('jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            similarJobs={allJobs.filter(
              (j) => j.id !== selectedJob.id && (j.categorySlug === selectedJob.categorySlug || j.sector === selectedJob.sector)
            )}
            onSelectSimilarJob={handleSelectJob}
          />
        )}

        {/* VIEW 4: SAVED JOBS */}
        {currentView === 'saved' && (
          <div className="bg-slate-50 min-h-[70vh] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    Bookmarked Vacancies
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    Your Saved Jobs ({savedJobsList.length})
                  </h1>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('jobs');
                    updateHash('jobs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Browse More Jobs
                </button>
              </div>

              {savedJobsList.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 my-6 shadow-xs">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">No Saved Jobs Yet</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Click the bookmark icon on any job card to save it here for quick application later.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentView('jobs');
                      updateHash('jobs');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl cursor-pointer"
                  >
                    Explore Active Vacancies
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobsList.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {job.sector} Sector
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                        <p className="text-xs text-slate-500">{job.department} ({job.city})</p>
                        <p className="text-xs font-bold text-emerald-700">{job.salaryRange.split('/')[0]}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleToggleSave(job.id)}
                          className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => handleApplyNow(job)}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 5: CONTACT & WHATSAPP */}
        {currentView === 'contact' && <ContactWhatsAppSection />}

      </main>

      {/* Global Application Modal with CNIC uploads */}
      <JobApplicationModal
        job={jobToApply}
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSubmissionSuccess={handleSubmissionSuccess}
      />

      {/* Track Application Slip Modal */}
      <TrackApplicationModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        savedReceipts={savedReceipts}
      />

      {/* Employer Post Job Request Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
      />

      {/* Professional Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'jobs') updateHash('jobs');
          else if (view === 'saved') updateHash('saved');
          else if (view === 'contact') updateHash('contact');
          else if (view === 'home') updateHash('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleSelectCategory}
        onSelectCity={handleSelectCity}
      />

    </div>
  );
}

