import { Job, JobCategory, QualificationLevel, JobSector, JobType } from '../types';

interface CategoryConfig {
  slug: string;
  name: string;
  iconName: string;
  description: string;
  targetCount: number; // Strictly between 50 and 150
  baseTitles: string[];
  seniorities: string[];
  wings: string[];
  departments: string[];
  logos: string[];
  sectors: JobSector[];
  jobTypes: JobType[];
  qualifications: QualificationLevel[];
  minSalaries: number[];
  descriptions: string[];
}

const PAKISTAN_CITIES = [
  'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Peshawar', 
  'Quetta', 'Multan', 'Faisalabad', 'Sialkot', 'Gujranwala', 
  'Bahawalpur', 'Hyderabad', 'Sukkur', 'Abbottabad', 'Sargodha', 'Mardan'
];

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: 'private',
    name: 'Private Jobs',
    iconName: 'Building2',
    description: 'Corporate enterprises, private firms, software houses & commercial business vacancies',
    targetCount: 150, // 150 Unique Private Jobs
    baseTitles: [
      'Operations Manager', 'Corporate Sales Executive', 'Business Development Manager',
      'Human Resources Lead', 'Key Account Manager', 'Supply Chain Analyst',
      'Finance & Tax Consultant', 'Marketing Specialist', 'Customer Success Lead',
      'Procurement Manager', 'Brand Executive', 'Office Admin Manager',
      'Commercial Lease Officer', 'Logistics Supervisor', 'Internal Audit Officer',
      'Talent Acquisition Officer', 'Digital Strategy Consultant', 'Legal Executive',
      'Regional Distribution Lead', 'Risk & Credit Analyst', 'E-Commerce Operations Lead',
      'Strategic Sourcing Lead', 'Public Relations Manager', 'Financial Planning Specialist'
    ],
    seniorities: ['Senior', 'Lead', 'Chief', 'Junior', 'Associate', 'Principal', 'Executive', 'Head of', 'Assistant'],
    wings: ['Commercial Division', 'Corporate HQ', 'Export Wing', 'Regional Hub', 'Strategy Unit', 'Northern Zone', 'Central Branch', 'International Operations'],
    departments: [
      'Interloop Corporate Services Ltd.', 'Engro Holdings Pakistan', 'Nishat Mills Group',
      'Descon Engineering Corporate', 'Lucky Core Industries', 'Packages Group Pakistan',
      'Systems Corporate Services', 'Hub Power Enterprise', 'Fatima Group Ltd.',
      'Shan Foods Commercial Division', 'Treet Corporation', 'Ibrahim Fibres Ltd.',
      'Orient Electronics Corporate', 'Master Group Enterprises', 'Servis Industries Ltd.'
    ],
    logos: [
      'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Private', 'Multinational'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['Bachelor (BS/BA)', 'Master (MS/MA)'],
    minSalaries: [75000, 95000, 120000, 150000, 180000, 220000, 250000],
    descriptions: [
      'Responsible for managing corporate operational workflows, leading functional teams, and driving business KPIs.',
      'Execute strategic client acquisition, lead key commercial contracts, and optimize revenue streams.',
      'Lead cross-functional department initiatives, conduct strategic reviews, and optimize enterprise supply chain logistics.'
    ]
  },
  {
    slug: 'government',
    name: 'Government Jobs',
    iconName: 'Landmark',
    description: 'Federal ministries, provincial departments, FPSC, PPSC & autonomous bodies (BPS-01 to BPS-20)',
    targetCount: 145, // 145 Unique Government Jobs
    baseTitles: [
      'Assistant Director (BPS-17)', 'Senior Auditor (BPS-16)', 'Tehsildar / Revenue Officer',
      'Section Officer (BPS-17)', 'Deputy District Officer', 'Statistical Officer (BPS-16)',
      'Sub-Inspector Customs (BPS-14)', 'Assistant Executive Engineer (BPS-17)', 'Computer Operator (BPS-12)',
      'Town Planning Inspector (BPS-14)', 'Accounts Officer (BPS-17)', 'Superintendent (BPS-16)',
      'Planning & Development Officer', 'Research Officer (BPS-17)', 'Protocol Officer (BPS-16)',
      'Assistant Registrar (BPS-17)', 'Land Record Inspector', 'Budget Officer (BPS-17)',
      'Estate Officer (BPS-16)', 'Public Relations Officer (BPS-17)', 'Administrative Officer (BPS-17)'
    ],
    seniorities: ['Provincial', 'Federal', 'District', 'Chief', 'Deputy', 'Assistant', 'Zonal', 'Regional'],
    wings: ['Administration Directorate', 'Secretariat Wing', 'Finance & Audit Cell', 'Planning & Development Wing', 'Revenue & Land Directorate', 'Public Works Wing'],
    departments: [
      'Federal Public Service Commission (FPSC)', 'Punjab Public Service Commission (PPSC)',
      'Federal Board of Revenue (FBR)', 'Ministry of Planning & Development',
      'Excise, Taxation & Narcotics Control', 'National Accountability Bureau (NAB)',
      'Sindh Public Service Commission (SPSC)', 'KPK Public Service Commission (KPPSC)',
      'Ministry of Foreign Affairs (MOFA)', 'Capital Development Authority (CDA)',
      'Pakistan Public Works Department (Pak PWD)', 'National Highway Authority (NHA)'
    ],
    logos: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government', 'Semi-Government'],
    jobTypes: ['Full Time'],
    qualifications: ['Bachelor (BS/BA)', 'Master (MS/MA)', 'Intermediate / FSc'],
    minSalaries: [65000, 85000, 110000, 135000, 160000, 190000],
    descriptions: [
      'Government vacant post recruitment through public sector competitive exams under standard BPS salary scales.',
      'Public office administration position responsible for provincial governance, policy implementation, and regulatory compliance.'
    ]
  },
  {
    slug: 'technical',
    name: 'Technical Jobs',
    iconName: 'Wrench',
    description: 'DAE diploma holders, electricians, mechanical supervisors, HVAC technicians & lab operators',
    targetCount: 125, // 125 Unique Technical Jobs
    baseTitles: [
      'Electrical Supervisor (DAE)', 'HVAC & Refrigeration Tech', 'Mechanical Maintenance Fitter',
      'Solar Systems Engineer', 'Auto Electrician Tech', 'Plumbing & Piping Supervisor',
      'Elevator & Escalator Tech', 'Generator & Power Fitter', 'Telecom Fiber Optic Splicer',
      'Instrument & Automation Tech', 'Welding & Fabrication Specialist', 'Building Maintenance Electrician',
      'Substation Electrical Operator', 'CCTV & Security Tech Specialist', 'Diesel Engine Fitter',
      'RO Plant Water Treatment Tech', 'Air Conditioner Maintenance Tech', 'Transformer Testing Tech'
    ],
    seniorities: ['Senior', 'Lead', 'Head', 'Junior', 'Chief', 'Master', 'Assistant', 'Field'],
    wings: ['Power Distribution Wing', 'Grid Operations', 'Industrial Maintenance Unit', 'Field Engineering Wing', 'Quality & Calibration Cell'],
    departments: [
      'LESCO Electrical Department', 'KElectric Karachi Grid', 'SUI Northern Gas Pipelines (SNGPL)',
      'WAPDA Power House', 'Atlas Honda Technical Wing', 'PEL Appliances Engineering',
      'Orient Electronics Technical', 'Siemens Pakistan Industrial', 'Faysal Power Engineering'
    ],
    logos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Private', 'Semi-Government', 'Government'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['DAE / Diploma', 'Matriculation', 'Intermediate / FSc'],
    minSalaries: [42000, 56000, 72000, 90000, 115000, 135000],
    descriptions: [
      'Technical hands-on vacancy for diploma holders (DAE) specializing in electrical circuits, mechanical fittings, or HVAC maintenance.',
      'Diagnose technical equipment faults, execute preventive maintenance schedules, read electrical schematics, and repair machinery.'
    ]
  },
  {
    slug: 'factory',
    name: 'Factory Jobs',
    iconName: 'Factory',
    description: 'Manufacturing plants, textile mills, production lines, assembly & industrial units',
    targetCount: 120, // 120 Unique Factory Jobs
    baseTitles: [
      'Production Supervisor', 'Quality Control Inspector (QC)', 'Plant Maintenance Electrician',
      'Textile Weaving Master', 'Assembly Line Incharge', 'Industrial Boiler Operator',
      'CNC Machine Operator', 'Warehouse Logistics Supervisor', 'Chemical Plant Operator',
      'Safety & EHS Officer', 'Packaging Line Lead', 'Spinning Mill Shift Incharge',
      'Tool & Die Technician', 'Plastics Injection Operator', 'Pharma Production Assistant',
      'Machine Maintenance Fitter', 'Forklift & Crane Driver', 'Industrial Inventory Storekeeper'
    ],
    seniorities: ['Shift Lead', 'Plant Manager', 'Senior Supervisor', 'Assistant', 'Unit Incharge', 'Chief Technician'],
    wings: ['Assembly Line A', 'Textile Weaving Wing', 'Chemical Processing Unit', 'Packaging Division', 'Heavy Machinery Yard'],
    departments: [
      'Packages Limited Industrial Unit', 'Nishat Textile Mills Ltd.', 'Dawlance Appliance Factory',
      'Millat Tractors Manufacturing', 'Ghani Glass Industries', 'Universal Chemical Works',
      'Sitara Chemical Industries', 'Artistic Fabric Mills', 'Fazal Cloth Mills'
    ],
    logos: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Private', 'Semi-Government'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['DAE / Diploma', 'Matriculation', 'Intermediate / FSc'],
    minSalaries: [40000, 50000, 65000, 80000, 95000, 110000],
    descriptions: [
      'Oversee factory production shift operations, machinery upkeep, quality control checks, and worker safety.',
      'Manage assembly workflow, inspect raw materials, and maintain daily manufacturing quota outputs.'
    ]
  },
  {
    slug: 'it',
    name: 'IT Jobs',
    iconName: 'Code',
    description: 'Software engineering, full-stack development, mobile apps, devops, AI & network architecture',
    targetCount: 115, // 115 Unique IT Jobs
    baseTitles: [
      'React & Node.js Developer', 'Full Stack MERN Lead Engineer', 'DevOps & AWS Cloud Engineer',
      'Python AI / ML Specialist', 'Android & iOS Flutter Developer', 'Cyber Security Analyst',
      'Database Administrator (SQL)', 'Frontend UI/UX React Engineer', 'PHP & Laravel Developer',
      'QA Automation Test Engineer', 'System & Network Administrator', 'Golang Backend Engineer',
      'Data Engineer (Spark/ETL)', 'Salesforce CRM Developer', 'Java Spring Boot Architect',
      'Scrum Master & Agile PM', 'Embedded IoT Software Engineer', 'Vue.js & Nuxt Frontend Lead'
    ],
    seniorities: ['Senior', 'Lead', 'Staff', 'Principal', 'Junior', 'Architect', 'Associate', 'Engineering Manager'],
    wings: ['Cloud Solutions', 'Enterprise Software', 'Mobile App Division', 'AI Innovations Lab', 'Cyber Defense Unit'],
    departments: [
      'Systems Limited Pakistan', 'Contour Software Pakistan', 'Arbisoft Lahore',
      'NetSol Technologies', '10Pointers Software Enterprise', 'DevsInc IT Solutions',
      'Techlogix Pakistan', '10Pearls Karachi', 'Confiz Solutions'
    ],
    logos: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Private', 'Multinational'],
    jobTypes: ['Full Time', 'Remote', 'Contract'],
    qualifications: ['Bachelor (BS/BA)', 'Master (MS/MA)', 'DAE / Diploma'],
    minSalaries: [85000, 120000, 170000, 230000, 320000, 400000],
    descriptions: [
      'Design, engineer, test, and deploy software applications, cloud microservices, database queries, and web UI interfaces.',
      'Build scalable web and mobile software products using modern technology stacks, git workflows, and CI/CD automation.'
    ]
  },
  {
    slug: 'hospital',
    name: 'Hospital Jobs',
    iconName: 'Hospital',
    description: 'Nursing staff, ward attendants, hospital administrative officers, pharmacists & lab techs',
    targetCount: 110, // 110 Unique Hospital Jobs
    baseTitles: [
      'Charge Nurse (BPS-16)', 'Head Nurse (BPS-17)', 'Hospital Pharmacist (BPS-17)',
      'Laboratory Technologist (BPS-16)', 'Radiology Technician', 'ICU Ward Attendant',
      'Hospital Administrative Officer', 'Operation Theater Tech (OT)', 'Physiotherapist',
      'Dialysis Technician', 'Medical Record Officer', 'Patient Care Coordinator',
      'Blood Bank Officer', 'Infection Control Specialist', 'Hospital Bio-Medical Engineer',
      'Echo & ECG Technician', 'Emergency Ward Supervisor', 'Hospital Store Officer'
    ],
    seniorities: ['Senior', 'Head', 'Junior', 'Incharge', 'Chief', 'Assistant', 'Clinical Lead'],
    wings: ['Emergency & Trauma Center', 'Intensive Care Unit (ICU)', 'Surgical Complex', 'Outpatient Department (OPD)', 'Diagnostic Radiology Wing'],
    departments: [
      'Mayo Hospital Lahore', 'Civil Hospital Karachi', 'Combined Military Hospital (CMH)',
      'Holy Family Hospital Rawalpindi', 'Nishtar Hospital Multan', 'Khyber Teaching Hospital',
      'Surayya Azim Hospital', 'Indus Hospital Network', 'Doctors Hospital Lahore'
    ],
    logos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government', 'Private', 'Semi-Government'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['Bachelor (BS/BA)', 'DAE / Diploma', 'Intermediate / FSc'],
    minSalaries: [50000, 70000, 90000, 115000, 140000, 170000],
    descriptions: [
      'Provide essential clinical support, patient care management, pharmacy dispensing, or diagnostic lab operations.',
      'Maintain hospital ward protocols, monitor patient vital parameters, enforce hygiene standards, and assist medical staff.'
    ]
  },
  {
    slug: 'office',
    name: 'Office Jobs',
    iconName: 'Briefcase',
    description: 'Office assistants, front desk receptionists, record keepers, HR officers & data entry',
    targetCount: 108, // 108 Unique Office Jobs
    baseTitles: [
      'Office Superintendent & Manager', 'Executive Personal Assistant (PA)', 'Front Desk Receptionist',
      'Computer Data Entry Operator', 'Record Keeper & Archivist', 'Office Admin Coordinator',
      'HR Assistant & Payroll Clerk', 'Junior Accounts Assistant', 'Office Dispatch & Courier Clerk',
      'Customer Care Office Rep', 'Billing & Invoicing Officer', 'Facility & Property Assistant',
      'Office Procurement Clerk', 'Document Verification Assistant', 'Telephone Exchange Operator',
      'Attendance & Roster Assistant', 'Inventory Office Clerk', 'Administrative Stenographer'
    ],
    seniorities: ['Senior', 'Chief', 'Junior', 'Assistant', 'Head of Admin', 'Lead Coordinator'],
    wings: ['Central Secretariat', 'Administrative Services Wing', 'Records Management Division', 'Front Desk Operations', 'HR & Payroll Cell'],
    departments: [
      'State Life Insurance Corporation', 'Pakistan Post Headquarters', 'Utility Stores Corporation',
      'National Highway Authority (NHA)', 'Pakistan Telecommunication Authority (PTA)',
      'Lahore Chamber of Commerce', 'Karachi Stock Exchange Building Admin', 'SECP Regional Office'
    ],
    logos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government', 'Private', 'Semi-Government'],
    jobTypes: ['Full Time', 'Part Time'],
    qualifications: ['Intermediate / FSc', 'Matriculation', 'Bachelor (BS/BA)'],
    minSalaries: [35000, 48000, 62000, 78000, 95000, 115000],
    descriptions: [
      'Perform clerical office tasks, computer file organization, visitor reception, administrative phone correspondence, and data logging.',
      'Maintain office files, handle inward/outward mail registers, operate MS Office tools, and assist department managers.'
    ]
  },
  {
    slug: 'suthra-punjab',
    name: 'Suthra Punjab / Cleaning Jobs',
    iconName: 'Sparkles',
    description: 'Chief Minister Suthra Punjab Initiative, LWMC, waste management & sanitation officers',
    targetCount: 105, // 105 Unique Suthra Punjab Jobs
    baseTitles: [
      'Zone Sanitation Officer', 'Waste Management Supervisor', 'Sanitary Inspector (BPS-11)',
      'Urban Cleanliness Inspector', 'Recycling & Disposal Supervisor', 'Fleet & Compactor Driver',
      'Field Enforcement Officer', 'Heavy Machinery Washer Operator', 'Sanitation Shift Lead',
      'Public Health Sanitation Officer', 'Horticulture & Green Belt Inspector', 'Municipal Waste Auditor',
      'District Environment Inspector', 'Drainage Maintenance Incharge', 'Bio-Medical Waste Handler',
      'Community Cleanliness Field Officer', 'Commercial Area Sanitation Supervisor', 'Transfer Station Incharge'
    ],
    seniorities: ['Chief Zone Lead', 'District Supervisor', 'Senior Inspector', 'Assistant', 'Zonal Incharge', 'Field Officer'],
    wings: ['CM Flagship Cleanliness Drive', 'Urban Solid Waste Unit', 'Commercial Market Sanitation Wing', 'Green Punjab Environmental Wing', 'Compactor & Heavy Fleet Depot'],
    departments: [
      'Chief Minister Suthra Punjab Program', 'Lahore Waste Management Company (LWMC)',
      'Rawalpindi Waste Management Company (RWMC)', 'Faisalabad Waste Management Company',
      'Multan Waste Management Company (MWMC)', 'Guiranwala Waste Management Company',
      'Sindh Solid Waste Management Board (SSWMB)', 'Water & Sanitation Agency (WASA)'
    ],
    logos: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1618060932014-4deda4932554?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government', 'Semi-Government'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['Matriculation', 'Intermediate / FSc', 'Bachelor (BS/BA)'],
    minSalaries: [38000, 45000, 55000, 70000, 85000, 105000],
    descriptions: [
      'Public sanitation and cleanliness campaign post under the CM Suthra Punjab flagship environmental program.',
      'Supervise municipal waste collection teams, maintain zero-waste urban zones, and monitor compactor routes.'
    ]
  },
  {
    slug: 'army',
    name: 'Army Jobs',
    iconName: 'Shield',
    description: 'Pakistan Army PMA Long Course, Commissioned Officers, Soldiers, Civilian Staff & MES',
    targetCount: 100, // 100 Unique Army Jobs
    baseTitles: [
      'PMA Long Course Officer Cadet', 'Commissioned Captain (Medical Corps)', 'Civilian Assistant (BPS-15)',
      'Soldier / Sepoy (Pak Army)', 'Military Engineer Services (MES) AE', 'Army Aviation Technician',
      'Signal Officer (BPS-17)', 'Ordnance Storekeeper (Civilian)', 'Signals Operator (BPS-12)',
      'Remount Veterinary Officer', 'Corps of EME Junior Engineer', 'Army Public School Teacher',
      'Subedar Major Administrative Assistant', 'Military Land Inspector', 'Civilian Stenotypist (BPS-14)',
      'Cavalry Armoured Specialist', 'Army Supply Chain Supervisor', 'Military Transport Officer'
    ],
    seniorities: ['Commissioned Rank', 'Civilian Cadre', 'Junior Officer', 'Subedar Rank', 'Technical Staff', 'Regimental Lead'],
    wings: ['Infantry Corps Directorate', 'Corps of Signals GHQ', 'Electrical & Mechanical Engineers (EME)', 'Military Engineer Services (MES)', 'Army Medical Corps (AMC)'],
    departments: [
      'Pakistan Army GHQ Rawalpindi', 'PMA Kakul Abbottabad', 'Military Engineer Services (MES)',
      'Corps of Electrical & Mechanical Engineers (EME)', 'Corps of Signals GHQ',
      'Army Medical Corps (AMC)', 'Army Ordnance Corps', 'Defence Officers Housing Authority'
    ],
    logos: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government'],
    jobTypes: ['Full Time'],
    qualifications: ['Intermediate / FSc', 'Bachelor (BS/BA)', 'Matriculation', 'DAE / Diploma'],
    minSalaries: [45000, 65000, 95000, 140000, 200000, 260000],
    descriptions: [
      'Official recruitment in Pakistan Armed Forces military cadre or civilian establishment under defense ministry.',
      'Serve national defense requirements, military operational logistics, technical maintenance, or administrative staff roles.'
    ]
  },
  {
    slug: 'medical',
    name: 'Medical Jobs',
    iconName: 'Stethoscope',
    description: 'Medical officers, specialist physicians, surgeons, dentists & diagnostic specialists',
    targetCount: 95, // 95 Unique Medical Jobs
    baseTitles: [
      'Medical Officer (MO BPS-17)', 'Woman Medical Officer (WMO)', 'Consultant Cardiologist',
      'General Surgeon (BPS-18)', 'Pediatrician Specialist', 'Consultant Radiologist',
      'Dental Surgeon (BPS-17)', 'Anesthesiologist Specialist', 'Consultant Neurologist',
      'Gynecologist & Obstetrician', 'Dermatologist Specialist', 'Pathologist & Lab Director',
      'Emergency Medicine Consultant', 'Consultant Ophthalmologist', 'ENT Specialist Physician',
      'Psychiatrist Specialist', 'Associate Professor Medical', 'Resident Medical Officer'
    ],
    seniorities: ['Senior Consultant', 'Assistant Professor', 'Associate Professor', 'Head of Clinical Dept', 'Resident Specialist'],
    wings: ['Clinical Cardiology Wing', 'Surgical & Operating Theatre', 'Maternal & Child Healthcare Unit', 'Emergency Diagnostic Directorate', 'Pathology & Molecular Lab'],
    departments: [
      'Punjab Health Department (PPSC)', 'Sindh Health Department', 'Primary & Secondary Healthcare',
      'Services Hospital Lahore', 'Jinnah Postgraduate Medical Centre Karachi',
      'Pakistan Institute of Medical Sciences (PIMS)', 'Shaukat Khanum Memorial Hospital',
      'Sheikh Zayed Medical Complex', 'Lady Reading Hospital Peshawar'
    ],
    logos: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government', 'Private', 'Semi-Government'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['MBBS / Medical Degree', 'Doctorate (PhD)', 'Master (MS/MA)'],
    minSalaries: [120000, 160000, 220000, 280000, 350000, 450000],
    descriptions: [
      'Provide diagnostic assessment, emergency medical treatment, outpatient clinic care, and surgical interventions.',
      'Specialist medical position requiring PMDC/PMC registration, clinical residency experience, and patient care management.'
    ]
  },
  {
    slug: 'police',
    name: 'Police Jobs',
    iconName: 'ShieldCheck',
    description: 'Punjab Police, Sindh Police, KPK Police, Islamabad Police Constables & Sub-Inspectors',
    targetCount: 90, // 90 Unique Police Jobs
    baseTitles: [
      'Sub-Inspector (BPS-14)', 'Police Constable (BPS-07)', 'Assistant Sub-Inspector (ASI BPS-11)',
      'Traffic Wardens / Officer (BPS-14)', 'Police Telecommunication Operator', 'Crime Scene Investigator',
      'Special Protection Unit (SPU) Officer', 'Police Driver Constable (BPS-07)', 'Cybercrime Analyst (FIA/Police)',
      'Counter Terrorism Department (CTD) Agent', 'Police Wireless Operator', 'Station House Clerk (Moharrir)',
      'Highways Patrol Officer', 'Dolphin Force Patrol Officer', 'Police Data Entry Operator (BPS-12)',
      'Police IT Assistant Officer', 'Forensic Laboratory Specialist', 'Elite Force Constable'
    ],
    seniorities: ['District Incharge', 'Provincial Cadre', 'Zonal Patrol Lead', 'Special Operations Unit', 'Chief Investigator'],
    wings: ['Counter Terrorism Wing (CTD)', 'Dolphin Tactical Patrol', 'Crime Investigation Department (CID)', 'Traffic Warden Directorate', 'Special Protection Unit (SPU)'],
    departments: [
      'Punjab Police Department', 'Sindh Police Central Police Office', 'KPK Police Directorate Peshawar',
      'Islamabad Capital Territory (ICT) Police', 'National Highways & Motorway Police (NHMP)',
      'Counter Terrorism Department (CTD)', 'Federal Investigation Agency (FIA)', 'Dolphin Squad Command'
    ],
    logos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government'],
    jobTypes: ['Full Time'],
    qualifications: ['Matriculation', 'Intermediate / FSc', 'Bachelor (BS/BA)'],
    minSalaries: [42000, 55000, 75000, 95000, 125000, 160000],
    descriptions: [
      'Law enforcement recruitment for maintaining public order, crime prevention, traffic control, and investigation.',
      'Patrol municipal jurisdictions, process legal FIR records, manage police station operations, and ensure public security.'
    ]
  },
  {
    slug: 'banking',
    name: 'Banking Jobs',
    iconName: 'CreditCard',
    description: 'Commercial banks, State Bank of Pakistan, microfinance institutions & cash officer roles',
    targetCount: 85, // 85 Unique Banking Jobs
    baseTitles: [
      'Branch Manager', 'Universal Cash Officer', 'Relationship Manager (Consumer Banking)',
      'Credit Risk Analyst', 'Assistant Manager Audit', 'Trade Finance Officer',
      'Islamic Banking Officer', 'Compliance & AML Analyst', 'Operations Officer',
      'Agri Finance Officer', 'Mortgage Loan Specialist', 'IT Banking Systems Auditor',
      'Digital Banking Specialist', 'Treasury Operations Senior', 'Branch Operations Manager',
      'Microfinance Credit Officer', 'Remittance Service Officer', 'Clearing & Settlement Clerk'
    ],
    seniorities: ['Senior Manager', 'Branch Head', 'Assistant Vice President (AVP)', 'Junior Officer', 'Executive Officer'],
    wings: ['Consumer & Retail Banking', 'Corporate Credit & Risk', 'Islamic Banking Division', 'Digital Banking & Mobile Wallet', 'Treasury & Forex Operations'],
    departments: [
      'National Bank of Pakistan (NBP)', 'Habib Bank Limited (HBL)', 'United Bank Limited (UBL)',
      'MCB Bank Limited', 'Meezan Bank Limited', 'State Bank of Pakistan (SBP)',
      'Bank Alfalah Limited', 'Allied Bank Limited (ABL)', 'Askari Bank Limited'
    ],
    logos: [
      'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Private', 'Government', 'Semi-Government'],
    jobTypes: ['Full Time'],
    qualifications: ['Bachelor (BS/BA)', 'Master (MS/MA)'],
    minSalaries: [55000, 75000, 100000, 140000, 190000, 250000],
    descriptions: [
      'Manage retail banking branch operations, customer accounts, cash deposits, credit verification, and financial compliance.',
      'Evaluate loan proposals, conduct risk analysis, ensure State Bank regulatory compliance, and deliver banking services.'
    ]
  },
  {
    slug: 'airport',
    name: 'Airport Jobs',
    iconName: 'PlaneTakeoff',
    description: 'Airports Security Force (ASF), Civil Aviation Authority (CAA), ground staff & baggage supervisors',
    targetCount: 80, // 80 Unique Airport Jobs
    baseTitles: [
      'ASF Corporal (BPS-07)', 'ASF Assistant Sub-Inspector (ASI BPS-11)', 'Air Traffic Controller (CAA)',
      'Airport Baggage Handling Supervisor', 'Flight Passenger Service Agent', 'Apron Ramp Operations Officer',
      'Airport Cargo Handling Inspector', 'Aero Ground Equipment Operator', 'ASF Security Officer (BPS-16)',
      'Airport VIP Lounge Supervisor', 'Aviation Flight Dispatcher', 'CAA Electronics Engineer (BPS-17)',
      'Airport Terminal Manager', 'Bird Control Specialist (CAA)', 'Airport Lost & Found Executive',
      'Flight Catering Officer', 'Airport Fire Safety Crew Lead', 'Aircraft Refueling Technician'
    ],
    seniorities: ['Terminal Chief', 'Aviation Senior Lead', 'Ground Operations Incharge', 'Station Officer', 'Ramp Supervisor'],
    wings: ['Aero Ground Handling', 'Airside Passenger Safety', 'Air Traffic Control Tower', 'Airport Security Force (ASF)', 'Cargo & Logistics Depot'],
    departments: [
      'Airports Security Force (ASF Pakistan)', 'Pakistan Civil Aviation Authority (PCAA)',
      'Allama Iqbal International Airport Lahore', 'Jinnah International Airport Karachi',
      'Islamabad International Airport (IIAP)', 'PIA Ground Handling Division'
    ],
    logos: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government', 'Semi-Government', 'Private'],
    jobTypes: ['Full Time', 'Contract'],
    qualifications: ['Matriculation', 'Intermediate / FSc', 'Bachelor (BS/BA)', 'DAE / Diploma'],
    minSalaries: [42000, 58000, 80000, 110000, 160000, 210000],
    descriptions: [
      'Aviation ground operations, passenger screening, airport security, or air traffic safety post across Pakistani airports.',
      'Ensure airport passenger safety, manage baggage logistics, inspect airside movement, and assist flight turnarounds.'
    ]
  },
  {
    slug: 'freelance',
    name: 'Freelance Jobs',
    iconName: 'Laptop',
    description: 'Remote contract jobs, digital projects, freelance development & content creation',
    targetCount: 75, // 75 Unique Freelance Jobs
    baseTitles: [
      'Remote Full Stack Developer', 'Freelance UI/UX Product Designer', 'Digital Copywriter & Content Strategist',
      'WordPress & WooCommerce Specialist', 'Freelance Graphic & Brand Designer', 'SEO & Technical Marketing Specialist',
      'Video Editor & Motion Designer', 'Python Data Scraping Engineer', 'Shopify Store Developer',
      'Social Media Ad Specialist', 'React & Next.js Freelancer', 'Virtual Assistant & Admin Specialist',
      '3D Rendering & CAD Freelancer', 'Email Marketing Strategist', 'Flutter Mobile App Developer',
      'Translation & Subtitling Expert', 'Voiceover Artist (Urdu/English)', 'Figma UI Layout Designer'
    ],
    seniorities: ['Lead Remote', 'Senior Freelance', 'Principal Digital Specialist', 'Expert Contract Specialist', 'Agency Lead'],
    wings: ['International Remote Studio', 'Digital Content Network', 'Web & Mobile Dev Lab', 'E-Commerce Growth Studio', 'Creative Brand Agency'],
    departments: [
      'Upwork Global Agency', 'Fiverr Pro Enterprise', 'Toptal Digital Network',
      'RemoteStaff Pakistan', 'DevsInc Remote Labs', 'InvoZone Global Remote',
      'CodeNinja Freelance Unit', 'Arbisoft Global Remote Services'
    ],
    logos: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Private', 'Multinational'],
    jobTypes: ['Remote', 'Contract', 'Part Time'],
    qualifications: ['Bachelor (BS/BA)', 'Intermediate / FSc', 'DAE / Diploma'],
    minSalaries: [60000, 90000, 130000, 180000, 250000, 320000],
    descriptions: [
      'Flexible remote freelance contract opportunity supporting international client deliverables and digital projects.',
      'Deliver high-quality digital assets, code repositories, or marketing campaigns with direct USD/PKR hourly payout options.'
    ]
  },
  {
    slug: 'navy',
    name: 'Navy Jobs',
    iconName: 'Anchor',
    description: 'Pakistan Navy Marine Sailors, PN Cadet Commission, Naval Engineering & Civilian Cadre',
    targetCount: 70, // 70 Unique Navy Jobs
    baseTitles: [
      'PN Cadet (Commissioned Officer)', 'Navy Marine Sailor (BPS-07)', 'Naval Mechanical Engineer',
      'Sub-Lieutenant (Executive Branch)', 'Naval Weapons Technician', 'Navy Medical Technician',
      'Civilian Technical Staff (PN Dockyard)', 'Naval Communications Officer', 'Marine Logistics Supervisor',
      'Naval Aviation Maintenance Tech', 'Hydrographic Survey Assistant', 'Naval Ordnance Storekeeper',
      'PN Ship Fitter Specialist', 'Naval Intelligence Analyst', 'Navy Steward / Supply Specialist',
      'Naval Electrical Supervisor', 'PN Dockyard Safety Inspector', 'Naval Physical Training Instructor'
    ],
    seniorities: ['Commissioned Rank', 'Civilian Cadre', 'Naval Technical Lead', 'Fleet Specialist', 'Coastal Patrol Lead'],
    wings: ['PN Dockyard Technical Wing', 'Naval Aviation Fleet', 'Hydrographic Directorate', 'Coastal Defense Command (Gwadar)', 'Naval Medical Corps'],
    departments: [
      'Pakistan Navy Headquarters Islamabad', 'PN Dockyard Karachi', 'Pakistan Naval Academy (PNA)',
      'Naval Engineering College (NUST)', 'Commander Karachi (COMKAR) Division',
      'Commander Coast (COMCOAST) Gwadar', 'Naval Logistics Depot'
    ],
    logos: [
      'https://images.unsplash.com/photo-1505672678453-9da183074514?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government'],
    jobTypes: ['Full Time'],
    qualifications: ['Intermediate / FSc', 'Bachelor (BS/BA)', 'Matriculation', 'DAE / Diploma'],
    minSalaries: [45000, 65000, 90000, 130000, 180000, 240000],
    descriptions: [
      'Defend Pakistan maritime borders and coastal waters while operating naval vessels, submarines, and dockyard facilities.',
      'Undergo specialized naval training in seamanship, marine engines, naval communications, and maritime defense.'
    ]
  },
  {
    slug: 'air-force',
    name: 'Air Force Jobs',
    iconName: 'Plane',
    description: 'Pakistan Air Force (PAF) GDP Officers, Aeronautical Engineers, Airmen & Ground Trades',
    targetCount: 65, // 65 Unique Air Force Jobs
    baseTitles: [
      'General Duty Pilot (GDP Officer)', 'Aeronautical Engineer (PAF Officers)', 'PAF Airman (Ground Trades)',
      'Air Defense Control Officer', 'PAF Security Force (Provost)', 'Logistics Officer (PAF BPS-17)',
      'Aviation Radar Technician', 'Avionics System Engineer', 'PAF Information Technology Officer',
      'Aircraft Maintenance Fitter', 'PAF Meteorological Officer', 'Fire & Rescue Specialist (PAF)',
      'PAF Medical Branch Assistant', 'Admin & Special Duties Officer', 'PAF Weapons Technician',
      'Flight Equipment Supervisor', 'PAF Supply Chain Cadet', 'Airman Physical Training Instructor'
    ],
    seniorities: ['Officer Cadre', 'Aeronautical Lead', 'Ground Trade Specialist', 'Squadron Officer', 'Air Base Lead'],
    wings: ['Fighter Aviation Squadron', 'Air Defense Operations Wing', 'Aeronautical Maintenance Division', 'Radar & Avionics Lab', 'PAF Security Provost Command'],
    departments: [
      'Pakistan Air Force (PAF) Air Headquarters', 'PAF Academy Asghar Khan Risalpur',
      'PAF Base Nur Khan Rawalpindi', 'PAF Base Shahbaz Jacobabad',
      'PAF Base Masroor Karachi', 'Pakistan Aeronautical Complex (PAC Kamra)'
    ],
    logos: [
      'https://images.unsplash.com/photo-1519074069444-1ba4eff56024?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=160&q=80'
    ],
    sectors: ['Government'],
    jobTypes: ['Full Time'],
    qualifications: ['Intermediate / FSc', 'Bachelor (BS/BA)', 'DAE / Diploma', 'Matriculation'],
    minSalaries: [50000, 75000, 110000, 160000, 240000, 300000],
    descriptions: [
      'Air defense, fighter jets maintenance, radar operations, and aerial surveillance positions in the Pakistan Air Force.',
      'Commissioned officer or airman trade post involving flight combat, engineering, air traffic control, or base security.'
    ]
  }
];

export function generateAllJobs(): { jobs: Job[]; categories: JobCategory[] } {
  const jobs: Job[] = [];
  const categoryCounts: Record<string, number> = {};

  CATEGORY_CONFIGS.forEach((cat) => {
    categoryCounts[cat.slug] = 0;
    const targetCount = cat.targetCount;

    for (let i = 1; i <= targetCount; i++) {
      const baseTitle = cat.baseTitles[(i - 1) % cat.baseTitles.length];
      const seniority = cat.seniorities[Math.floor((i - 1) / cat.baseTitles.length) % cat.seniorities.length];
      const wing = cat.wings[i % cat.wings.length];

      // Formulate unique title string without batch numbers
      let title = `${baseTitle}`;
      if (i > cat.baseTitles.length) {
        if (i % 2 === 0) {
          title = `${seniority} ${baseTitle}`;
        } else {
          title = `${baseTitle} - ${wing}`;
        }
      }

      const dept = cat.departments[(i - 1) % cat.departments.length];
      const logo = cat.logos[(i - 1) % cat.logos.length];
      const city = PAKISTAN_CITIES[(i - 1) % PAKISTAN_CITIES.length];
      const sector = cat.sectors[(i - 1) % cat.sectors.length];
      const jobType = cat.jobTypes[(i - 1) % cat.jobTypes.length];
      const qualification = cat.qualifications[(i - 1) % cat.qualifications.length];
      const minSalary = cat.minSalaries[(i - 1) % cat.minSalaries.length];
      const maxSalary = Math.round(minSalary * 1.35);
      const vacancies = 10 + ((i * 7) % 41); // Vacancies between 10 and 50
      
      const id = `jh-${cat.slug}-${1000 + i}`;
      const postedDay = (i % 25) + 1;
      const postedDate = `2026-07-${postedDay < 10 ? '0' + postedDay : postedDay}`;
      const deadlineDay = ((postedDay + 18) % 28) + 1;
      const deadlineMonth = postedDay + 18 > 28 ? '08' : '07';
      const deadline = `2026-${deadlineMonth}-${deadlineDay < 10 ? '0' + deadlineDay : deadlineDay}`;

      const desc = cat.descriptions[(i - 1) % cat.descriptions.length];

      jobs.push({
        id,
        title,
        department: dept,
        companyLogo: logo,
        sector,
        jobType,
        location: `${city}, Pakistan`,
        city,
        salaryRange: `Rs ${minSalary.toLocaleString()} - Rs ${maxSalary.toLocaleString()} / month`,
        minSalary,
        experience: `${(i % 5) + 1}-${(i % 5) + 3} Years Experience Required`,
        qualification,
        vacancies,
        availableSeats: vacancies,
        postedDate,
        deadline,
        isFeatured: i % 4 === 1,
        isUrgent: i % 5 === 0,
        isVerified: true,
        category: cat.name,
        categorySlug: cat.slug,
        description: `${desc} Official job position advertised for candidates across Pakistan meeting required educational degree and eligibility criteria.`,
        responsibilities: [
          `Execute assigned daily ${cat.name.toLowerCase()} operational duties with adherence to quality standards.`,
          `Maintain record logs, communicate progress reports to department heads, and enforce standard procedures.`,
          `Collaborate with inter-departmental teams to achieve monthly performance targets and project milestones.`
        ],
        requirements: [
          `Minimum qualification: ${qualification} from a HEC / Board recognized university or institution.`,
          `Relevant domain experience and proven technical competency in similar role.`,
          `Valid CNIC holder, Pakistani citizenship, and sound physical health.`
        ],
        benefits: [
          'Competitive Salary Package (in PKR)',
          'Medical Allowance & Health Insurance Coverage',
          'Annual Paid Leaves & Public Holidays',
          'Provident Fund / Gratuity & Annual Bonus'
        ],
        howToApply: `Submit your online application through the Jobs Portal. Ensure all documents including CNIC, educational transcripts, and experience certificates are uploaded before ${deadline}.`,
        contactEmail: `recruitment@${cat.slug}-jobs.pk`,
        contactPhone: `+92 (0${(i % 4) + 41}) 111-${1000 + i * 3}`,
        address: `${dept} Head Office, Main Boulevard, ${city}, Pakistan`
      });

      categoryCounts[cat.slug]++;
    }
  });

  const categories: JobCategory[] = CATEGORY_CONFIGS.map((cat) => ({
    id: cat.slug,
    slug: cat.slug,
    name: cat.name,
    iconName: cat.iconName,
    count: categoryCounts[cat.slug] || cat.targetCount,
    description: cat.description
  }));

  return { jobs, categories };
}
