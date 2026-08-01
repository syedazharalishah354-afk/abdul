import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Building2
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { formatWhatsAppUrl, formatPhoneDisplay } from '../data/dataStore';

export const ContactWhatsAppSection: React.FC = () => {
  const settings = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Application Query',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setSubmitted(true);
  };

  const handleWhatsAppClick = (topic: string) => {
    const text = `Hello ${settings.websiteName || 'JobsHub Official'} Helpdesk, I have a query regarding: ${topic}`;
    const url = formatWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100/80 px-3 py-1 rounded-full">
            Official Support Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact & WhatsApp Helpdesk
          </h1>
          <p className="text-sm text-slate-500">
            Have questions regarding CNIC slip generation, recruitment eligibility, or employer vacancy postings? Our support team is here to assist.
          </p>
        </div>

        {/* Highlighted WhatsApp Card */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100">
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Instant Support via WhatsApp Official</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Connect Directly on WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Get instant candidate support regarding CNIC front/back upload issues, slip print verification, or interview schedules. Operating Mon-Sat (9:00 AM - 6:00 PM).
            </p>
          </div>

          <div className="shrink-0 flex flex-col space-y-2 w-full md:w-auto">
            <button
              onClick={() => handleWhatsAppClick('General Candidate Support')}
              className="px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span>Chat on WhatsApp Now</span>
            </button>
            <span className="text-[11px] text-emerald-200 text-center font-medium">
              Official WhatsApp: {formatPhoneDisplay(settings.whatsappNumber)}
            </span>
          </div>
        </div>

        {/* Contact Form & Office Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Office & Helpdesk Details Column */}
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center">
                <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                Head Secretariat Office
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">JobsHub Official Tower</strong>
                    <span>Plot 12-A, Mauve Area, Sector G-8/1, Islamabad, Pakistan</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-800 block">UAN Helpline:</strong>
                    <span>+92 (51) 111-562-748</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-800 block">Official Support Email:</strong>
                    <span>support@jobshub-official.pk</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-800 block">Working Hours:</strong>
                    <span>Monday to Saturday: 9:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Topics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Quick WhatsApp Topics
              </h3>

              <div className="space-y-2">
                {[
                  'CNIC Upload / Document Error',
                  'Track Application Slip Status',
                  'Employer / Post a Job Request',
                  'Report Fake Job Listing',
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleWhatsAppClick(topic)}
                    className="w-full text-left p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{topic}</span>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
              
              <h3 className="text-lg font-extrabold text-slate-900 pb-2 border-b border-slate-100 mb-6">
                Send an Official Support Message
              </h3>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-bold text-emerald-950">Inquiry Message Received!</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you for contacting JobsHub Official. A support officer will review your query and respond via email or mobile within 24 working hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Usman Ahmed"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="usman@example.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="0300-1234567"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Inquiry Subject Category
                      </label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Application Query">Application Slip Query</option>
                        <option value="CNIC Image Issue">CNIC Upload Issue</option>
                        <option value="Employer Posting">Employer Vacancy Posting</option>
                        <option value="Feedback">Feedback / Website Report</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed Query / Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Please describe your issue or question in detail..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry Message</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
