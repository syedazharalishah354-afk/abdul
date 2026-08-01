import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Lock, 
  Zap, 
  UserCheck, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100/80 px-3 py-1 rounded-full">
            Transparent & Reliable
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Why Millions Trust JobsHub Official
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built with strict security, instant CNIC validation, and verified department listings to safeguard candidates across Pakistan.
          </p>
        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Verified Postings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every job listing is cross-checked against official government gazettes, FPSC notices, or verified corporate HR departments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Application Slip</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon submitting your CNIC and credentials, receive a printable receipt with a unique Tracking ID for interview verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">CNIC Data Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your identity details and CNIC scan documents are stored with end-to-end encryption exclusively for recruitment processing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verified Fee Processing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official application fee deposits are recorded transparently with JazzCash and Easypaisa verification on every applicant receipt.
            </p>
          </div>

        </div>

        {/* 4-Step Application How-It-Works Box */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-400" />
                Simple 4-Step Process
              </span>
              <h3 className="text-2xl font-bold mt-1 text-white">How to Apply Online</h3>
            </div>
            
            <div className="text-xs text-blue-200 bg-white/10 px-4 py-2 rounded-xl border border-white/10 font-medium">
              Average Completion Time: <strong>2 Minutes</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Search Vacancy</h4>
              <p className="text-xs text-blue-100/80">
                Filter by city, department, BPS scale, or qualification level.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Fill CNIC & Details</h4>
              <p className="text-xs text-blue-100/80">
                Provide your Full Name, Father Name, CNIC number & Mobile.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Upload CNIC Images</h4>
              <p className="text-xs text-blue-100/80">
                Attach clear Front & Back CNIC images for candidate verification.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-md">
                04
              </div>
              <h4 className="text-sm font-bold text-white">Print Slip</h4>
              <p className="text-xs text-blue-100/80">
                Get your official Application Slip with instant Tracking ID.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
