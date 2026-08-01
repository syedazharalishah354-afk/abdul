import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  CheckCircle2,
  ChevronDown,
  Layers,
  Banknote,
  ArrowRight
} from 'lucide-react';
import { Job, FilterState } from '../types';
import { JobCard } from './JobCard';
import { POPULAR_CATEGORIES } from '../data/mockJobs';

interface JobListingPageProps {
  jobs: Job[];
  initialFilters: Partial<FilterState>;
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onApplyNow: (job: Job) => void;
  onCategoryChange?: (categorySlug: string) => void;
}

export const JobListingPage: React.FC<JobListingPageProps> = ({
  jobs,
  initialFilters,
  savedJobIds,
  onToggleSave,
  onSelectJob,
  onApplyNow,
  onCategoryChange,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialFilters.searchQuery || '',
    city: initialFilters.city || '',
    category: initialFilters.category || '',
    categorySlug: initialFilters.categorySlug || '',
    sector: initialFilters.sector || '',
    jobType: initialFilters.jobType || '',
    qualification: initialFilters.qualification || '',
    experience: initialFilters.experience || '',
    minSalaryFilter: initialFilters.minSalaryFilter || 0,
    sortBy: initialFilters.sortBy || 'newest',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync internal state if props initialFilters change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: initialFilters.category ?? prev.category,
      categorySlug: initialFilters.categorySlug ?? prev.categorySlug,
      city: initialFilters.city ?? prev.city,
      searchQuery: initialFilters.searchQuery ?? prev.searchQuery,
      minSalaryFilter: initialFilters.minSalaryFilter ?? prev.minSalaryFilter,
    }));
    setVisibleCount(12);
  }, [initialFilters]);

  // Find metadata for current category if filtered by category slug or name
  const activeCategoryInfo = useMemo(() => {
    if (filters.categorySlug) {
      return POPULAR_CATEGORIES.find((c) => c.slug === filters.categorySlug);
    }
    if (filters.category) {
      return POPULAR_CATEGORIES.find(
        (c) => c.name.toLowerCase() === filters.category.toLowerCase() || c.slug === filters.category.toLowerCase()
      );
    }
    return null;
  }, [filters.categorySlug, filters.category]);

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Category Slug Filter (Exact match mandatory if specified)
      if (filters.categorySlug) {
        if (job.categorySlug.toLowerCase() !== filters.categorySlug.toLowerCase()) {
          return false;
        }
      } else if (filters.category) {
        const catQuery = filters.category.toLowerCase();
        const matchSlug = job.categorySlug.toLowerCase() === catQuery;
        const matchName = job.category.toLowerCase() === catQuery;
        if (!matchSlug && !matchName) return false;
      }

      // Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchDept = job.department.toLowerCase().includes(query);
        const matchCategory = job.category.toLowerCase().includes(query);
        const matchCity = job.city.toLowerCase().includes(query);
        if (!matchTitle && !matchDept && !matchCategory && !matchCity) return false;
      }

      // City
      if (filters.city && job.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Sector
      if (filters.sector && job.sector.toLowerCase() !== filters.sector.toLowerCase()) {
        return false;
      }

      // Job Type
      if (filters.jobType && job.jobType.toLowerCase() !== filters.jobType.toLowerCase()) {
        return false;
      }

      // Minimum Salary Filter (Rs)
      if (filters.minSalaryFilter && filters.minSalaryFilter > 0) {
        if (job.minSalary < filters.minSalaryFilter) return false;
      }

      // Qualification
      if (filters.qualification && !job.qualification.toLowerCase().includes(filters.qualification.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'salary-high') {
        return b.minSalary - a.minSalary;
      }
      if (filters.sortBy === 'closing-soon') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // default: newest
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [jobs, filters]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({
      searchQuery: '',
      city: '',
      category: '',
      categorySlug: '',
      sector: '',
      jobType: '',
      qualification: '',
      experience: '',
      minSalaryFilter: 0,
      sortBy: 'newest',
    });
    setVisibleCount(8);
    if (onCategoryChange) onCategoryChange('');
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleSelectCategorySlug = (slug: string) => {
    const cat = POPULAR_CATEGORIES.find((c) => c.slug === slug);
    setFilters((prev) => ({
      ...prev,
      categorySlug: slug,
      category: cat ? cat.name : '',
    }));
    setVisibleCount(8);
    if (onCategoryChange) onCategoryChange(slug);
  };

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.city ||
    filters.category ||
    filters.categorySlug ||
    filters.sector ||
    filters.jobType ||
    filters.qualification ||
    (filters.minSalaryFilter && filters.minSalaryFilter > 0)
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Specific Dedicated Banner */}
        {activeCategoryInfo ? (
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-blue-500/10 pointer-events-none blur-2xl" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-200 uppercase tracking-wider mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Category Channel: {activeCategoryInfo.name}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {activeCategoryInfo.name} Vacancies
                </h1>
                <p className="text-sm text-blue-100 max-w-2xl mt-2 leading-relaxed">
                  {activeCategoryInfo.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-200">
                  <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                    Available Seats: <strong className="text-white">{filteredJobs.reduce((acc, j) => acc + j.availableSeats, 0)} Seats</strong>
                  </span>
                  <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                    Listings Count: <strong className="text-white">{filteredJobs.length} Positions</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelectCategorySlug('')}
                className="self-start md:self-center bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Clear Category Filter</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* General Page Header */
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Official Directory
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  All Job Vacancies in Pakistan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Showing {filteredJobs.length} active verified positions with salaries in Pakistani Rupees (Rs)
                </p>
              </div>

              {/* Search Input */}
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Search title, agency, department, city..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Filters:</span>
                
                {filters.searchQuery && (
                  <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-lg border border-blue-200 flex items-center">
                    Query: "{filters.searchQuery}"
                    <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer hover:text-blue-900" onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))} />
                  </span>
                )}

                {(filters.categorySlug || filters.category) && (
                  <span className="text-xs bg-purple-50 text-purple-800 font-semibold px-2.5 py-1 rounded-lg border border-purple-200 flex items-center">
                    Category: {activeCategoryInfo ? activeCategoryInfo.name : (filters.category || filters.categorySlug)}
                    <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer hover:text-purple-900" onClick={() => handleSelectCategorySlug('')} />
                  </span>
                )}

                {filters.city && (
                  <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-lg border border-blue-200 flex items-center">
                    City: {filters.city}
                    <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer hover:text-blue-900" onClick={() => setFilters((prev) => ({ ...prev, city: '' }))} />
                  </span>
                )}

                {filters.sector && (
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center">
                    Sector: {filters.sector}
                    <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer hover:text-emerald-900" onClick={() => setFilters((prev) => ({ ...prev, sector: '' }))} />
                  </span>
                )}

                {filters.qualification && (
                  <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-lg border border-amber-200 flex items-center">
                    Degree: {filters.qualification}
                    <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer hover:text-amber-900" onClick={() => setFilters((prev) => ({ ...prev, qualification: '' }))} />
                  </span>
                )}

                {filters.minSalaryFilter && filters.minSalaryFilter > 0 ? (
                  <span className="text-xs bg-indigo-50 text-indigo-800 font-semibold px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center">
                    Min Salary: Rs {filters.minSalaryFilter.toLocaleString()}+
                    <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer hover:text-indigo-900" onClick={() => setFilters((prev) => ({ ...prev, minSalaryFilter: 0 }))} />
                  </span>
                ) : null}

                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-bold underline ml-2 cursor-pointer flex items-center"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Refine Filter</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Dropdown Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Job Category</span>
                </label>
                <select
                  value={filters.categorySlug || ''}
                  onChange={(e) => handleSelectCategorySlug(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 text-slate-900 cursor-pointer"
                >
                  <option value="">All 16 Categories</option>
                  {POPULAR_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Salary Range Filter (Rs) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Min Salary (Pakistani Rs)</span>
                </label>
                <select
                  value={filters.minSalaryFilter || 0}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minSalaryFilter: Number(e.target.value) }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 text-slate-900 cursor-pointer"
                >
                  <option value={0}>Any Salary Amount</option>
                  <option value={35000}>Rs 35,000 / month +</option>
                  <option value={50000}>Rs 50,000 / month +</option>
                  <option value={75000}>Rs 75,000 / month +</option>
                  <option value={100000}>Rs 100,000 / month +</option>
                  <option value={150000}>Rs 150,000 / month +</option>
                  <option value={200000}>Rs 200,000 / month +</option>
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>City / Location</span>
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value="">All Pakistan Locations</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Multan">Multan</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Sialkot">Sialkot</option>
                </select>
              </div>

              {/* Sector Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Organization Sector
                </label>
                <div className="space-y-1.5 text-xs font-medium text-slate-700">
                  {['', 'Government', 'Private', 'Multinational', 'Semi-Government'].map((sec) => (
                    <label key={sec || 'all'} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded hover:bg-slate-50">
                      <input
                        type="radio"
                        name="sector"
                        checked={filters.sector === sec}
                        onChange={() => setFilters((prev) => ({ ...prev, sector: sec }))}
                        className="text-blue-600 focus:ring-blue-500 rounded-full"
                      />
                      <span>{sec || 'All Sectors'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Qualification Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Qualification Required</span>
                </label>
                <select
                  value={filters.qualification}
                  onChange={(e) => setFilters((prev) => ({ ...prev, qualification: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value="">All Qualification Degrees</option>
                  <option value="Matriculation">Matriculation</option>
                  <option value="Intermediate">Intermediate / FSc</option>
                  <option value="Bachelor">Bachelor (BS/BA/B.Sc)</option>
                  <option value="Master">Master (MS/MA/M.Sc)</option>
                  <option value="MBBS">MBBS / Medical Degree</option>
                  <option value="Diploma">DAE / Diploma</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value="">All Job Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

            </div>
          </div>

          {/* Main Results Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Controls Bar (Sort & Found Count) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <span>Filters</span>
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  Found <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> vacancies
                  {activeCategoryInfo ? ` in ${activeCategoryInfo.name}` : ''}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Sort Selector */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-medium hidden sm:inline">Sort By:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="newest">Newest Posted</option>
                    <option value="closing-soon">Closing Soonest</option>
                    <option value="salary-high">Highest Salary (Rs)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Skeleton Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-10 bg-slate-200 rounded w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              
              /* Empty Search Results State */
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 my-6 shadow-xs">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Job Vacancies Found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  We couldn't find any job postings matching your selected criteria. Try adjusting your city, min salary, or category filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>

            ) : (

              <>
                {/* Job Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedJobs.map((job) => (
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

                {/* Load More Pagination Button */}
                {displayedJobs.length < filteredJobs.length && (
                  <div className="pt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 16)}
                      className="px-8 py-3.5 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center space-x-2"
                    >
                      <span>Load 16 More Vacancies ({filteredJobs.length - displayedJobs.length} Remaining)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setVisibleCount(filteredJobs.length)}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all cursor-pointer"
                    >
                      Show All {filteredJobs.length} Jobs
                    </button>
                  </div>
                )}
                {filteredJobs.length > 0 && (
                  <p className="text-xs text-slate-400 mt-4 text-center font-medium">
                    Showing {displayedJobs.length} of {filteredJobs.length} verified jobs in this category
                  </p>
                )}
              </>

            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filter Jobs</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
              <select
                value={filters.categorySlug || ''}
                onChange={(e) => handleSelectCategorySlug(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="">All 16 Categories</option>
                {POPULAR_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="">All Locations</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Multan">Multan</option>
              </select>
            </div>

            {/* Min Salary Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Min Salary (Rs)</label>
              <select
                value={filters.minSalaryFilter || 0}
                onChange={(e) => setFilters((prev) => ({ ...prev, minSalaryFilter: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value={0}>Any Salary</option>
                <option value={50000}>Rs 50,000 +</option>
                <option value={100000}>Rs 100,000 +</option>
                <option value={150000}>Rs 150,000 +</option>
              </select>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

