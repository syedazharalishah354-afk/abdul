import React from 'react';
import { 
  Building2, 
  Code, 
  GraduationCap, 
  Landmark, 
  Stethoscope, 
  HardHat, 
  Radio, 
  Briefcase,
  ChevronRight,
  ArrowUpRight,
  Laptop,
  Factory,
  Sparkles,
  CreditCard,
  Hospital,
  Shield,
  ShieldCheck,
  Anchor,
  Plane,
  PlaneTakeoff,
  Wrench
} from 'lucide-react';
import { POPULAR_CATEGORIES } from '../data/mockJobs';

interface JobCategoriesProps {
  onSelectCategory: (categorySlug: string, categoryName?: string) => void;
}

export const JobCategories: React.FC<JobCategoriesProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-blue-600" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case 'Factory':
        return <Factory className="w-6 h-6 text-blue-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-blue-600" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
      case 'Hospital':
        return <Hospital className="w-6 h-6 text-blue-600" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      case 'Anchor':
        return <Anchor className="w-6 h-6 text-blue-600" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-blue-600" />;
      case 'PlaneTakeoff':
        return <PlaneTakeoff className="w-6 h-6 text-blue-600" />;
      case 'Code':
        return <Code className="w-6 h-6 text-blue-600" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-blue-600" />;
      default:
        return <Briefcase className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              <span>Explore Top Sectors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Job Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a category to view all verified government, private, military, and specialized vacancies across Pakistan
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('', '')}
            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug, cat.name)}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {React.cloneElement(getIcon(cat.iconName), {
                    className: 'w-6 h-6 text-blue-600 group-hover:text-white transition-colors',
                  })}
                </div>
                
                <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                  {cat.count} Jobs
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5 flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

