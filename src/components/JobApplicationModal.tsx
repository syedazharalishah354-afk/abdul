import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Printer, 
  Copy, 
  Check, 
  Image as ImageIcon,
  User,
  CreditCard,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Building2,
  Wallet,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Job, QualificationLevel, ApplicationFormData, ApplicationReceipt } from '../types';
import { addApplication } from '../data/dataStore';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface JobApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess: (receipt: ApplicationReceipt) => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmissionSuccess,
}) => {
  const settings = useSiteSettings();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({
    fullName: '',
    fatherName: '',
    cnic: '',
    mobileNumber: '',
    email: '',
    qualification: 'Bachelor (BS/BA)',
    address: '',
    postalCode: '',
    cnicFrontPreview: '',
    cnicBackPreview: '',
    paymentProofPreview: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<ApplicationReceipt | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Reset state whenever modal opens or job changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCompletedReceipt(null);
      setErrors({});
    }
  }, [isOpen, job?.id]);

  if (!isOpen || !job) return null;

  // Auto-format CNIC input as XXXXX-XXXXXXX-X
  const handleCNICChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
    }
    setFormData((prev) => ({ ...prev, cnic: formatted }));
    if (errors.cnic) {
      setErrors((prev) => ({ ...prev, cnic: '' }));
    }
  };

  // Image upload handling with base64 preview
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'cnicFront' | 'cnicBack' | 'paymentProof'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    }
  };

  // Helper to auto-populate sample image for evaluation
  const handleUseSampleImage = (field: 'cnicFront' | 'cnicBack' | 'paymentProof') => {
    let sampleUrl = '';
    if (field === 'cnicFront') {
      sampleUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
    } else if (field === 'cnicBack') {
      sampleUrl = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80';
    } else {
      sampleUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: `${field}_sample.png`,
      [`${field}Preview`]: sampleUrl,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // STEP 1 VALIDATION
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.fatherName?.trim()) newErrors.fatherName = 'Father Name is required';
    
    const rawCNIC = (formData.cnic || '').replace(/\D/g, '');
    if (!rawCNIC || rawCNIC.length !== 13) {
      newErrors.cnic = 'Valid 13-digit CNIC is required (e.g. 12345-1234567-1)';
    }

    if (!formData.mobileNumber?.trim() || formData.mobileNumber.replace(/\D/g, '').length < 10) {
      newErrors.mobileNumber = 'Valid Mobile Number is required (e.g. 0300-1234567)';
    }

    if (!formData.email?.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid Email Address is required';
    }

    if (!formData.address?.trim()) newErrors.address = 'Residential Address is required';
    if (!formData.postalCode?.trim()) newErrors.postalCode = 'Postal Code is required';

    if (!formData.cnicFrontPreview) {
      newErrors.cnicFront = 'CNIC Front Image is mandatory for identity verification';
    }

    if (!formData.cnicBackPreview) {
      newErrors.cnicBack = 'CNIC Back Image is mandatory for identity verification';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must confirm the legal accuracy of provided details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 2 VALIDATION
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paymentProofPreview) {
      newErrors.paymentProof = 'Payment screenshot is required before submitting your application';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle clicking "Next" on Step 1
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({});
      const modalBody = document.getElementById('application-modal-scroll');
      if (modalBody) modalBody.scrollTop = 0;
    }
  };

  // Handle clicking "Submit Application" on Step 2
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      const trackingId = `JH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const appliedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Save ONE complete application record to shared dataStore for Admin Portal (and Supabase)
      const createdRecord = await addApplication({
        trackingId,
        jobId: job.id,
        jobTitle: job.title,
        department: job.department,
        category: job.category,
        categorySlug: job.categorySlug,
        applicantName: formData.fullName || '',
        fatherName: formData.fatherName || '',
        cnic: formData.cnic || '',
        email: formData.email || '',
        mobileNumber: formData.mobileNumber || '',
        qualification: (formData.qualification as QualificationLevel) || 'Bachelor (BS/BA)',
        address: formData.address || '',
        postalCode: formData.postalCode || '',
        appliedDate,
        status: 'Pending',
        cnicFrontPreview: formData.cnicFrontPreview || undefined,
        cnicBackPreview: formData.cnicBackPreview || undefined,
        paymentProofPreview: formData.paymentProofPreview || undefined,
        coverNote: formData.coverNote || undefined,
      });

      const receipt: ApplicationReceipt = {
        trackingId: createdRecord.trackingId,
        appliedDate: createdRecord.appliedDate,
        jobTitle: createdRecord.jobTitle,
        department: createdRecord.department,
        applicantName: createdRecord.applicantName,
        fatherName: createdRecord.fatherName,
        cnic: createdRecord.cnic,
        email: createdRecord.email,
        mobileNumber: createdRecord.mobileNumber,
        qualification: createdRecord.qualification,
        status: 'Received',
      };

      setCompletedReceipt(receipt);
      setIsSubmitting(false);
      onSubmissionSuccess(receipt);
    } catch (err) {
      console.error('Error submitting application:', err);
      setIsSubmitting(false);
    }
  };

  const handleCopyTracking = () => {
    if (completedReceipt) {
      navigator.clipboard.writeText(completedReceipt.trackingId);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-5 sm:p-7">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center space-x-1 text-xs font-bold text-blue-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                JobsHub Official Recruitment Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Application for {job.title}
              </h2>
              <p className="text-xs text-blue-100/90 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-blue-300" />
                {job.department} ({job.city})
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* TWO-STEP PROCESS PROGRESS STEPPER (Only when filling form) */}
          {!completedReceipt && (
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <div className={`flex-1 flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                currentStep === 1 
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md' 
                  : 'bg-white/10 text-emerald-300 border-emerald-500/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  currentStep === 1 ? 'bg-white text-blue-900' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                </div>
                <div className="truncate">
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">Step 1</span>
                  <span className="font-bold">Applicant Details & Documents</span>
                </div>
              </div>

              <div className="text-slate-500 font-bold px-1">→</div>

              <div className={`flex-1 flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                currentStep === 2 
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md' 
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  currentStep === 2 ? 'bg-white text-amber-900' : 'bg-slate-700 text-slate-300'
                }`}>
                  2
                </div>
                <div className="truncate">
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">Step 2</span>
                  <span className="font-bold">Payment & Final Submit</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div id="application-modal-scroll" className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">
          
          {completedReceipt ? (
            
            /* SUCCESS APPLICATION RECEIPT VIEW */
            <div className="space-y-6 text-slate-800">
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-950">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your official job application, CNIC verification documents, and payment screenshot have been registered. Your application is now queued for admin review.
                </p>

                {/* Tracking ID Badge Box */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Official Application Tracking ID:
                  </span>
                  <span className="text-xl font-extrabold text-blue-900 tracking-wider font-mono">
                    {completedReceipt.trackingId}
                  </span>
                  <button
                    onClick={handleCopyTracking}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTracking ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>
              </div>

              {/* Summary Table */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                  Candidate Registration Summary
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Applicant Full Name:</span>
                    <strong className="text-slate-900 font-bold text-sm">{completedReceipt.applicantName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Father Name:</span>
                    <strong className="text-slate-900 font-bold text-sm">{completedReceipt.fatherName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">CNIC Number:</span>
                    <strong className="text-slate-900 font-mono font-bold text-sm">{completedReceipt.cnic}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Mobile Contact:</span>
                    <strong className="text-slate-900 font-bold text-sm">{completedReceipt.mobileNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Highest Qualification:</span>
                    <strong className="text-slate-900 font-bold text-sm">{completedReceipt.qualification}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Date of Application:</span>
                    <strong className="text-slate-900 font-bold text-sm">{completedReceipt.appliedDate}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Application Slip</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer text-center"
                >
                  Done / Close Window
                </button>
              </div>
            </div>

          ) : currentStep === 1 ? (

            /* ========================================================================= */
            /* STEP 1: APPLICANT INFORMATION & DOCUMENTS */
            /* ========================================================================= */
            <form onSubmit={handleProceedToStep2} className="space-y-6">
              
              {/* Step 1 Header Notice */}
              <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-950 text-xs">Step 1 of 2: Personal Information & CNIC Upload</h4>
                  <p className="mt-0.5">
                    Please provide all 10 required fields below. CNIC Front and CNIC Back images are mandatory before proceeding to Step 2.
                  </p>
                </div>
              </div>

              {/* Candidate Personal Information Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center">
                  <User className="w-4 h-4 text-blue-600 mr-2" />
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Muhammad Ali Shah"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.fullName}</p>}
                  </div>

                  {/* 2. Father Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. Father Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      placeholder="e.g. Tariq Mehmood Shah"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.fatherName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.fatherName && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.fatherName}</p>}
                  </div>

                  {/* 3. CNIC Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. CNIC Number (13-Digits) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.cnic}
                        onChange={(e) => handleCNICChange(e.target.value)}
                        placeholder="12345-1234567-1"
                        maxLength={15}
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          errors.cnic ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.cnic && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.cnic}</p>}
                  </div>

                  {/* 4. Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      4. Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        placeholder="0300-1234567"
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          errors.mobileNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.mobileNumber && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.mobileNumber}</p>}
                  </div>

                  {/* 5. Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      5. Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="candidate@example.com"
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.email}</p>}
                  </div>

                  {/* 6. Qualification */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      6. Highest Qualification <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value as QualificationLevel })}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="Matriculation">Matriculation</option>
                        <option value="Intermediate / FSc">Intermediate / FSc</option>
                        <option value="Bachelor (BS/BA)">Bachelor (BS/BA)</option>
                        <option value="Master (MS/MA)">Master (MS/MA)</option>
                        <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                        <option value="DAE / Diploma">DAE / Diploma</option>
                        <option value="MBBS / Medical Degree">MBBS / Medical Degree</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* 7 & 8. Residential Address & Postal Code */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center">
                  <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                  Address Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 7. Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      7. Full Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House No, Street, Sector / Colony, City"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.address ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.address && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.address}</p>}
                  </div>

                  {/* 8. Postal Code */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      8. Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="e.g. 44000"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.postalCode ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.postalCode && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>

              {/* 9 & 10. CNIC Front & Back Document Uploads */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
                    <ImageIcon className="w-4 h-4 text-blue-600 mr-2" />
                    CNIC Documents (Mandatory)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">PNG, JPG, JPEG up to 5MB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* 9. CNIC Front Image */}
                  <div className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
                    errors.cnicFront ? 'border-red-400 bg-red-50/20' : 'border-slate-300 bg-slate-50/60 hover:border-blue-400'
                  }`}>
                    <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>9. CNIC Front Image <span className="text-red-500">*</span></span>
                      <button
                        type="button"
                        onClick={() => handleUseSampleImage('cnicFront')}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer font-semibold"
                      >
                        Use Sample Front
                      </button>
                    </label>

                    {formData.cnicFrontPreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-900 flex items-center justify-center">
                        <img
                          src={formData.cnicFrontPreview}
                          alt="CNIC Front Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, cnicFront: null, cnicFrontPreview: '' }))}
                          className="absolute top-2 right-2 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 cursor-pointer text-center p-4">
                        <Upload className="w-7 h-7 text-blue-600 mb-1" />
                        <span className="text-xs font-bold text-slate-700">Click to Upload CNIC Front</span>
                        <span className="text-[10px] text-slate-400">or drag file here</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'cnicFront')}
                          className="hidden"
                        />
                      </label>
                    )}
                    {errors.cnicFront && <p className="text-[11px] text-red-600 mt-1.5 font-semibold">{errors.cnicFront}</p>}
                  </div>

                  {/* 10. CNIC Back Image */}
                  <div className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
                    errors.cnicBack ? 'border-red-400 bg-red-50/20' : 'border-slate-300 bg-slate-50/60 hover:border-blue-400'
                  }`}>
                    <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>10. CNIC Back Image <span className="text-red-500">*</span></span>
                      <button
                        type="button"
                        onClick={() => handleUseSampleImage('cnicBack')}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer font-semibold"
                      >
                        Use Sample Back
                      </button>
                    </label>

                    {formData.cnicBackPreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-900 flex items-center justify-center">
                        <img
                          src={formData.cnicBackPreview}
                          alt="CNIC Back Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, cnicBack: null, cnicBackPreview: '' }))}
                          className="absolute top-2 right-2 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 cursor-pointer text-center p-4">
                        <Upload className="w-7 h-7 text-blue-600 mb-1" />
                        <span className="text-xs font-bold text-slate-700">Click to Upload CNIC Back</span>
                        <span className="text-[10px] text-slate-400">or drag file here</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'cnicBack')}
                          className="hidden"
                        />
                      </label>
                    )}
                    {errors.cnicBack && <p className="text-[11px] text-red-600 mt-1.5 font-semibold">{errors.cnicBack}</p>}
                  </div>

                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I solemnly declare that all 10 fields and CNIC document images provided above are genuine, accurate, and complete.
                  </span>
                </label>
                {errors.agreedToTerms && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.agreedToTerms}</p>}
              </div>

              {/* Step 1 Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <span>Next: Payment & Final Submission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          ) : (

            /* ========================================================================= */
            /* STEP 2: PAYMENT & FINAL SUBMISSION */
            /* ========================================================================= */
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              
              {/* Step 2 Banner */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-950">
                  <Wallet className="w-5 h-5 text-amber-600 shrink-0" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">
                    Step 2 of 2: Application Fee Payment & Screenshot Submission
                  </h4>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Please deposit the processing fee of <strong>Rs. {settings.applicationFee}</strong> to either JazzCash or Easypaisa account below, then upload your payment screenshot to finalize application.
                </p>
              </div>

              {/* Fee & Accounts Info Box */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Official Application Fee
                  </span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    Rs. {settings.applicationFee}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* JazzCash Info */}
                  <div className="bg-slate-800/90 p-4 rounded-xl border border-red-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">
                        1. JazzCash Account
                      </span>
                      <span className="text-[9px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30">
                        JazzCash
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">Account Title: <strong className="text-white">{settings.jazzCashAccountName}</strong></div>
                      <div className="text-base font-bold text-white font-mono tracking-wider">{settings.jazzCashAccountNumber}</div>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Send Rs. {settings.applicationFee} via JazzCash app or *786# to account number above.
                    </p>
                  </div>

                  {/* Easypaisa Info */}
                  <div className="bg-slate-800/90 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                        2. Easypaisa Account
                      </span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                        Easypaisa
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">Account Title: <strong className="text-white">{settings.easyPaisaAccountName}</strong></div>
                      <div className="text-base font-bold text-white font-mono tracking-wider">{settings.easyPaisaAccountNumber}</div>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Send Rs. {settings.applicationFee} via Easypaisa app or *786# to account number above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot Upload Box (MANDATORY REQUIREMENT) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
                    <ImageIcon className="w-4 h-4 text-emerald-600 mr-2" />
                    Payment Screenshot Upload <span className="text-red-500 font-bold ml-1">* (Required)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleUseSampleImage('paymentProof')}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer font-bold"
                  >
                    Use Sample Screenshot
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
                  errors.paymentProof ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-slate-50/60 hover:border-emerald-500'
                }`}>
                  {formData.paymentProofPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-44 bg-slate-900 flex items-center justify-center">
                      <img
                        src={formData.paymentProofPreview}
                        alt="Payment Proof Screenshot Preview"
                        className="w-full h-full object-contain bg-slate-950"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, paymentProof: null, paymentProofPreview: '' }))}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 cursor-pointer text-center p-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Click to Upload Payment Screenshot</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Attach JazzCash or Easypaisa transaction slip image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'paymentProof')}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.paymentProof && (
                    <div className="flex items-center space-x-1.5 mt-2 text-red-600 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.paymentProof}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2 Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setErrors({});
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 1 (Edit Info)</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Payment & Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
