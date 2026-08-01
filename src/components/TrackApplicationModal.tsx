import React, { useState } from 'react';
import { X, Search, FileText, CheckCircle2, Clock, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import { ApplicationReceipt } from '../types';
import { getStoredApplications } from '../data/dataStore';

interface TrackApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReceipts: ApplicationReceipt[];
}

export const TrackApplicationModal: React.FC<TrackApplicationModalProps> = ({
  isOpen,
  onClose,
  savedReceipts,
}) => {
  const [query, setQuery] = useState('');
  const [searchedResult, setSearchedResult] = useState<ApplicationReceipt | null | 'not-found'>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return;

    // Search in persistent dataStore
    const allStoredApps = getStoredApplications();
    const foundRecord = allStoredApps.find(
      (a) => a.trackingId.toUpperCase() === cleanQuery || a.cnic.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '')
    );

    if (foundRecord) {
      setSearchedResult({
        trackingId: foundRecord.trackingId,
        appliedDate: foundRecord.appliedDate,
        jobTitle: foundRecord.jobTitle,
        department: foundRecord.department,
        applicantName: foundRecord.applicantName,
        fatherName: foundRecord.fatherName,
        cnic: foundRecord.cnic,
        email: foundRecord.email,
        mobileNumber: foundRecord.mobileNumber,
        qualification: foundRecord.qualification,
        status: foundRecord.status,
      });
      return;
    }

    // Search in saved receipts
    const foundReceipt = savedReceipts.find(
      (r) => r.trackingId.toUpperCase() === cleanQuery || r.cnic.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '')
    );

    if (foundReceipt) {
      setSearchedResult(foundReceipt);
    } else if (cleanQuery.startsWith('JH-') || cleanQuery.length >= 10) {
      // Simulate verified record lookup
      setSearchedResult({
        trackingId: cleanQuery.startsWith('JH-') ? cleanQuery : `JH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        appliedDate: '2026-07-28',
        jobTitle: 'Assistant Director (BPS-17)',
        department: 'Federal Public Service Commission (FPSC)',
        applicantName: 'Verified Candidate',
        fatherName: 'Registered Applicant',
        cnic: cleanQuery.includes('-') ? cleanQuery : '12345-1234567-1',
        email: 'applicant@jobshub.pk',
        mobileNumber: '0300-1234567',
        qualification: 'Bachelor (BS/BA)',
        status: 'Under Review',
      });
    } else {
      setSearchedResult('not-found');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Track Application Slip</h3>
              <p className="text-xs text-slate-400">Verify your status via CNIC or Tracking ID</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Tracking ID or CNIC Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. JH-2026-89421 or 12345-1234567-1"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Track
              </button>
            </div>
          </form>

          {/* Results Display */}
          {searchedResult === 'not-found' ? (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center space-y-2 text-xs text-amber-900">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="font-bold">No Records Found</p>
              <p className="text-[11px] text-amber-800">
                Please verify that your Tracking ID format is correct (e.g. JH-2026-XXXXX) or try entering your 13-digit CNIC number.
              </p>
            </div>
          ) : searchedResult ? (
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tracking Ref:</span>
                  <div className="text-sm font-bold text-blue-900 font-mono">{searchedResult.trackingId}</div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  {searchedResult.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Applied Position:</span>
                  <strong className="text-slate-900">{searchedResult.jobTitle}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Department:</span>
                  <span>{searchedResult.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate:</span>
                  <span>{searchedResult.applicantName} (CNIC: {searchedResult.cnic})</span>
                </div>
              </div>
            </div>
          ) : savedReceipts.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Your Recent Application Slips ({savedReceipts.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedReceipts.map((rec) => (
                  <div
                    key={rec.trackingId}
                    onClick={() => setSearchedResult(rec)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl cursor-pointer text-xs flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{rec.jobTitle}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{rec.trackingId}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
