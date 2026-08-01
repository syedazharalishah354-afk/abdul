import React, { useState } from 'react';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Job } from '../types';
import { JobCard } from './JobCard';

interface FeaturedJobsProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onApplyNow: (job: Job) => void;
  onViewAllJobs: () => void;
}

export const FeaturedJobs: React.FC<FeaturedJobsProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onSelectJob,
  onApplyNow,
  onViewAllJobs,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Government' | 'Private' | 'IT' | 'Banking'>('All');

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Government') return job.sector === 'Government';
    if (activeTab === 'Private') return job.sector === 'Private' || job.sector === 'Multinational';
    if (activeTab === 'IT') return job.category.includes('IT');
    if (activeTab === 'Banking') return job.category.includes('Banking');
    return true;
  });

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Openings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Job Openings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-picked verified career opportunities with upcoming closing deadlines
            </p>
          </div>

          {/* Sector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {(['All', 'Government', 'Private', 'IT', 'Banking'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab === 'All' ? 'All Jobs' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.slice(0, 6).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={onToggleSave}
              onSelectJob={onSelectJob}
              onApplyNow={onApplyNow}
            />
          ))}
        </div>

        {/* View All CTAs */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAllJobs}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer group"
          >
            <span>Explore All {jobs.length} Active Vacancies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
