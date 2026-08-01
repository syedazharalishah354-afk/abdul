-- =========================================================================
-- JOBSHUB OFFICIAL - COMPLETE SUPABASE DATABASE SCHEMA & RLS SECURITY POLICIES
-- Paste this entire file into the Supabase SQL Editor and click "Run"
-- =========================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT,
  title TEXT NOT NULL,
  company_name TEXT DEFAULT 'JobsHub Official',
  department TEXT NOT NULL,
  company_logo TEXT DEFAULT 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
  sector TEXT NOT NULL DEFAULT 'Government',
  job_type TEXT NOT NULL DEFAULT 'Full Time',
  location TEXT NOT NULL DEFAULT 'Pakistan',
  city TEXT NOT NULL DEFAULT 'Islamabad',
  salary TEXT DEFAULT 'Rs. 75,000 - 120,000',
  salary_range TEXT NOT NULL DEFAULT 'Rs. 75,000 - 120,000',
  min_salary INT NOT NULL DEFAULT 75000,
  experience TEXT NOT NULL DEFAULT '1 - 3 Years',
  qualification TEXT NOT NULL DEFAULT 'Bachelor (BS/BA)',
  vacancies INT NOT NULL DEFAULT 10,
  available_seats INT NOT NULL DEFAULT 10,
  application_deadline DATE,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  deadline DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  status TEXT DEFAULT 'Active',
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  category TEXT NOT NULL DEFAULT 'General',
  category_slug TEXT NOT NULL DEFAULT 'general',
  description TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  how_to_apply TEXT DEFAULT 'Apply online through JobsHub Official Portal.',
  contact_email TEXT DEFAULT 'info@jobshub.pk',
  contact_phone TEXT DEFAULT '+92-51-111-562-748',
  address TEXT DEFAULT 'JobsHub Recruitment HQ, Blue Area, Islamabad',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id TEXT,
  tracking_id TEXT UNIQUE NOT NULL,
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  department TEXT,
  category TEXT,
  category_slug TEXT,
  full_name TEXT,
  applicant_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  cnic TEXT NOT NULL,
  mobile TEXT,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  qualification TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  applied_date TEXT NOT NULL,
  application_status TEXT DEFAULT 'Pending',
  status TEXT NOT NULL DEFAULT 'Pending',
  payment_status TEXT DEFAULT 'Completed',
  application_fee INT DEFAULT 499,
  cnic_front_url TEXT,
  cnic_front_preview TEXT,
  cnic_back_url TEXT,
  cnic_back_preview TEXT,
  payment_screenshot_url TEXT,
  payment_proof_preview TEXT,
  resume_file_name TEXT,
  cover_note TEXT,
  rejection_reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATION DOCUMENTS TABLE (Supporting Table)
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- e.g., 'CNIC Front', 'CNIC Back'
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENT PROOFS TABLE (Supporting Table)
CREATE TABLE IF NOT EXISTS public.payment_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  screenshot_url TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Completed',
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  website_name TEXT NOT NULL DEFAULT 'JobsHub Official',
  whatsapp_number TEXT NOT NULL DEFAULT '+923001234567',
  whatsapp_link TEXT DEFAULT 'https://wa.me/923001234567',
  jazzcash_name TEXT DEFAULT 'JobsHub Official Portal',
  jazzcash_number TEXT DEFAULT '0300-1234567',
  jazz_cash_account_name TEXT NOT NULL DEFAULT 'JobsHub Official Portal',
  jazz_cash_account_number TEXT NOT NULL DEFAULT '0300-1234567',
  easypaisa_name TEXT DEFAULT 'JobsHub Official Portal',
  easypaisa_number TEXT DEFAULT '0312-9876543',
  easy_paisa_account_name TEXT NOT NULL DEFAULT 'JobsHub Official Portal',
  easy_paisa_account_number TEXT NOT NULL DEFAULT '0312-9876543',
  application_fee INT NOT NULL DEFAULT 499,
  contact_email TEXT DEFAULT 'info@jobshub.pk',
  website_address TEXT DEFAULT 'JobsHub HQ, Blue Area, Islamabad',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings record
INSERT INTO public.site_settings (
  id, website_name, whatsapp_number, whatsapp_link, 
  jazzcash_name, jazzcash_number, jazz_cash_account_name, jazz_cash_account_number, 
  easypaisa_name, easypaisa_number, easy_paisa_account_name, easy_paisa_account_number, 
  application_fee, contact_email, website_address
)
VALUES (
  1, 'JobsHub Official', '+923001234567', 'https://wa.me/923001234567',
  'JobsHub Official Portal', '0300-1234567', 'JobsHub Official Portal', '0300-1234567',
  'JobsHub Official Portal', '0312-9876543', 'JobsHub Official Portal', '0312-9876543',
  499, 'info@jobshub.pk', 'JobsHub HQ, Blue Area, Islamabad'
)
ON CONFLICT (id) DO NOTHING;

-- 7. ADMIN USERS / CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL DEFAULT 'umar',
  password_hash TEXT NOT NULL DEFAULT '3430f8c85777dfdbf5159fbe9f97205ed8d21b7964b4c7595ca2a1882ff57aa4', -- SHA-256 for 'Sho2026@'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id INT PRIMARY KEY DEFAULT 1,
  username TEXT NOT NULL DEFAULT 'umar',
  password_hash TEXT NOT NULL DEFAULT '3430f8c85777dfdbf5159fbe9f97205ed8d21b7964b4c7595ca2a1882ff57aa4', -- SHA-256 for 'Sho2026@'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial admin credentials record
INSERT INTO public.admin_credentials (id, username, password_hash)
VALUES (1, 'umar', '3430f8c85777dfdbf5159fbe9f97205ed8d21b7964b4c7595ca2a1882ff57aa4')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_users (username, password_hash)
VALUES ('umar', '3430f8c85777dfdbf5159fbe9f97205ed8d21b7964b4c7595ca2a1882ff57aa4')
ON CONFLICT (username) DO NOTHING;

-- 8. INDEXES
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category_slug);
CREATE INDEX IF NOT EXISTS idx_applications_tracking ON public.applications(tracking_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Jobs" ON public.jobs;
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Insert Applications" ON public.applications;
DROP POLICY IF EXISTS "Allow All Jobs Operations" ON public.jobs;
DROP POLICY IF EXISTS "Allow All Applications Operations" ON public.applications;
DROP POLICY IF EXISTS "Allow All Settings Operations" ON public.site_settings;
DROP POLICY IF EXISTS "Allow All Admin Creds Operations" ON public.admin_credentials;
DROP POLICY IF EXISTS "Allow All Admin Users Operations" ON public.admin_users;

-- Public read access
CREATE POLICY "Public Read Jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Public insert access for applications & documents
CREATE POLICY "Public Insert Applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Documents" ON public.application_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Payment Proofs" ON public.payment_proofs FOR INSERT WITH CHECK (true);

-- Allow full permissions for API / Admin Dashboard
CREATE POLICY "Allow All Jobs Operations" ON public.jobs FOR ALL USING (true);
CREATE POLICY "Allow All Applications Operations" ON public.applications FOR ALL USING (true);
CREATE POLICY "Allow All Documents Operations" ON public.application_documents FOR ALL USING (true);
CREATE POLICY "Allow All Payment Proofs Operations" ON public.payment_proofs FOR ALL USING (true);
CREATE POLICY "Allow All Settings Operations" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Allow All Admin Creds Operations" ON public.admin_credentials FOR ALL USING (true);
CREATE POLICY "Allow All Admin Users Operations" ON public.admin_users FOR ALL USING (true);

-- 10. STORAGE BUCKETS SETUP FOR DOCUMENTS & SCREENSHOTS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cnic-documents', 'cnic-documents', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Storage Select CNIC" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert CNIC" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Select Payment" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert Payment" ON storage.objects;

CREATE POLICY "Public Storage Select CNIC" ON storage.objects FOR SELECT USING (bucket_id = 'cnic-documents');
CREATE POLICY "Public Storage Insert CNIC" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cnic-documents');

CREATE POLICY "Public Storage Select Payment" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs');
CREATE POLICY "Public Storage Insert Payment" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');
