import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';
import { ViewMode } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { formatWhatsAppUrl } from '../data/dataStore';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectCity: (cityName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onSelectCity,
}) => {
  const settings = useSiteSettings();

  const handleWhatsAppHelpdesk = () => {
    const text = `Hello ${settings.websiteName || 'JobsHub Official'}, I need candidate support.`;
    const url = formatWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 cursor-pointer inline-flex"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Jobs<span className="text-blue-400">Hub</span>
                </span>
                <span className="ml-2 bg-blue-900 text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-700 uppercase">
                  Official
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              JobsHub Official is Pakistan's premier verified career portal. Connecting qualified candidates with government ministries, public sector corporations, IT enterprises, and top healthcare institutions.
            </p>

            <div className="flex flex-col space-y-2 pt-1 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Verified Vacancies & CNIC Slip Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Data Privacy Guaranteed for All Applicants</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Home Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  All Jobs Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('saved')}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Saved Bookmarks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Helpdesk & WhatsApp
                </button>
              </li>
            </ul>
          </div>

          {/* Top Job Sectors */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Popular Sectors
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'Government & Public Sector',
                'IT & Software Development',
                'Banking & Finance',
                'Healthcare & Medical',
                'Education & Academics',
                'Engineering & Construction',
              ].map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('jobs');
                    }}
                    className="hover:text-blue-400 transition-colors flex items-center text-slate-400 text-xs cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-blue-500 shrink-0" />
                    <span>{cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Cities & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Top Cities & Contact
            </h4>
            
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Quetta', 'Rawalpindi'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    onNavigate('jobs');
                  }}
                  className="bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-xs px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Sector G-8/1, Blue Area, Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+92 (51) 111-562-748</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@jobshub-official.pk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="my-8 bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                Candidate Support & Inquiry Desk
              </h5>
              <p className="text-xs text-slate-400">
                Have questions regarding application status, fee submission, or recruitment guidelines? Contact our official WhatsApp helpdesk.
              </p>
            </div>
          </div>

          <button
            onClick={handleWhatsAppHelpdesk}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Official Helpdesk</span>
          </button>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-800 gap-2">
          <p>© 2026 JobsHub Official. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Verification Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
