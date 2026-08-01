import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, MapPin, DollarSign, Calendar, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Job, JobSector, JobType, QualificationLevel } from '../types';
import { POPULAR_CATEGORIES } from '../data/mockJobs';

interface AddEditJobModalProps {
  isOpen: boolean;
  jobToEdit?: Job | null;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

const PAKISTAN_CITIES = [
  'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Peshawar', 
  'Quetta', 'Multan', 'Faisalabad', 'Sialkot', 'Gujranwala', 
  'Bahawalpur', 'Hyderabad', 'Sukkur', 'Abbottabad', 'Sargodha', 'Mardan'
];

export const AddEditJobModal: React.FC<AddEditJobModalProps> = ({
  isOpen,
  jobToEdit,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(jobToEdit);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    categorySlug: 'government',
    category: 'Government Jobs',
    sector: 'Government' as JobSector,
    jobType: 'Full Time' as JobType,
    city: 'Lahore',
    location: 'Lahore, Pakistan',
    minSalary: 75000,
    salaryRange: 'Rs 75,000 - Rs 100,000 / month',
    experience: '1-3 Years Experience Required',
    qualification: 'Bachelor (BS/BA)' as QualificationLevel,
    vacancies: 15,
    postedDate: new Date().toISOString().split('T')[0],
    deadline: '2026-08-30',
    description: '',
    responsibilitiesText: '',
    requirementsText: '',
    benefitsText: 'Competitive Salary Package (in PKR)\nMedical Allowance & Health Coverage\nAnnual Paid Leaves',
    howToApply: 'Submit your online application through the Jobs Portal before deadline.',
    contactEmail: 'recruitment@jobshub.pk',
    contactPhone: '+92 (042) 111-786-000',
    address: 'Main Boulevard, Lahore, Pakistan',
    isFeatured: false,
    isUrgent: false,
    isVerified: true,
  });

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        department: jobToEdit.department || '',
        categorySlug: jobToEdit.categorySlug || 'government',
        category: jobToEdit.category || 'Government Jobs',
        sector: jobToEdit.sector || 'Government',
        jobType: jobToEdit.jobType || 'Full Time',
        city: jobToEdit.city || 'Lahore',
        location: jobToEdit.location || 'Lahore, Pakistan',
        minSalary: jobToEdit.minSalary || 75000,
        salaryRange: jobToEdit.salaryRange || 'Rs 75,000 - Rs 100,000 / month',
        experience: jobToEdit.experience || '1-3 Years Experience Required',
        qualification: jobToEdit.qualification || 'Bachelor (BS/BA)',
        vacancies: jobToEdit.vacancies || 15,
        postedDate: jobToEdit.postedDate || new Date().toISOString().split('T')[0],
        deadline: jobToEdit.deadline || '2026-08-30',
        description: jobToEdit.description || '',
        responsibilitiesText: jobToEdit.responsibilities ? jobToEdit.responsibilities.join('\n') : '',
        requirementsText: jobToEdit.requirements ? jobToEdit.requirements.join('\n') : '',
        benefitsText: jobToEdit.benefits ? jobToEdit.benefits.join('\n') : '',
        howToApply: jobToEdit.howToApply || '',
        contactEmail: jobToEdit.contactEmail || '',
        contactPhone: jobToEdit.contactPhone || '',
        address: jobToEdit.address || '',
        isFeatured: Boolean(jobToEdit.isFeatured),
        isUrgent: Boolean(jobToEdit.isUrgent),
        isVerified: true,
      });
    }
  }, [jobToEdit]);

  if (!isOpen) return null;

  const handleCategoryChange = (slug: string) => {
    const found = POPULAR_CATEGORIES.find((c) => c.slug === slug);
    setFormData((prev) => ({
      ...prev,
      categorySlug: slug,
      category: found ? found.name : slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const responsibilities = formData.responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const requirements = formData.requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefits = formData.benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const formattedSalary = `Rs ${Number(formData.minSalary).toLocaleString()} - Rs ${Math.round(Number(formData.minSalary) * 1.35).toLocaleString()} / month`;

    const payload = {
      ...(jobToEdit ? { id: jobToEdit.id } : {}),
      title: formData.title,
      department: formData.department,
      companyLogo: jobToEdit?.companyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=160&q=80',
      category: formData.category,
      categorySlug: formData.categorySlug,
      sector: formData.sector,
      jobType: formData.jobType,
      city: formData.city,
      location: `${formData.city}, Pakistan`,
      minSalary: Number(formData.minSalary),
      salaryRange: formattedSalary,
      experience: formData.experience,
      qualification: formData.qualification,
      vacancies: Number(formData.vacancies),
      availableSeats: Number(formData.vacancies),
      postedDate: formData.postedDate,
      deadline: formData.deadline,
      description: formData.description || `Official vacancy announcement for ${formData.title} at ${formData.department}. Eligible candidates from across Pakistan are invited to apply.`,
      responsibilities: responsibilities.length > 0 ? responsibilities : [
        `Execute daily ${formData.title} operations according to department standards.`,
        `Maintain operational logs and report progress to department supervisor.`
      ],
      requirements: requirements.length > 0 ? requirements : [
        `Minimum ${formData.qualification} degree from an HEC recognized institution.`,
        `Relevant professional experience in similar capacity.`
      ],
      benefits: benefits.length > 0 ? benefits : ['Competitive Salary in PKR', 'Medical & Annual Bonus'],
      howToApply: formData.howToApply || `Submit application online via JobsHub portal before ${formData.deadline}.`,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: `${formData.department} HQ, ${formData.city}, Pakistan`,
      isFeatured: formData.isFeatured,
      isUrgent: formData.isUrgent,
      isVerified: true,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              Admin Portal • Job Management
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {isEditing ? 'Edit Job Vacancy' : 'Add New Job Vacancy'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Assistant Director (BPS-17)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Department / Company *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Federal Board of Revenue (FBR)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Job Category *
              </label>
              <select
                value={formData.categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {POPULAR_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sector *
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value as JobSector })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Semi-Government">Semi-Government</option>
                <option value="Multinational">Multinational</option>
                <option value="NGO">NGO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Job Type *
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Minimum Salary (PKR) *
              </label>
              <input
                type="number"
                min={25000}
                step={5000}
                required
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Available Vacancies *
              </label>
              <input
                type="number"
                min={1}
                max={200}
                required
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Required Qualification *
              </label>
              <select
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value as QualificationLevel })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Job Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide job details, scope, and key objectives..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={3}
              value={formData.responsibilitiesText}
              onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
              placeholder="e.g. Manage administrative workflow&#10;Coordinate with regional offices&#10;Maintain daily departmental records"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Eligibility Requirements (One per line)
            </label>
            <textarea
              rows={3}
              value={formData.requirementsText}
              onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
              placeholder="e.g. Minimum 16 years education in relevant field&#10;Valid CNIC and Pakistan domicile&#10;Proven experience in similar role"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">Feature on Homepage</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-800">Mark as Urgent Vacancy</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {isEditing ? 'Update Job Vacancy' : 'Publish Job Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
