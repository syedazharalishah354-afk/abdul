import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FilterState } from '../types';

interface HeroSectionProps {
  onSearchSubmit: (filters: Partial<FilterState>) => void;
  onSelectTag: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchSubmit,
  onSelectTag,
}) => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      searchQuery: keyword,
      city,
      category,
      sector,
    });
  };

  const POPULAR_TAGS = [
    'Assistant Director BPS-17',
    'React Developer',
    'FPSC Vacancies',
    'Bank Branch Manager',
    'Medical Officer',
    'Data Entry Operator',
    'Civil Engineer',
  ];

  return (
    <div className="relative bg-slate-50 text-slate-900 border-b border-slate-200 py-12 lg:py-16">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Verified Career Portal Pakistan</span>
          </div>
        </div>

        {/* Main Editorial Headline */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Discover your next <span className="text-blue-700">career move</span>.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Over 15,000 verified professional & government opportunities in Pakistan.
          </p>
        </div>

        {/* Editorial Search Bar */}
        <div className="bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
            
            {/* Keyword Input */}
            <div className="flex-1 flex items-center px-3 gap-2 w-full">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 py-2"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200 self-center"></div>

            {/* City Input */}
            <div className="flex-1 flex items-center px-3 gap-2 w-full">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-medium text-slate-900 cursor-pointer py-2 appearance-none"
              >
                <option value="">City or Region (All)</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Multan">Multan</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200 self-center"></div>

            {/* Sector Dropdown */}
            <div className="flex-1 flex items-center px-3 gap-2 w-full">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-medium text-slate-900 cursor-pointer py-2 appearance-none"
              >
                <option value="">All Sectors</option>
                <option value="Government">Government & BPS</option>
                <option value="Private">Private Corporate</option>
                <option value="Multinational">Multinational (MNC)</option>
                <option value="Semi-Government">Semi-Government</option>
              </select>
            </div>

            {/* Search CTA Button */}
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-100 cursor-pointer shrink-0"
            >
              Search
            </button>

          </form>
        </div>

        {/* Popular Tag Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Popular:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(tag)}
              className="bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold px-3 py-1 rounded-full border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
