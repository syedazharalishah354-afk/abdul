import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Bookmark, 
  PhoneCall, 
  FileText, 
  Menu, 
  X, 
  Building2, 
  ShieldCheck, 
  Home, 
  Layers
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  savedCount: number;
  onOpenTrackModal: () => void;
  onOpenPostJobModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  savedCount,
  onOpenTrackModal,
  onOpenPostJobModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-blue-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Job Portal Pakistan
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Helpline: <strong className="text-white">+92 (51) 111-562-748</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenTrackModal}
              className="flex items-center text-slate-200 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Track Application Status
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center text-amber-300 font-bold hover:text-amber-200 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer group space-x-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black tracking-tighter text-blue-700">
              JOBS<span className="text-slate-400">HUB</span>
              <span className="text-xs align-top font-semibold uppercase tracking-widest ml-1 opacity-50 text-slate-500">Official</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-bold transition-all cursor-pointer pb-1 ${
                currentView === 'home' 
                  ? 'border-b-2 border-blue-600 text-slate-900' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('jobs')}
              className={`text-sm font-bold transition-all cursor-pointer pb-1 ${
                currentView === 'jobs' 
                  ? 'border-b-2 border-blue-600 text-slate-900' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span>Find Vacancies</span>
            </button>

            <button
              onClick={() => handleNavClick('saved')}
              className={`text-sm font-bold transition-all cursor-pointer pb-1 flex items-center space-x-1 ${
                currentView === 'saved' 
                  ? 'border-b-2 border-blue-600 text-slate-900' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span>Saved Jobs</span>
              {savedCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 px-1.5 flex items-center justify-center min-w-4">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-sm font-bold transition-all cursor-pointer pb-1 ${
                currentView === 'contact' 
                  ? 'border-b-2 border-blue-600 text-slate-900' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span>Contact & Support</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={onOpenTrackModal}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Track Slip</span>
            </button>

            <button
              onClick={onOpenPostJobModal}
              className="rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('saved')}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative cursor-pointer"
              title="Saved Jobs"
            >
              <Bookmark className="w-6 h-6 text-slate-700" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 ${
              currentView === 'home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('jobs')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 ${
              currentView === 'jobs' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Browse All Vacancies</span>
          </button>

          <button
            onClick={() => handleNavClick('saved')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentView === 'saved' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="w-5 h-5" />
              <span>Saved Jobs</span>
            </div>
            {savedCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 ${
              currentView === 'contact' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            <span>Contact & Support (WhatsApp)</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenTrackModal();
              }}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Track Application Slip</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenPostJobModal();
              }}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Post a Vacancy (Employer)</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('admin');
              }}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-slate-900 border border-slate-800 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
