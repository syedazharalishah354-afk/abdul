import React, { useState } from 'react';
import { 
  X, 
  User, 
  CreditCard, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  ZoomIn, 
  ShieldCheck, 
  AlertTriangle,
  MessageSquare,
  Check,
  Ban
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus } from '../types';

interface AdminApplicationDetailModalProps {
  application: ApplicationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus, rejectionReason?: string, adminNotes?: string) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const AdminApplicationDetailModal: React.FC<AdminApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenLightbox,
}) => {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(application?.rejectionReason || '');
  const [adminNotes, setAdminNotes] = useState(application?.adminNotes || '');

  if (!isOpen || !application) return null;

  const handleApprove = () => {
    onUpdateStatus(application.id, 'Approved', undefined, adminNotes);
  };

  const handleReject = () => {
    if (!showRejectBox) {
      setShowRejectBox(true);
      return;
    }
    onUpdateStatus(application.id, 'Rejected', rejectionReason, adminNotes);
    setShowRejectBox(false);
  };

  const handleMarkReview = () => {
    onUpdateStatus(application.id, 'Under Review', undefined, adminNotes);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Approved Application
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
            Rejected
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-7 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-extrabold bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md border border-blue-400/30">
                {application.trackingId}
              </span>
              {getStatusBadge(application.status)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Applicant Details: {application.applicantName}
            </h2>
            <p className="text-xs text-blue-200/90 flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Applied for {application.jobTitle} • {application.department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Candidate Profile Info Grid */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <User className="w-4 h-4 mr-1.5 text-blue-600" />
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Full Name</p>
                <p className="text-sm font-bold text-slate-900">{application.applicantName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Father's Name</p>
                <p className="text-sm font-bold text-slate-900">{application.fatherName || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">CNIC Number</p>
                <p className="text-sm font-mono font-extrabold text-blue-700">{application.cnic}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Mobile Phone</p>
                <p className="text-sm font-bold text-slate-900">{application.mobileNumber}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Email Address</p>
                <p className="text-sm font-semibold text-slate-800">{application.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Qualification</p>
                <p className="text-sm font-bold text-emerald-700">{application.qualification}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-medium text-slate-500">Residential Postal Address</p>
                <p className="text-xs font-semibold text-slate-800">{application.address} (Postal Code: {application.postalCode})</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Application Date</p>
                <p className="text-xs font-bold text-slate-700">{application.appliedDate}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Uploaded Verification Documents (CNIC Front, CNIC Back, Payment Proof) */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-600" />
              Uploaded Identity Documents & Payment Proof
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CNIC Front */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">CNIC Front Copy</span>
                  {application.cnicFrontPreview && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Uploaded
                    </span>
                  )}
                </div>

                {application.cnicFrontPreview ? (
                  <div 
                    onClick={() => onOpenLightbox(application.cnicFrontPreview!, `CNIC Front - ${application.applicantName}`)}
                    className="relative group w-full h-36 bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-300"
                  >
                    <img
                      src={application.cnicFrontPreview}
                      alt="CNIC Front"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs space-x-1">
                      <ZoomIn className="w-4 h-4" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-36 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    No CNIC Front Image
                  </div>
                )}
              </div>

              {/* CNIC Back */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">CNIC Back Copy</span>
                  {application.cnicBackPreview && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Uploaded
                    </span>
                  )}
                </div>

                {application.cnicBackPreview ? (
                  <div 
                    onClick={() => onOpenLightbox(application.cnicBackPreview!, `CNIC Back - ${application.applicantName}`)}
                    className="relative group w-full h-36 bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-300"
                  >
                    <img
                      src={application.cnicBackPreview}
                      alt="CNIC Back"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs space-x-1">
                      <ZoomIn className="w-4 h-4" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-36 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    No CNIC Back Image
                  </div>
                )}
              </div>

              {/* Payment Proof Receipt Screenshot */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Payment / Fee Proof</span>
                  {application.paymentProofPreview ? (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Attached
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      Optional / Exempt
                    </span>
                  )}
                </div>

                {application.paymentProofPreview ? (
                  <div 
                    onClick={() => onOpenLightbox(application.paymentProofPreview!, `Fee Slip Payment Proof - ${application.applicantName}`)}
                    className="relative group w-full h-36 bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-300"
                  >
                    <img
                      src={application.paymentProofPreview}
                      alt="Payment Slip Proof"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs space-x-1">
                      <ZoomIn className="w-4 h-4" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-36 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center px-4">
                    No Challan / Payment Proof Attached
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Note or Admin Notes section */}
          {application.status === 'Rejected' && application.rejectionReason && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-red-800 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                Rejection Reason Logged:
              </span>
              <p className="text-red-700 font-medium pl-5">{application.rejectionReason}</p>
            </div>
          )}

          {application.adminNotes && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-blue-800 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1 text-blue-600" />
                Admin Internal Notes:
              </span>
              <p className="text-blue-900 font-medium pl-5">{application.adminNotes}</p>
            </div>
          )}

          {/* Action Box to update status */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-slate-100">Application Status Decision</h4>
              <span className="text-xs text-slate-400 font-medium">Updates live tracking status immediately</span>
            </div>

            {showRejectBox && (
              <div className="space-y-2 animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-red-300 uppercase">
                  Reason for Rejection (Visible on Applicant Tracking Slip)
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Incomplete documentation, CNIC copy blurry, or age limit criteria not met."
                  className="w-full p-3 bg-slate-800 border border-red-500/50 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 sm:flex-none px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Application</span>
                </button>

                <button
                  type="button"
                  onClick={handleMarkReview}
                  className="flex-1 sm:flex-none px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center space-x-1.5"
                >
                  <Clock className="w-4 h-4" />
                  <span>Mark Under Review</span>
                </button>
              </div>

              <div className="w-full sm:w-auto flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center space-x-1.5"
                >
                  <Ban className="w-4 h-4" />
                  <span>{showRejectBox ? 'Confirm Rejection' : 'Reject Application'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
