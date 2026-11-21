/**
 * UltraModern's own software products (/products).
 *
 * Screenshots live in /public/products/<slug>/ and are real captures of each product
 * running with its demo data. `type: 'mobile'` shows a screenshot in a phone frame.
 * Feature lists follow the products' own documentation; keep them factual.
 */

import { BASE } from '../lib/base.js';

const shot = (slug, file, caption, type = 'desktop') => ({ src: `${BASE}/products/${slug}/${file}`, caption, type });

export const products = [
  {
    slug: 'smart-campus-erp',
    name: 'Smart Campus ERP',
    short: 'Smart Campus',
    category: 'School, College & Coaching ERP',
    icon: 'fa-solid fa-graduation-cap',
    accent: '#ea580c',
    tagline: 'One system for your school, college and coaching batches, with AI and daily automation built in.',
    summary:
      'A complete ERP for schools, colleges and coaching institutes: admissions, students, attendance, timetable, exams and report cards, online tests, LMS, fees, payroll and transport, with separate portals for staff, students and parents.',
    audience: ['Schools', 'Colleges', 'Coaching institutes', 'Multi-wing campuses', 'Institute groups'],
    highlights: [
      ['fa-solid fa-door-open', '5 portals', 'Super admin, admin, staff, student and parent'],
      ['fa-solid fa-robot', 'AI assistant', 'Answers from live data in English, Hindi and Hinglish'],
      ['fa-brands fa-windows', 'Works offline', 'Windows desktop app that syncs every minute'],
      ['fa-solid fa-bus', 'Live bus tracking', 'Parents see the bus, their stop and an ETA'],
    ],
    modules: [
      {
        icon: 'fa-solid fa-book-open',
        title: 'Academics',
        items: [
          'Daily attendance and monthly register',
          'Timetable per batch or teacher, with clash checks',
          'Exams with automatic totals, grades, ranks and printable report cards',
          'Timed online MCQ tests with negative marking and rank lists',
          'AI-written question papers with answer key',
          'Study material and doubts with instant AI explanations',
        ],
      },
      {
        icon: 'fa-solid fa-indian-rupee-sign',
        title: 'Fees & office',
        items: [
          'Instalment fee plans created on admission',
          'Collection by UPI, cash, card, bank or cheque, with receipts and dues',
          'Payroll, payslips, salary structures and advances',
          'Finance overview, income, expenses and ledger',
          'Certificates and notices with AI drafting (English / Hindi)',
        ],
      },
      {
        icon: 'fa-solid fa-filter',
        title: 'Admissions CRM',
        items: [
          'Enquiries on a pipeline with a conversion score',
          'Follow-up log and reminders',
          'AI-written WhatsApp message for every lead',
          'One-click admission from an enquiry',
        ],
      },
      {
        icon: 'fa-solid fa-laptop',
        title: 'Learning (LMS)',
        items: [
          'Courses with video lessons, notes, links and quizzes',
          'Per-student progress and lesson completion',
          'Assignments with due dates, grading, feedback and redo requests',
          'Leave requests from the student and parent portals',
        ],
      },
      {
        icon: 'fa-solid fa-wand-magic-sparkles',
        title: 'AI & automation',
        items: [
          'AI assistant that reads students, attendance, fees, exams and leads',
          'Smart Insights: a 0–100 risk score for every student',
          'AI counselling plan and parent message for at-risk students',
          'Daily rules: fee reminders, absent alerts, low-attendance warnings, birthday wishes and results',
          'Messages open in WhatsApp pre-filled and are never queued twice',
        ],
      },
      {
        icon: 'fa-solid fa-bus',
        title: 'Transport',
        items: [
          'Routes, stops and vehicles',
          'Live bus tracking on a map, refreshed every 10 seconds',
          'GPS from the driver’s phone or a tracker device',
          'Students and parents see their bus, stop, distance and ETA',
        ],
      },
    ],
    portals: [
      ['fa-solid fa-shield-halved', 'Super Admin Console', 'Owner view of every wing, admins, settings and the activity log.'],
      ['fa-solid fa-building', 'Admin Panel', 'Wing admins run their own school, college or coaching wing.'],
      ['fa-solid fa-briefcase', 'Staff Portal', 'Teachers, accountants and counsellors see only their work.'],
      ['fa-solid fa-user-graduate', 'Student Portal', 'Attendance, timetable, results, tests, courses, AI tutor and fees.'],
      ['fa-solid fa-people-roof', 'Parent Portal', 'All children on one login: attendance, homework, results, fees and leave.'],
    ],
    platform: [
      ['fa-solid fa-cloud', 'Cloud for many institutes', 'Each institute gets its own database, its own sub-domain or custom domain, and its own modules.'],
      ['fa-brands fa-windows', 'Windows desktop app', 'Runs offline with a local database and syncs with the server every minute.'],
      ['fa-solid fa-sitemap', 'School, college and coaching wings', 'Wing admins and staff only see and change their own wing, enforced on the server.'],
      ['fa-solid fa-clock-rotate-left', 'Full activity log', 'Every create, update, delete and login is recorded, with who, when and what.'],
    ],
    screenshots: [
      shot('smart-campus-erp', 'dashboard.jpg', 'Super admin dashboard: students, fees, staff and live activity'),
      shot('smart-campus-erp', 'insights.jpg', 'Smart Insights: risk score for every student'),
      shot('smart-campus-erp', 'fees.jpg', 'Fees: instalments, dues and one-click collection'),
      shot('smart-campus-erp', 'leads.jpg', 'Admissions CRM pipeline'),
      shot('smart-campus-erp', 'students.jpg', 'Students across school, college and coaching'),
      shot('smart-campus-erp', 'parent-home.jpg', 'Parent portal: every child on one login', 'mobile'),
      shot('smart-campus-erp', 'student-home.jpg', 'Student portal with AI tutor', 'mobile'),
    ],
    faqs: [
      { q: 'Can one system run our school, college and coaching together?', a: 'Yes. Smart Campus ERP has School, College and Coaching wings. The super admin assigns admins to each wing, and wing admins and staff only see their own wing’s students, fees, exams and staff.' },
      { q: 'Does it work without internet?', a: 'Yes. The Windows desktop app keeps its own local database, works offline, and syncs with the central server every minute when a connection is available.' },
      { q: 'What can parents see?', a: 'Parents log in with their mobile number and see all their children on one login: attendance, timetable, results and report cards, homework, course progress, fees and receipts, notices and leave applications.' },
      { q: 'Do we need AI to use it?', a: 'No. Everything works without AI. The AI assistant, question paper generator, report-card remarks and AI tutor are extra features you can switch on.' },
      { q: 'Can we use our own domain?', a: 'Yes. Each institute can use its own sub-domain or a custom domain such as erp.yourschool.com, served over HTTPS.' },
    ],
    seo: {
      title: 'Smart Campus ERP: School, College & Coaching Management Software | UltraModern Technologies',
      description: 'Smart Campus ERP by UltraModern Technologies: admissions, attendance, exams, online tests, LMS, fees, transport with live bus tracking, and student and parent portals, with AI.',
    },
  },
  {
    slug: 'medicare-hospital-erp',
    name: 'MediCare Hospital ERP',
    short: 'MediCare ERP',
    category: 'Hospital & Clinic ERP',
    icon: 'fa-solid fa-hospital',
    accent: '#0891b2',
    tagline: 'Smart hospital automation, with one panel per department and full oversight for the super admin.',
    summary:
      'A hospital management ERP where every department (OPD/IPD, OT, ICU, laboratory, pharmacy, billing, insurance, HR, ambulance and blood bank) works in its own panel, and the super admin allocates modules and monitors every action.',
    audience: ['Multispeciality hospitals', 'Nursing homes', 'Clinics', 'Diagnostic centres', 'Pharmacies attached to hospitals'],
    highlights: [
      ['fa-solid fa-layer-group', '16+ department modules', 'Each department works in its own panel'],
      ['fa-solid fa-pills', 'Marg-style pharmacy', 'Batch, expiry and GST-aware billing with keyboard shortcuts'],
      ['fa-solid fa-file-shield', 'Cashless insurance', 'Pre-authorisations, claims and settlements'],
      ['fa-solid fa-eye', 'Every action logged', 'Live monitoring and a complete activity log'],
    ],
    modules: [
      {
        icon: 'fa-solid fa-user-injured',
        title: 'Patient care',
        items: [
          'Patient registration with automatic patient IDs and duplicate checks',
          'OPD and IPD visits and admissions',
          'Operation theatre schedules and surgical case register',
          'ICU beds, admissions and timestamped observations',
          'Doctors, appointments, nursing duty roster and care notes',
        ],
      },
      {
        icon: 'fa-solid fa-flask',
        title: 'Lab, pharmacy & stock',
        items: [
          'Laboratory orders and test catalogue',
          'Pharmacy sale bills that pick the earliest-expiry batch first',
          'Purchase entries by batch, expiry, MRP and GST',
          'Inventory item master, batch stock and suppliers',
          'Expired or short batches are blocked automatically',
        ],
      },
      {
        icon: 'fa-solid fa-file-invoice-dollar',
        title: 'Billing & insurance',
        items: [
          'Invoices and payments for every department',
          'Insurance policies with insurer and TPA',
          'Cashless pre-authorisation with queries and enhancements',
          'Claims with a document checklist, settlements, TDS and deductions',
          'Online payments through Razorpay',
        ],
      },
      {
        icon: 'fa-solid fa-droplet',
        title: 'Blood bank & ambulance',
        items: [
          'Donors, bags and requests, with ABO/Rh compatibility checks',
          'Blood stock by group and component against pending demand',
          'Ambulance dispatch board with time-stamped trip steps',
          'Fleet checks for insurance, fitness and permits',
          'Trip charges from a tariff, posted to the patient’s bill',
        ],
      },
      {
        icon: 'fa-solid fa-users-gear',
        title: 'HR & payroll',
        items: [
          'Employees with salary structure, statutory numbers and bank details',
          'Daily attendance against shifts, with late marks and overtime',
          'Leave policy with quotas, carry-forward and half days',
          'Payroll with PF, ESI, professional tax and advance recovery',
          'Printable payslips and a bank-advice file',
        ],
      },
      {
        icon: 'fa-solid fa-chart-line',
        title: 'Reports & control',
        items: [
          'Day book, sales register, stock, expiry and outstanding reports',
          'Super admin allocates modules to each admin',
          'Live monitoring of admins online, operations and failed sign-ins',
          'Activity log of every sign-in, patient record view and change',
        ],
      },
    ],
    portals: [
      ['fa-solid fa-user-shield', 'Super Admin', 'Creates admins, allocates modules, resets passwords and sees everything.'],
      ['fa-solid fa-hospital-user', 'Front desk', 'Patients, OPD/IPD, doctors and billing in one combined panel.'],
      ['fa-solid fa-prescription-bottle-medical', 'Pharmacy & store', 'Pharmacy, inventory and reports for the store team.'],
      ['fa-solid fa-stethoscope', 'Department admins', 'Lab, nursing, HR, insurance, ambulance and blood bank each get their own panel.'],
    ],
    platform: [
      ['fa-solid fa-lock', 'Server-checked access', 'Every request re-checks the admin’s modules. Unassigned modules are refused.'],
      ['fa-solid fa-user-lock', 'Secure sign-in', 'Five failed sign-ins lock an account for 15 minutes.'],
      ['fa-solid fa-credit-card', 'Razorpay payments', 'Collect online for lab orders, pharmacy bills and ambulance trips.'],
      ['fa-brands fa-windows', 'Web and Windows', 'Runs in the browser, with a Windows desktop installer available.'],
    ],
    screenshots: [
      shot('medicare-hospital-erp', 'dashboard.jpg', 'Hospital overview: every department module at a glance'),
      shot('medicare-hospital-erp', 'monitoring.jpg', 'Super admin monitoring: admins, operations and sign-ins'),
      shot('medicare-hospital-erp', 'pharmacy.jpg', 'Pharmacy sale bills with batch-wise stock'),
      shot('medicare-hospital-erp', 'mobile-dashboard.jpg', 'Hospital overview on a phone', 'mobile'),
    ],
    faqs: [
      { q: 'Can each department have its own login?', a: 'Yes. The super admin creates admins and allocates modules to each one. An admin only sees the panels allocated to them, and the server refuses everything else.' },
      { q: 'Does the pharmacy handle batches and expiry?', a: 'Yes. Purchase entries add stock batch-wise with expiry, MRP and GST. Sale bills pick the earliest-expiry batch first and block expired or short batches.' },
      { q: 'Does it support cashless insurance and TPAs?', a: 'Yes. Pre-authorisations, queries, enhancements, claims with a document checklist, and settlements with TDS and deductions are all built in.' },
      { q: 'Can patients pay online?', a: 'Yes. Razorpay is built in for lab orders, pharmacy bills and ambulance trips. Each admin can collect into their own Razorpay account or the hospital’s.' },
      { q: 'Is every action recorded?', a: 'Yes. Sign-ins (including failures), every create, update and delete with changed fields, and every patient record view are logged and can be filtered by user, module and date.' },
    ],
    seo: {
      title: 'MediCare Hospital ERP: Hospital Management Software | UltraModern Technologies',
      description: 'MediCare Hospital ERP: OPD/IPD, OT, ICU, laboratory, pharmacy, billing, insurance claims, HR payroll, ambulance and blood bank, each in its own panel, with full audit logs.',
    },
  },
  {
    slug: 'smart-ai-crm',
    name: 'Smart AI CRM',
    short: 'Smart AI CRM',
    category: 'AI Sales & Communication CRM',
    icon: 'fa-solid fa-robot',
    accent: '#6d28d9',
    tagline: 'Leads, deals, WhatsApp, SMS and calls in one CRM, with AI that tells your team what to do next.',
    summary:
      'A multi-company CRM for leads, customers, deals and tasks, with a Communication Hub for bulk SMS, WhatsApp and IVR calls, an AI bot, workflow automation, an Ads Manager, and HR and payroll.',
    audience: ['Sales teams', 'Real estate', 'Education & coaching', 'Clinics & services', 'Agencies'],
    highlights: [
      ['fa-solid fa-brain', 'AI next best action', 'Lead scoring, forecasts and churn alerts'],
      ['fa-brands fa-whatsapp', 'WhatsApp, SMS & IVR', 'Bulk sends and an AI bot that answers first'],
      ['fa-solid fa-diagram-project', 'Workflow automation', 'Triggers, waits, conditions and actions'],
      ['fa-solid fa-palette', 'White-label', 'Your app name, colour and domain'],
    ],
    modules: [
      {
        icon: 'fa-solid fa-user-plus',
        title: 'Sales CRM',
        items: [
          'Leads with duplicate checks, scoring, assignment and timeline',
          'Customers with purchases, documents and churn risk',
          'Deals on pipelines, with payments and win/loss',
          'Tasks and recurring follow-ups with a calendar',
          'CSV import/export and a web-form-to-lead webhook',
        ],
      },
      {
        icon: 'fa-solid fa-comments',
        title: 'Communication Hub',
        items: [
          'Bulk SMS, WhatsApp and IVR call broadcasts, throttled and DND-safe',
          'Shared inbox where the AI answers first and agents can take over',
          'AI bot answering from your knowledge base in English and Hindi/Hinglish',
          'IVR flows with an AI voice agent and a call simulator',
          'Call logs with transcript, sentiment and AI summary',
        ],
      },
      {
        icon: 'fa-solid fa-gears',
        title: 'Automation & campaigns',
        items: [
          'Workflows triggered by new leads, stage changes, payments, birthdays and more',
          'Steps to assign, send WhatsApp/SMS/email, wait, branch and notify',
          'Ready-made workflow templates',
          'Message templates with personalisation',
          'One-off blasts and multi-step drip campaigns',
        ],
      },
      {
        icon: 'fa-solid fa-wand-magic-sparkles',
        title: 'AI assistant',
        items: [
          'Write messages and suggest replies',
          'Sentiment, summaries and natural-language search',
          'Next best action for every lead',
          'Sales forecast and customer churn prediction',
        ],
      },
      {
        icon: 'fa-solid fa-bullhorn',
        title: 'Ads Manager',
        items: [
          'Google, Meta, LinkedIn, TikTok, YouTube and X ad accounts',
          'Campaign budgets with manager approval above a limit',
          'Creatives and A/B tests',
          'Spend, CTR, CPL and ROAS dashboard',
          'Lead attribution with UTM tracking codes',
        ],
      },
      {
        icon: 'fa-solid fa-id-badge',
        title: 'HR & payroll',
        items: [
          'Employees with salary structure and bank details',
          'Punch in/out with late marks for every user',
          'Leave requests, holidays and balances',
          'Payroll with PF and tax, payslips and bank-transfer export',
        ],
      },
    ],
    portals: [
      ['fa-solid fa-crown', 'Super Admin & Admin', 'Everything, including users, pipelines, company settings and the audit log.'],
      ['fa-solid fa-user-tie', 'Manager', 'Team pipeline, reports, campaigns and automation.'],
      ['fa-solid fa-handshake', 'Sales', 'Only their own leads, deals, tasks, customers and chats.'],
      ['fa-solid fa-headset', 'Support & telecaller', 'Inbox, customers, call logs and their own leads.'],
      ['fa-solid fa-bullseye', 'Ads, HR and comms managers', 'A focused panel for advertising, payroll or the Communication Hub.'],
    ],
    platform: [
      ['fa-solid fa-building-user', 'Multi-company', 'Each company’s data is isolated, with its own modules, user limit and expiry.'],
      ['fa-solid fa-globe', 'Client domains', 'Run each client on its own domain with its name on the sign-in page.'],
      ['fa-brands fa-windows', 'Windows desktop app', 'Keeps working offline and syncs queued changes when back online.'],
      ['fa-solid fa-plug', 'Your providers', 'Twilio, Meta WhatsApp Cloud API, MSG91, Gupshup and other gateways.'],
    ],
    screenshots: [
      shot('smart-ai-crm', 'dashboard.jpg', 'Dashboard: leads, follow-ups, revenue and sales funnel'),
      shot('smart-ai-crm', 'inbox.jpg', 'Shared WhatsApp and SMS inbox where the AI answers first'),
      shot('smart-ai-crm', 'leads.jpg', 'Leads with source, status and score'),
      shot('smart-ai-crm', 'workflows.jpg', 'Workflow automation'),
      shot('smart-ai-crm', 'ai.jpg', 'AI assistant: forecast and natural-language search'),
      shot('smart-ai-crm', 'mobile-dashboard.jpg', 'Dashboard on a phone', 'mobile'),
      shot('smart-ai-crm', 'mobile-inbox.jpg', 'Inbox on a phone', 'mobile'),
    ],
    faqs: [
      { q: 'Does it work with WhatsApp?', a: 'Yes. Connect the Meta WhatsApp Cloud API, Twilio or a gateway such as MSG91 or Gupshup. You get bulk sends with approved templates, a shared inbox and an AI bot.' },
      { q: 'Do we need a paid AI key?', a: 'No. Smart AI CRM works with built-in rules out of the box. Connect OpenAI, Groq or Gemini when you want full AI-written replies and summaries.' },
      { q: 'Can sales reps see only their own leads?', a: 'Yes. Every role has its own panel and menu. Sales and telecallers only see their own leads, deals, tasks and chats.' },
      { q: 'Does it work offline?', a: 'The Windows desktop app keeps showing data offline and queues new leads, deals, tasks and notes. They sync in order when the connection returns.' },
      { q: 'Can we sell it under our own brand?', a: 'Yes. Each client company can have its own app name, colour and domain, and you control modules, user limits and expiry from the owner console.' },
    ],
    seo: {
      title: 'Smart AI CRM: CRM with WhatsApp, SMS, IVR & AI Automation | UltraModern Technologies',
      description: 'Smart AI CRM: leads, deals and tasks with bulk WhatsApp, SMS and IVR, an AI bot and shared inbox, workflow automation, Ads Manager and HR payroll. Works on web and Windows.',
    },
  },
  {
    slug: 'transport-erp',
    name: 'Transport Management ERP',
    short: 'Transport ERP',
    category: 'Fleet, Trip & Logistics ERP',
    icon: 'fa-solid fa-truck-fast',
    accent: '#0f766e',
    tagline: 'Bookings, fleet, drivers, trips and shipments in one system, with live tracking for your team and your customers.',
    summary:
      'A transport and logistics ERP that takes every load from booking and quote to vehicle allocation, trip, delivery and invoice, with fleet compliance, driver management, fuel, maintenance and expenses, and separate panels for managers, drivers and customers.',
    audience: ['Transport companies', 'Fleet owners', 'Logistics & cargo firms', 'Goods carriers', 'Distribution businesses'],
    highlights: [
      ['fa-solid fa-route', 'Booking to delivery', 'Quote, allocation, trip, POD and invoice in one flow'],
      ['fa-solid fa-location-crosshairs', 'Live tracking', 'Driver location, speed alerts and geofences'],
      ['fa-solid fa-id-card', 'Driver compliance', 'Licence expiry warnings, documents and attendance'],
      ['fa-solid fa-gas-pump', 'Fuel & maintenance', 'Mileage, service schedules and expiry reminders'],
    ],
    modules: [
      {
        icon: 'fa-solid fa-clipboard-list',
        title: 'Bookings & customers',
        items: [
          'Customer bookings with pickup, delivery, cargo and vehicle needs',
          'Versioned quotes in INR that the customer accepts or declines online',
          'Booking calendar and status history',
          'Customer profiles with KYC document review',
          'Delivery feedback with ratings and staff responses',
        ],
      },
      {
        icon: 'fa-solid fa-truck',
        title: 'Fleet & allocation',
        items: [
          'Vehicle register with capacity, ownership and documents',
          'Insurance, fitness, permit and pollution certificate tracking',
          'Allocate only available vehicles of the right type and capacity',
          'Overlapping use is blocked; every status change is audited',
        ],
      },
      {
        icon: 'fa-solid fa-id-badge',
        title: 'Drivers',
        items: [
          'Driver profiles with auto-generated driver codes',
          'Licences with a 30-day expiry warning',
          'Documents, daily attendance and performance',
          'Salary entries with approval and payment tracking',
        ],
      },
      {
        icon: 'fa-solid fa-map-location-dot',
        title: 'Trips, routes & tracking',
        items: [
          'Trip scheduling from allocations, with licence-checked driver assignment',
          'Drivers start, delay (with a reason) and complete their own trips',
          'Route catalogue with distance, duration, waypoints and tolls',
          'Live location from the driver’s phone, with speed and geofence alerts',
          'Customers can watch their own active shipment on a map',
        ],
      },
      {
        icon: 'fa-solid fa-boxes-stacked',
        title: 'Cargo, billing & expenses',
        items: [
          'Consignment numbers and shipment milestones up to delivery',
          'Proof of delivery with receiver, time and an optional file',
          'Invoices per delivered shipment, payments and receipts',
          'Expense ledger by category, vehicle and trip',
        ],
      },
      {
        icon: 'fa-solid fa-screwdriver-wrench',
        title: 'Fuel, maintenance & reports',
        items: [
          'Fuel ledger with odometer checks and full-tank mileage',
          'Service schedules and repair work orders with costs',
          'Due-service and insurance/fitness expiry reminders',
          'Fleet, driver, trip, fuel, revenue, expense and utilisation reports with CSV export',
        ],
      },
    ],
    portals: [
      ['fa-solid fa-user-shield', 'Super Admin', 'Everything, including managers, tax profile settings and database backups.'],
      ['fa-solid fa-user-tie', 'Transport Manager', 'Runs daily operations: bookings, fleet, drivers, trips and billing.'],
      ['fa-solid fa-truck', 'Driver', 'Sees their own trips, updates trip status and shares live location.'],
      ['fa-solid fa-building', 'Customer', 'Books vehicles, accepts quotes, tracks shipments and gives feedback.'],
    ],
    platform: [
      ['fa-solid fa-user-lock', 'Secure sign-in', 'Five failed attempts lock a login for 15 minutes; disabled logins end their sessions.'],
      ['fa-solid fa-clock-rotate-left', 'Audited changes', 'Vehicle, driver, trip and booking changes keep a full status history.'],
      ['fa-solid fa-bell', 'Notification centre', 'In-app alerts for trip status changes, speed and geofence events.'],
      ['fa-solid fa-database', 'Backups', 'The super admin can download a compressed backup of the database.'],
    ],
    screenshots: [
      shot('transport-erp', 'dashboard.jpg', 'Operations overview for the super admin'),
      shot('transport-erp', 'trips.jpg', 'Trip monitoring: in-progress and delayed trips'),
      shot('transport-erp', 'bookings.jpg', 'Booking status with customer quotes'),
      shot('transport-erp', 'allocation.jpg', 'Vehicle allocation to confirmed bookings'),
      shot('transport-erp', 'fuel.jpg', 'Fuel consumption and cost by vehicle'),
      shot('transport-erp', 'drivers.jpg', 'Driver register'),
      shot('transport-erp', 'routes.jpg', 'Route catalogue with toll plazas'),
      shot('transport-erp', 'mobile-driver.jpg', 'Driver panel on a phone', 'mobile'),
      shot('transport-erp', 'mobile-customer-bookings.jpg', 'Customer booking status', 'mobile'),
      shot('transport-erp', 'mobile-customer-kyc.jpg', 'Customer profile and KYC', 'mobile'),
    ],
    faqs: [
      { q: 'Can our customers book and track loads themselves?', a: 'Yes. Customers register, request a vehicle, accept or decline your quote online, follow the shipment’s milestones and see their own active shipment on a map.' },
      { q: 'How does live tracking work?', a: 'The assigned driver shares location from their phone during an active trip. Managers see current positions, and speed-limit and geofence alerts appear in the notification centre.' },
      { q: 'Does it stop us from assigning the wrong vehicle or driver?', a: 'Yes. Only available vehicles of a compatible type and capacity can be allocated, overlapping use is blocked, and drivers need a valid licence that covers the trip dates.' },
      { q: 'Can we track fuel and maintenance costs?', a: 'Yes. The fuel ledger calculates mileage between full-tank fills, and maintenance records track scheduled services, repairs, actual costs and expiry reminders.' },
      { q: 'Does it handle invoices?', a: 'Yes, it issues internal invoices for delivered shipments and records payments with receipts. Statutory GST e-invoicing and online payment collection can be added for your business.' },
    ],
    seo: {
      title: 'Transport Management ERP: Fleet, Trip & Logistics Software | UltraModern Technologies',
      description: 'Transport Management ERP: bookings and quotes, fleet and driver compliance, trip scheduling, live GPS tracking, proof of delivery, invoices, fuel and maintenance, with driver and customer panels.',
    },
  },
  {
    slug: 'gym-management',
    name: 'Gym Management Software',
    short: 'Gym Management',
    category: 'Gym & Fitness Studio Software',
    icon: 'fa-solid fa-dumbbell',
    accent: '#4d7c0f',
    tagline: 'Memberships, payments, check-ins, classes and coaching in one app for your gym, your coaches and your members.',
    summary:
      'Gym management software for memberships and payments, front-desk check-in, group classes with waitlists, 1:1 coach sessions, coach workout plans and member progress tracking, with automatic renewal reminders.',
    audience: ['Gyms', 'Fitness studios', 'Yoga & Pilates studios', 'CrossFit boxes', 'Personal trainers'],
    highlights: [
      ['fa-solid fa-id-card-clip', 'Memberships & payments', 'Plans, renewals, freezes and refunds'],
      ['fa-solid fa-door-open', 'Front-desk check-in', 'See who is in the gym right now'],
      ['fa-solid fa-people-group', 'Classes with waitlist', 'Never overbooked, auto-promoted from the waitlist'],
      ['fa-solid fa-chart-line', 'Progress tracking', 'Weight, body fat, BMI and goals'],
    ],
    modules: [
      {
        icon: 'fa-solid fa-id-card-clip',
        title: 'Memberships & payments',
        items: [
          'Plans with price, duration and optional session limits',
          'Assign, activate, freeze, resume and cancel memberships',
          'Payments by cash, card, UPI or bank transfer, with invoices',
          'Refunds and a renewals-to-chase list',
          'Expiry reminders 7, 3 and 1 days before the end date',
        ],
      },
      {
        icon: 'fa-solid fa-door-open',
        title: 'Front desk & members',
        items: [
          'Member check-in and check-out',
          'Live count of members inside the gym',
          'Member directory with membership status',
          'Suspend or restore member accounts',
        ],
      },
      {
        icon: 'fa-solid fa-people-group',
        title: 'Group classes',
        items: [
          'Schedule capacity-limited classes with a coach and location',
          'Members with an active membership book a spot',
          'Automatic waitlist with in-order promotion',
          'Coaches see the roster for their classes',
        ],
      },
      {
        icon: 'fa-solid fa-calendar-check',
        title: '1:1 coach sessions',
        items: [
          'Members browse coaches and book open time slots',
          'Coaches manage availability and their sessions',
          'Members cancel or rate sessions afterwards',
          'Coach profiles with reviews',
        ],
      },
      {
        icon: 'fa-solid fa-list-check',
        title: 'Workout plans',
        items: [
          'Coaches write weekly plans with sets, reps, weight and rest',
          'Members tick off exercises as they finish them',
          'Coaches follow each member’s adherence over the last 7 days',
          'A new plan archives the previous one',
        ],
      },
      {
        icon: 'fa-solid fa-weight-scale',
        title: 'Progress & insights',
        items: [
          'Members log weight, body fat and body measurements',
          'BMI, goal weight progress and weekly trend',
          'Weight chart over time',
          'Admin overview with revenue for the last 6 months',
        ],
      },
    ],
    portals: [
      ['fa-solid fa-user-gear', 'Gym admin', 'Members, plans, memberships, payments, attendance, classes and reviews.'],
      ['fa-solid fa-person-running', 'Coach', 'Sessions, class rosters, client workout plans and client progress.'],
      ['fa-solid fa-user', 'Member', 'Membership, bookings, classes, workout plan and progress.'],
      ['fa-solid fa-bell', 'Notifications', 'Alerts for memberships, bookings, plans, waitlists and class changes.'],
    ],
    platform: [
      ['fa-solid fa-mobile-screen', 'Works on phones', 'Members use it from their phone; staff from any desk.'],
      ['fa-solid fa-language', 'Multi-language', 'Members can choose their preferred language.'],
      ['fa-solid fa-circle-half-stroke', 'Light and dark mode', 'A comfortable theme for the front desk and members.'],
      ['fa-solid fa-lock', 'Secure accounts', 'Token-based sign-in, hashed passwords and server-checked admin access.'],
    ],
    screenshots: [
      shot('gym-management', 'dashboard.jpg', 'Admin overview: memberships, revenue, check-ins and renewals'),
      shot('gym-management', 'payments.jpg', 'Payments with invoices and refunds'),
      shot('gym-management', 'attendance.jpg', 'Front-desk check-in and today’s visits'),
      shot('gym-management', 'classes.jpg', 'Group class schedule with spots left'),
      shot('gym-management', 'coach-plans.jpg', 'Coach view: client workout plans'),
      shot('gym-management', 'progress.jpg', 'Member progress: weight, BMI and goal'),
      shot('gym-management', 'members.jpg', 'Members and their memberships'),
      shot('gym-management', 'mobile-plan.jpg', 'Workout plan on the member’s phone', 'mobile'),
      shot('gym-management', 'mobile-classes.jpg', 'Booked group classes', 'mobile'),
      shot('gym-management', 'mobile-membership.jpg', 'Membership and renewal', 'mobile'),
      shot('gym-management', 'mobile-progress.jpg', 'Logging a weigh-in', 'mobile'),
    ],
    faqs: [
      { q: 'Can members renew or change their plan themselves?', a: 'Members can request a plan from their phone. The front desk records the payment to activate it, and members get reminders 7, 3 and 1 days before their membership ends.' },
      { q: 'What happens when a class is full?', a: 'Members join a waitlist and are promoted automatically, in order, as soon as a spot opens. Seats are claimed atomically, so a class is never overbooked.' },
      { q: 'Can coaches give members a workout plan?', a: 'Yes. Coaches write weekly plans with sets, reps, weight and rest, members tick off exercises, and coaches see adherence for the last 7 days.' },
      { q: 'Which payment methods are supported?', a: 'Cash, card, UPI and bank transfer are recorded with an invoice number, and payments can be refunded from the admin panel.' },
      { q: 'Can we freeze a membership?', a: 'Yes. Memberships can be frozen and resumed, and members are notified of activation, freeze, resume, cancellation and refunds.' },
    ],
    seo: {
      title: 'Gym Management Software: Memberships, Classes & Check-in | UltraModern Technologies',
      description: 'Gym management software with memberships and payments, front-desk check-in, group classes with waitlists, coach sessions, workout plans and member progress tracking.',
    },
  },
];

export const getProduct = (slug) => products.find((p) => p.slug === String(slug).toLowerCase()) || null;
