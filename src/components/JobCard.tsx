import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onApplyNow: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  onToggleSave,
  onSelectJob,
  onApplyNow,
}) => {

  const getSectorStyle = (sector: string) => {
    switch (sector) {
      case 'Government':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Private':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Multinational':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Semi-Government':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
      <div>
        {/* Top Badges & Timestamp Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getSectorStyle(job.sector)}`}>
              {job.sector} Sector
            </span>

            {job.isVerified && (
              <span className="flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 mr-1 text-blue-600" />
                Verified
              </span>
            )}

            {job.isUrgent && (
              <span className="flex items-center px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 mr-1 text-amber-600 fill-amber-500" />
                Urgent
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isSaved 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-blue-600" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title & Organization */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={job.companyLogo}
            alt={job.department}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
          />
          <div>
            <h3 
              onClick={() => onSelectJob(job)}
              className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-1"
            >
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium flex items-center mt-0.5">
              <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
              <span>{job.department} • {job.city}</span>
            </p>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
            {job.salaryRange.split('/')[0]}
          </span>
          <span className="px-2 py-1 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700">
            {job.qualification}
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-500">
            {job.experience}
          </span>
        </div>
      </div>

      {/* Footer / Application Actions */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Deadline: {job.deadline}
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectJob(job)}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Details
          </button>

          <button
            onClick={() => onApplyNow(job)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
