export const SITE_URL = 'https://www.ultramoderntechnologies.com';

export const company = {
  name: 'UltraModern Technologies Pvt. Ltd.',
  short: 'UltraModern Technologies',
  tagline: 'Empowering dreams through digital',
  phone: '+91 86400 89400',
  phoneHref: 'tel:+918640089400',
  phone2: '+91 70001 93773',
  phone2Href: 'tel:+917000193773',
  email: 'ultramoderntechnologies01@gmail.com',
  salesEmail: 'sales@ultramoderntechnologies.com',
  whatsapp: 'https://wa.me/918640089400',
  hours: 'Mon – Sat, 10:00 AM – 7:00 PM',
  offices: [
    {
      name: 'Registered Office',
      city: 'Indore',
      address: '565, Sapna Sangeeta Rd, near Axis Bank, Snehnagar, Indore, Madhya Pradesh 452001',
      map: 'https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Kcs87gv4_WI5MXrcrNLiqn5o&daddr=565,+Sapna+Sangeeta+Rd,+nearby+axis+bank,+Snehnagar,+Indore,+Madhya+Pradesh+452001',
      embed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.683132648676!2d75.8665109738544!3d22.70283682818713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fdf80bee3ccb%3A0x687eaae2d2acdc7a!2sUltraModern%20Technologies%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1780896367959!5m2!1sen!2sin',
    },
    {
      name: 'Branch Office',
      city: 'Indore',
      address: 'CRYSTAL IT Park, Indore, Madhya Pradesh 452001',
      map: 'https://maps.app.goo.gl/PRho2HwRAMSq7wnG8',
      embed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.1402064800945!2d75.86969137452205!3d22.685823979411236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fce9643647dd%3A0xc1ffcef90e9b429d!2sCrystal%20IT%20Park!5e0!3m2!1sen!2sin!4v1759911014371!5m2!1sen!2sin',
    },
  ],
  /** Same profiles as the legacy site (official URLs from its Organization `sameAs`), shown with the
   *  original brand-colour logos in the top bar, footer and blog cards. */
  social: [
    { label: 'Facebook', icon: 'fa-brands fa-facebook-f', img: '/social/facebook.png', href: 'https://www.facebook.com/people/Ultra-Modern-Technologies/61550345835440/' },
    { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', img: '/social/linkedin.png', href: 'https://www.linkedin.com/company/ultramodern-technology' },
    { label: 'Instagram', icon: 'fa-brands fa-instagram', img: '/social/instagram.png', href: 'https://www.instagram.com/ultramodern_technologies/' },
    { label: 'Email', icon: 'fa-regular fa-envelope', img: '/social/gmail.png', href: 'mailto:ultramoderntechnologies01@gmail.com' },
    { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', img: '/social/whatsapp.png', href: 'https://wa.me/918640089400' },
  ],
};

/** Job-track pages (imported from the legacy site), listed in the footer like the old "Jobs" column. */
export const jobLinks = [
  ['Android Developer Jobs', 'Android-Developer-Jobs'],
  ['React Native Developer Jobs', 'react-native-developer-jobs'],
  ['Angular Developer Jobs', 'angular-developer-jobs'],
  ['Node.js Developer Jobs', 'nodejs-developer-jobs'],
  ['Overseas Education Counselor Jobs', 'overseas-Education-Counselor-Jobs'],
  ['Automation Testing Jobs', 'automation-Testing-Jobs'],
  ['Work From Home Jobs', 'work-from-home-job'],
];

/** EmailJS configuration (same account the legacy site used). */
export const emailjsConfig = {
  publicKey: '0JsAyRKaWt8MmWkCY',
  serviceId: 'service_jcux7vv',
  enquiryTemplate: 'template_w9uxsdr',
  careerTemplate: 'template_niscv5u',
};

export const cloudinaryConfig = {
  cloudName: 'db1dd2oe1',
  uploadPreset: 'UMTInternal',
};

/** Service catalogue grouped exactly like the legacy mega-menu. */
export const serviceGroups = [
  {
    title: 'Online Marketing',
    icon: 'fa-solid fa-bullhorn',
    blurb: 'Rank higher, run profitable ads, and turn traffic into leads.',
    items: [
      ['SEO Services', 'seo-company-in-indore'],
      ['Social Media Marketing', 'social-media-marketing-company-in-indore'],
      ['Google Ads', 'google-ads-agency-in-indore'],
      ['Meta Ads', 'meta-ads-agency-in-indore'],
      ['Google My Business Profile', 'google-my-business-services-in-indore'],
      ['Digital Marketing', 'digital-marketing-company-in-indore'],
    ],
  },
  {
    title: 'Web Design & Development',
    icon: 'fa-solid fa-code',
    blurb: 'Fast, SEO-ready websites, portals, and online stores.',
    items: [
      ['Web Design & Development', 'website-design-and-development-company-in-indore'],
      ['CRM Software Development', 'crm-software-development'],
      ['Software Development', 'software-development-company-in-indore'],
      ['Educational Web Portal', 'educational-web-portal-development-service-in-indore'],
      ['Restaurant Web Portal', 'restaurant-web-portal-development-service-in-indore'],
      ['Healthcare Portal', 'healthcare-portal-development-service-in-indore'],
      ['Travel Portal', 'travel-portal-development-service-in-indore'],
      ['Real Estate Portal', 'real-estate-portal-development-service-in-indore'],
      ['E-Commerce Development', 'ecommerce-website-development-company-in-indore'],
    ],
  },
  {
    title: 'Mobile Applications',
    icon: 'fa-solid fa-mobile-screen-button',
    blurb: 'Android, iOS, and cross-platform apps built to scale.',
    items: [
      ['Mobile App Development', 'best-mobile-app-development-company-in-indore'],
      ['Windows App Development', 'windows-app-development-service-in-indore'],
      ['Xamarin App Development', 'xamarin-app-development-service-in-indore'],
      ['Native App Development', 'native-app-development-service-in-indore'],
      ['Hybrid App Development', 'hybrid-app-development-service-in-indore'],
    ],
  },
  {
    title: 'Consulting, AI & Design',
    icon: 'fa-solid fa-brain',
    blurb: 'Strategy, AI and data, IT support, and brand design.',
    items: [
      ['IT Consulting', 'it-consulting-service-in-indore'],
      ['Data Analytics & BI', 'data-analyst-business-intelligence-Indore'],
      ['AI & Machine Learning', 'artificial-intelligence-company-in-indore'],
      ['IT Support & Managed Services', 'it-support-company-in-indore'],
      ['Logo Design', 'logo-design-company-in-indore'],
      ['UI/UX Design', 'best-ui-ux-design-company-in-indore'],
      ['Brochure Design', 'brochure-design-company-in-indore'],
    ],
  },
  {
    title: 'Business Software',
    icon: 'fa-solid fa-layer-group',
    blurb: 'Ready-to-customise software for everyday operations.',
    items: [
      ['HR & Payroll Software', 'hr-payroll-software-in-indore'],
      ['Jewellery Software', 'best-jewellery-software-in-indore'],
      ['CRM Software', 'best-crm-software-in-indore'],
      ['Real Estate Software', 'real-estate-software-company-in-indore'],
      ['Inventory Management', 'best-inventory-management-software-in-indore'],
      ['Hospital Management', 'best-hospital-management-software-in-indore'],
      ['School Management', 'best-school-management-software-in-indore'],
    ],
  },
  {
    title: 'Testing & QA',
    icon: 'fa-solid fa-shield-halved',
    blurb: 'Ship with confidence: functional, security, and load testing.',
    items: [
      ['Software Testing', 'best-software-testing-service-in-indore'],
      ['Security Testing', 'best-security-testing-service-in-indore'],
      ['Performance Testing', 'performance-testing-service-in-indore'],
    ],
  },
];

export const serviceLabel = (slug) => {
  for (const g of serviceGroups) for (const [label, s] of g.items) if (s === slug) return label;
  return null;
};

export const serviceGroupOf = (slug) =>
  serviceGroups.find((g) => g.items.some(([, s]) => s === slug)) || null;

export const featuredServices = [
  { title: 'Software Development', slug: 'software-development-company-in-indore', icon: 'fa-solid fa-laptop-code', text: 'Custom software built around your workflow: scalable, secure, and designed to automate operations and cut manual effort.' },
  { title: 'Website Development', slug: 'website-design-and-development-company-in-indore', icon: 'fa-solid fa-globe', text: 'Fast, mobile-first, SEO-ready websites built to turn visitors into consistent business enquiries.' },
  { title: 'E-Commerce Solutions', slug: 'ecommerce-website-development-company-in-indore', icon: 'fa-solid fa-cart-shopping', text: 'End-to-end online stores with product SEO, payment gateways, and conversion-focused design.' },
  { title: 'Mobile App Development', slug: 'best-mobile-app-development-company-in-indore', icon: 'fa-solid fa-mobile-screen', text: 'Native and cross-platform apps for iOS and Android with clean design and full post-launch support.' },
  { title: 'Digital Marketing', slug: 'digital-marketing-company-in-indore', icon: 'fa-solid fa-chart-line', text: 'SEO, Google Ads, and Meta Ads, with every campaign tracked and optimised to generate qualified leads.' },
  { title: 'Artificial Intelligence', slug: 'artificial-intelligence-company-in-indore', icon: 'fa-solid fa-brain', text: 'AI chatbots, predictive analytics, and automation that cut operational costs and sharpen decisions.' },
  { title: 'IT Consulting', slug: 'it-consulting-service-in-indore', icon: 'fa-solid fa-lightbulb', text: 'Technology strategy, system architecture, and transformation planning so tech investments pay off.' },
  { title: 'IT Support & Managed Services', slug: 'it-support-company-in-indore', icon: 'fa-solid fa-headset', text: 'Round-the-clock monitoring, network security, and helpdesk that keep your operations running.' },
];

export const industries = [
  { title: 'Technology & IT', icon: 'fa-solid fa-microchip' },
  { title: 'E-commerce & Retail', icon: 'fa-solid fa-bag-shopping' },
  { title: 'Banking & Finance', icon: 'fa-solid fa-building-columns' },
  { title: 'Logistics & Supply Chain', icon: 'fa-solid fa-truck-fast' },
  { title: 'Healthcare & Medical', icon: 'fa-solid fa-hospital' },
  { title: 'Travel & Hospitality', icon: 'fa-solid fa-plane-departure' },
  { title: 'Education & E-Learning', icon: 'fa-solid fa-graduation-cap' },
  { title: 'Manufacturing & Industrial', icon: 'fa-solid fa-industry' },
];

const dev = (p) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${p}`;
export const techStack = [
  {
    key: 'frontend', label: 'Frontend', icon: 'fa-brands fa-react', blurb: 'React, Vue, Angular, UI/UX',
    items: [['React', dev('react/react-original.svg')], ['Angular', dev('angularjs/angularjs-original.svg')], ['Vue.js', dev('vuejs/vuejs-original.svg')], ['Next.js', dev('nextjs/nextjs-original.svg')], ['TypeScript', dev('typescript/typescript-original.svg')], ['Tailwind CSS', dev('tailwindcss/tailwindcss-original.svg')], ['Bootstrap', dev('bootstrap/bootstrap-original.svg')], ['HTML5 / CSS3', dev('html5/html5-original.svg')]],
  },
  {
    key: 'backend', label: 'Backend', icon: 'fa-solid fa-server', blurb: 'Node.js, Python, PHP, Java, .NET',
    items: [['Node.js', dev('nodejs/nodejs-original.svg')], ['Python', dev('python/python-original.svg')], ['PHP', dev('php/php-original.svg')], ['Java', dev('java/java-original.svg')], ['Spring Boot', dev('spring/spring-original.svg')], ['Express.js', dev('express/express-original.svg')], ['Laravel', dev('laravel/laravel-original.svg')], ['ASP.NET Core', dev('dotnetcore/dotnetcore-original.svg')]],
  },
  {
    key: 'mobile', label: 'Mobile', icon: 'fa-solid fa-mobile-screen-button', blurb: 'Native & cross-platform',
    items: [['React Native', dev('react/react-original.svg')], ['Flutter', dev('flutter/flutter-original.svg')], ['Swift', dev('swift/swift-original.svg')], ['Kotlin', dev('kotlin/kotlin-original.svg')], ['Android', dev('android/android-original.svg')], ['Xamarin', dev('xamarin/xamarin-original.svg')], ['Ionic', dev('ionic/ionic-original.svg')]],
  },
  {
    key: 'cloud', label: 'Cloud', icon: 'fa-solid fa-cloud-arrow-up', blurb: 'AWS, GCP, Azure, Vercel',
    items: [['AWS', dev('amazonwebservices/amazonwebservices-original.svg')], ['Google Cloud', dev('googlecloud/googlecloud-original.svg')], ['Azure', dev('azure/azure-original.svg')], ['Firebase', dev('firebase/firebase-original.svg')], ['Vercel', dev('vercel/vercel-original.svg')], ['Netlify', dev('netlify/netlify-original.svg')], ['DigitalOcean', dev('digitalocean/digitalocean-original.svg')], ['Heroku', dev('heroku/heroku-original.svg')]],
  },
  {
    key: 'data', label: 'Databases', icon: 'fa-solid fa-database', blurb: 'SQL, NoSQL, caching',
    items: [['MySQL', dev('mysql/mysql-original.svg')], ['PostgreSQL', dev('postgresql/postgresql-original.svg')], ['MongoDB', dev('mongodb/mongodb-original.svg')], ['Redis', dev('redis/redis-original.svg')], ['Oracle', dev('oracle/oracle-original.svg')], ['SQL Server', dev('microsoftsqlserver/microsoftsqlserver-original.svg')]],
  },
  {
    key: 'devops', label: 'DevOps', icon: 'fa-solid fa-gears', blurb: 'CI/CD, Kubernetes, Docker',
    items: [['Docker', dev('docker/docker-original.svg')], ['Kubernetes', dev('kubernetes/kubernetes-original.svg')], ['Jenkins', dev('jenkins/jenkins-original.svg')], ['GitLab CI', dev('gitlab/gitlab-original.svg')], ['Ansible', dev('ansible/ansible-original.svg')], ['Terraform', dev('terraform/terraform-original.svg')], ['Prometheus', dev('prometheus/prometheus-original.svg')], ['Grafana', dev('grafana/grafana-original.svg')]],
  },
  {
    key: 'ai', label: 'AI & Data', icon: 'fa-solid fa-brain', blurb: 'ML, LLMs, data science',
    items: [['TensorFlow', dev('tensorflow/tensorflow-original.svg')], ['PyTorch', dev('pytorch/pytorch-original.svg')], ['scikit-learn', dev('scikitlearn/scikitlearn-original.svg')], ['Pandas', dev('pandas/pandas-original.svg')], ['NumPy', dev('numpy/numpy-original.svg')], ['OpenCV', dev('opencv/opencv-original.svg')], ['Jupyter', dev('jupyter/jupyter-original.svg')], ['Apache Spark', dev('apachespark/apachespark-original.svg')]],
  },
];

/** Client logos (home page strip + /clients page). `project` = portfolio case-study slug, if there is one.
 *  The home page shows the first CLIENTS_ON_HOME entries, then a "many more" tile linking to /clients. */
export const clients = [
  { name: 'Grovio', logo: '/IMG/clients/grovio.svg', industry: 'Grocery & quick commerce', project: 'grovio' },
  { name: 'AnZ Cabs & Logistics', logo: '/IMG/clients/anz-cabs.png', industry: 'Ride & transport', project: 'ride-and-transport' },
  { name: 'Khushi Cargo Services', logo: '/IMG/clients/khushi-transport.webp', industry: 'Logistics' },
  { name: 'Nurvia Petcare', logo: '/IMG/clients/nurvia.png', industry: 'Pet care', project: 'nurvia-petcare' },
  { name: 'Nyāya Grantha Sarvasvam', logo: '/IMG/clients/nyaya-grantha.png', industry: 'Education & research', project: 'nyaya-grantha' },
  { name: 'Rhythm Multispeciality Hospital', logo: '/IMG/clients/rhythm-hospital.webp', industry: 'Healthcare' },
  { name: 'Charzee', logo: '/IMG/clients/charzee.png', industry: 'EV charging & clean energy', project: 'charzee' },
  { name: 'Shree Krishna Children Hospital', logo: '/IMG/clients/shree-krishna-hospital.png', industry: 'Healthcare', project: 'shree-krishna-children-hospital' },
  { name: 'ThinkWave', logo: '/IMG/clients/thinkwave.png', industry: 'EdTech', project: 'thinkwave' },
  { name: 'Eyom Shopping', logo: '/IMG/clients/eyom.png', industry: 'E-commerce', project: 'eyom-shopping' },
  { name: 'Recoup Physiotherapy', logo: '/IMG/clients/recoup.png', industry: 'Healthcare', project: 'recoup-physiotherapy' },
  { name: 'Bharat Clothing Factory', logo: '/IMG/clients/bharat-clothing.png', industry: 'Apparel manufacturing', project: 'bharat-clothing-factory' },
  { name: 'Sharma Academy', logo: '/IMG/clients/sharma-academy.png', industry: 'Education', project: 'sharma-academy' },
  { name: 'Adonline Services', logo: '/IMG/clients/adonline.png', industry: 'Business services', project: 'adonline-services' },
  { name: 'SS Maintenance & Products', logo: '/IMG/clients/ss-maintenance.png', industry: 'Home services' },
  { name: 'Roommates.com', logo: '/IMG/clients/roommates.png', industry: 'Rental platform' },
  { name: 'Shri Naresh Techno Pvt. Ltd.', logo: '/IMG/clients/shree-naresh-tecno.png', industry: 'Industrial' },
  { name: 'Nritya Kala Dance Academy', logo: '/IMG/clients/nritya-kala.png', industry: 'Performing arts' },
];
export const CLIENTS_ON_HOME = 11;

/** `logo: true` = the avatar is the client's logo (shown uncropped on white), not a photo. */
export const testimonials = [
  { name: 'Charzee', avatar: '/IMG/clients/charzee.png', logo: true, role: 'EV charging & clean energy', text: 'UltraModern Technologies built a website that finally explains our full range, from AC and DC EV chargers to battery storage and solar, in a way our customers understand. Every product line has its own page, quote requests and brochure downloads come straight to us, and the site works smoothly on mobile. The team was quick to respond and handled every change we asked for.' },
  { name: 'AnZ Cabs & Logistics', avatar: '/IMG/clients/anz-cabs.png', logo: true, role: 'Ride & transport platform', text: 'UltraModern delivered our complete ride and parcel platform: customer and rider apps for Android and iOS, a website, and an operations admin panel with live tracking, wallets, and surge pricing. They understood how a transport business actually runs, kept us updated at every stage, and supported us through launch.' },
  { name: 'Grovio', avatar: '/IMG/clients/grovio.svg', logo: true, role: 'Grocery & quick commerce', text: 'Grovio needed five connected roles (customers, vendors, pickers, delivery partners, and admins) on one platform. UltraModern planned it properly, built the apps and panels on a single backend, and delivered each module in clear milestones. Their technical depth and ongoing support made a complex project feel manageable.' },
  { name: 'Nyāya Grantha Sarvasvam', avatar: '/IMG/clients/nyaya-grantha.png', logo: true, role: 'Education & research', text: 'Our goal was to make Nyāya texts accessible to students and scholars anywhere. UltraModern built a mobile-first library with transliteration, a terminology dictionary, audio recitations, and an AI assistant that also works offline. They took the time to understand our Sanskrit content and delivered a platform our scholars are proud to use.' },
  { name: 'Rhythm Multispeciality Hospital', avatar: '/IMG/clients/rhythm-hospital.webp', logo: true, role: 'Healthcare, Sironj', text: 'UltraModern Technologies gave Rhythm Hospital a fast, professional website where patients can read about our departments, request appointments, and reach us in an emergency. The admin panel lets our staff update the blog and gallery themselves, and the site was set up for local search from day one. A responsive and reliable team.' },
  { name: 'Shree Krishna Children Hospital', avatar: '/IMG/clients/shree-krishna-hospital.png', logo: true, role: 'Healthcare, Bhopal', text: 'Parents can now find the right department and doctor, and book an appointment, in a few taps. UltraModern designed a warm, mobile-first website that reflects the care we give children, and they delivered on time with every detail we asked for.' },
  { name: 'Eyom Shopping', avatar: '/IMG/testimonial-1.jpeg', role: 'E-commerce', text: 'Working with UltraModern Technologies has been a fantastic experience. Their team delivered a modern, responsive, and SEO-friendly website that helped us strengthen our online presence. Their professionalism, technical expertise, and customer support make them one of the best website development companies in Indore.' },
  { name: 'Recoup Physiotherapy', avatar: '/IMG/testimonial-2.jpeg', role: 'Healthcare', text: 'UltraModern Technologies transformed our vision into a professional website that perfectly represents our clinic. The design is clean, mobile-friendly, and easy for patients to navigate. Their team delivers exceptional quality and results.' },
  { name: 'SS Maintenance', avatar: '/IMG/testimonial-3.jpeg', role: 'Home services', text: 'The team created a website that improved our brand image and customer engagement. Their attention to detail, fast delivery, and technical expertise impressed us throughout the project. A trusted technology partner.' },
  { name: 'Roommates.com', avatar: '/IMG/testimonial-4.jpeg', role: 'Rental platform', text: 'We were impressed by the creativity and professionalism of UltraModern Technologies. They understood our requirements and delivered a fast, user-friendly website that exceeded our expectations. The process was smooth and transparent.' },
  { name: 'Thinkwave', avatar: '/IMG/testimonial-5.jpeg', role: 'EdTech', text: 'UltraModern Technologies helped us build a website that perfectly aligned with our business goals. Their team was responsive, knowledgeable, and committed to high-quality work. We appreciate their dedication and ongoing support.' },
];

export const milestones = [
  { value: 10, suffix: '+', label: 'Years of industry experience' },
  { value: 100, suffix: '+', label: 'Websites & apps delivered' },
  { value: 10, suffix: '+', label: 'Cities served across India' },
  { value: 50, suffix: '+', label: 'Experts on the team' },
];

export const homeFaqs = [
  { q: 'Do I really need a professional website for my business?', a: 'A professional website builds trust, improves online visibility, and makes it easier for customers to learn about your services and contact you. As a top website development company in Indore, UltraModern Technologies builds professional websites for every type of business.' },
  { q: 'How long does it take to build a custom website?', a: 'Typical business websites take 4–6 weeks, while complex e-commerce or custom web applications may take 8–12 weeks. We follow an agile process for transparency and timely delivery without compromising quality.' },
  { q: 'Why is my website not getting traffic from Google?', a: 'Poor site structure, slow loading speed, thin content, and technical SEO issues are the usual reasons. Working with an experienced SEO company in Indore improves visibility and organic growth.' },
  { q: 'What makes a website SEO-friendly?', a: 'Fast loading speed, mobile responsiveness, optimised content, and a clean technical structure. A reliable web development company focuses on both user experience and search performance.' },
  { q: 'Which is better for my business: SEO or Google Ads?', a: 'SEO builds long-term organic traffic, while Google Ads generates faster leads and visibility. Most businesses get the best results using both.' },
  { q: 'How can social media marketing help my business grow?', a: 'It increases brand awareness, builds engagement, and attracts potential leads through platforms like Facebook and Instagram.' },
  { q: 'What does a software development company actually do?', a: 'It creates custom software, business management systems, CRM solutions, and automation tools built around your specific business needs.' },
  { q: 'What is included in mobile app development services?', a: 'Design, development, testing, and deployment of Android and iOS apps, plus UI/UX design, performance optimisation, security, and regular updates after launch.' },
];

export const enquiryServices = [
  'Web Development', 'Mobile App Development', 'Custom Software Development', 'UI/UX Design',
  'Digital Marketing', 'Google Ads', 'SEO Services', 'Meta Ads', 'Google My Business Profile',
  'Social Media Marketing', 'CRM Software Development', 'AI & Machine Learning', 'IT Consulting',
  'IT Support & Managed Services', 'Other',
];

export const careerRoles = [
  { title: 'Senior Full Stack Developer', type: 'Full-time · Indore', exp: '3–6 yrs', icon: 'fa-solid fa-code', desc: 'Work with MERN/MEAN and Laravel to build scalable web apps.' },
  { title: 'React Native Engineer', type: 'Full-time · Indore', exp: '2–4 yrs', icon: 'fa-solid fa-mobile-screen', desc: 'Build cross-platform mobile apps with excellent performance.', href: '/react-native-developer-jobs' },
  { title: 'Digital Marketing Strategist', type: 'Full-time · Indore', exp: '2–5 yrs', icon: 'fa-solid fa-chart-simple', desc: 'Lead SEO, Google Ads, and Meta campaigns for global brands.' },
  { title: 'UI/UX Designer', type: 'Full-time · Indore', exp: '2–4 yrs', icon: 'fa-solid fa-palette', desc: 'Figma, design systems, and user research.' },
  { title: 'AI & ML Engineer', type: 'Full-time · Indore', exp: '1–3 yrs', icon: 'fa-solid fa-brain', desc: 'LLMs, Python, and computer-vision projects.' },
];
