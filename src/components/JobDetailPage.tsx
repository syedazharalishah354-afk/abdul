import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Clock, 
  Users, 
  Check, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Job } from '../types';

interface JobDetailPageProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave: (jobId: string) => void;
  onApplyNow: (job: Job) => void;
  onBack: () => void;
  similarJobs: Job[];
  onSelectSimilarJob: (job: Job) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  isSaved = false,
  onToggleSave,
  onApplyNow,
  onBack,
  similarJobs,
  onSelectSimilarJob,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Job Catalog</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Link Copied!' : 'Share Listing'}</span>
            </button>

            <button
              onClick={() => onToggleSave(job.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center space-x-1.5 ${
                isSaved
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-500'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Job Header Hero Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="flex items-start space-x-4">
              <img
                src={job.companyLogo}
                alt={job.department}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    {job.sector} Sector
                  </span>
                  {job.isVerified && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Verified Listing
                    </span>
                  )}
                  {job.isUrgent && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center">
                      <Zap className="w-3.5 h-3.5 mr-1 text-amber-600 fill-amber-500" />
                      Urgent Application
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>

                <p className="text-sm font-semibold text-slate-600 flex items-center">
                  <Building2 className="w-4 h-4 mr-1.5 text-blue-600" />
                  <span>{job.department}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Posted: {job.postedDate}
                  </span>
                  <span className="flex items-center text-amber-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Deadline: {job.deadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="shrink-0 flex flex-col space-y-2">
              <button
                onClick={() => onApplyNow(job)}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
              >
                Apply for this Position
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                CNIC verification slip will be generated
              </p>
            </div>

          </div>

          {/* Core Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-emerald-600" />
                Monthly Package
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {job.salaryRange.split('/')[0]}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium flex items-center">
                <GraduationCap className="w-4 h-4 mr-1 text-blue-600" />
                Required Education
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {job.qualification}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium flex items-center">
                <Briefcase className="w-4 h-4 mr-1 text-purple-600" />
                Experience
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {job.experience}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium flex items-center">
                <Users className="w-4 h-4 mr-1 text-amber-600" />
                Total Seats / Vacancies
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {job.vacancies} Seats Available
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-2" />
                Job Overview & Position Summary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-2" />
                Key Responsibilities & Duties
              </h3>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Eligibility */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-2" />
                Eligibility & Candidate Qualification Criteria
              </h3>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Salary & Benefits */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full mr-2" />
                Allowances, Compensation & Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((ben, i) => (
                  <div key={i} className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-900 flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply instructions */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
                Official Application Protocol
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                {job.howToApply}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onApplyNow(job)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Proceed to Online Application Form
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Organization Info Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Recruiting Organization
              </h4>

              <div className="flex items-center space-x-3">
                <img
                  src={job.companyLogo}
                  alt={job.department}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{job.department}</h5>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Official Agency
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{job.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{job.contactEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{job.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Location Map Preview Mockup */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Work Location Map
              </h4>
              <div className="h-44 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 flex items-center justify-center text-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                    {job.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Vacancies */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Similar Openings
              </h4>

              <div className="space-y-3">
                {similarJobs.slice(0, 3).map((simJob) => (
                  <div
                    key={simJob.id}
                    onClick={() => onSelectSimilarJob(simJob)}
                    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 cursor-pointer transition-colors group"
                  >
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {simJob.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate">{simJob.department}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <span>{simJob.city}</span>
                      <span className="font-semibold text-emerald-700">{simJob.salaryRange.split('/')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Bottom Sticky Apply Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium">{job.city}</div>
          <div className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{job.title}</div>
        </div>
        <button
          onClick={() => onApplyNow(job)}
          className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer shrink-0"
        >
          Apply Now
        </button>
      </div>

    </div>
  );
};
