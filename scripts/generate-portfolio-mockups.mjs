/**
 * Generates themed UI preview screens (SVG) for every portfolio project:
 *   public/portfolio/<slug>/{desktop,mobile,admin}.svg
 *
 * These stand in until real screenshots are added. Replace them by dropping
 * real PNG/JPG files into the same folder and updating src/data/portfolio.js.
 *   node scripts/generate-portfolio-mockups.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'public', 'portfolio');

const FONT = `font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const P = {
  grovio: {
    name: 'Grovio', accent: '#16a34a', soft: '#dcfce7', layout: 'shop',
    nav: ['Shop', 'Offers', 'Categories', 'Track Order'],
    headline: ['Fresh groceries,', 'delivered in minutes'], sub: 'Fruits, vegetables, dairy & daily essentials',
    cta: 'Shop Now', cats: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks', 'Beverages'],
    items: [['Fresh Apples 1kg', '₹149'], ['Organic Tomatoes', '₹49'], ['Amul Milk 1L', '₹66'], ['Brown Bread', '₹45']],
    kpis: [['Orders today', '1,284'], ['Revenue', '₹2.4L'], ['Active riders', '86'], ['Low stock', '12']],
    table: ['Order', 'Customer', 'Items', 'Status'],
  },
  'ride-and-transport': {
    name: 'RideNow', accent: '#f59e0b', soft: '#fef3c7', layout: 'map', dark: true,
    nav: ['Ride', 'Drive', 'Business', 'Safety'],
    headline: ['Go anywhere with', 'a tap of a button'], sub: 'Bikes, autos & cabs at transparent fares',
    cta: 'Book a Ride', cats: ['Bike', 'Auto', 'Mini', 'Sedan', 'SUV'],
    items: [['Bike', '₹48'], ['Auto', '₹72'], ['Mini', '₹129'], ['Sedan', '₹168']],
    kpis: [['Trips today', '3,912'], ['Drivers online', '418'], ['Avg. ETA', '4 min'], ['Payouts', '₹6.1L']],
    table: ['Trip', 'Rider', 'Driver', 'Status'],
  },
  'real-estate': {
    name: 'HomeNest', accent: '#7c3aed', soft: '#ede9fe', layout: 'listings',
    nav: ['Buy', 'Rent', 'Commercial', 'Post Property'],
    headline: ['Find a home', 'you will love'], sub: 'Verified flats, villas & plots across the city',
    cta: 'Search', cats: ['Flats', 'Villas', 'Plots', 'Offices'],
    items: [['3 BHK Apartment, Vijay Nagar', '₹78 L'], ['Independent Villa, Bicholi', '₹1.6 Cr'], ['2 BHK Flat, AB Road', '₹42 L'], ['Office Space, Palasia', '₹35k/mo']],
    kpis: [['Active listings', '2,340'], ['New leads', '186'], ['Site visits', '64'], ['Deals closed', '19']],
    table: ['Lead', 'Property', 'Agent', 'Stage'],
  },
  'khushi-transport': {
    name: 'Khushi Transport', accent: '#dc2626', soft: '#fee2e2', layout: 'map',
    nav: ['Services', 'Fleet', 'Routes', 'Track Shipment'],
    headline: ['Reliable freight across', 'India, on time'], sub: 'Full truck load, part load & parcel services',
    cta: 'Get a Quote', cats: ['FTL', 'PTL', 'Parcel', 'Warehousing'],
    items: [['LR #KT-48213', 'In transit'], ['LR #KT-48190', 'Delivered'], ['LR #KT-48177', 'Picked up'], ['LR #KT-48102', 'Delivered']],
    kpis: [['Shipments', '642'], ['In transit', '138'], ['Fleet active', '57'], ['On-time', '96%']],
    table: ['LR No.', 'Route', 'Vehicle', 'Status'],
  },
  thinkwave: {
    name: 'ThinkWave', accent: '#2563eb', soft: '#dbeafe', layout: 'service',
    nav: ['Classes', 'Gradebook', 'Attendance', 'Messages'],
    headline: ['Smarter classrooms,', 'connected families'], sub: 'One platform for schools, teachers & parents',
    cta: 'Get Started', cats: ['Classes', 'Grades', 'Attendance', 'Homework', 'Reports', 'Messages'],
    items: [['Grade 8 – Science', '32 students'], ['Grade 9 – Maths', '28 students'], ['Grade 10 – English', '30 students'], ['Grade 7 – History', '26 students']],
    kpis: [['Students', '1,240'], ['Teachers', '68'], ['Attendance', '94%'], ['Assignments', '312']],
    table: ['Student', 'Class', 'Grade', 'Status'],
  },
  'eyom-shopping': {
    name: 'Eyom', accent: '#db2777', soft: '#fce7f3', layout: 'shop',
    nav: ['Shop', 'Services', 'Hardware', 'Orders'],
    headline: ['Everything for your home,', 'in one place'], sub: 'Book services & shop hardware together',
    cta: 'Explore', cats: ['Tools', 'Paints', 'Electrical', 'Plumbing', 'Decor', 'Services'],
    items: [['Drill Machine', '₹2,499'], ['LED Bulb Pack', '₹399'], ['Wall Paint 4L', '₹1,150'], ['Deep Cleaning', '₹1,999']],
    kpis: [['Orders', '624'], ['Bookings', '211'], ['Revenue', '₹3.1L'], ['Returns', '1.2%']],
    table: ['Order', 'Customer', 'Type', 'Status'],
  },
  'bharat-clothing-factory': {
    name: 'Bharat Clothing', accent: '#b45309', soft: '#fef3c7', layout: 'shop',
    nav: ['Collections', 'Corporate', 'Uniforms', 'Contact'],
    headline: ['Custom apparel,', 'made for your brand'], sub: 'T-shirts, uniforms & corporate merchandise',
    cta: 'Request Quote', cats: ['T-Shirts', 'Polo', 'Hoodies', 'Uniforms', 'Caps', 'Jackets'],
    items: [['Custom Polo T-shirt', 'MOQ 50'], ['Corporate Hoodie', 'MOQ 30'], ['School Uniform', 'MOQ 100'], ['Printed Cap', 'MOQ 100']],
    kpis: [['Enquiries', '96'], ['Bulk orders', '28'], ['In production', '14'], ['Dispatched', '11']],
    table: ['Enquiry', 'Company', 'Product', 'Status'],
  },
  'recoup-physiotherapy': {
    name: 'Recoup Physio', accent: '#0d9488', soft: '#ccfbf1', layout: 'service',
    nav: ['Treatments', 'Doctors', 'About', 'Book Appointment'],
    headline: ['Move better.', 'Recover faster.'], sub: 'Expert physiotherapy care in Indore',
    cta: 'Book Appointment', cats: ['Back Pain', 'Sports Injury', 'Neuro Rehab', 'Post Surgery', 'Posture', 'Joint Pain'],
    items: [['Initial Assessment', '45 min'], ['Sports Rehab', '60 min'], ['Spine Care', '45 min'], ['Home Visit', '60 min']],
    kpis: [['Appointments', '148'], ['New patients', '37'], ['Sessions', '412'], ['Rating', '4.9★']],
    table: ['Patient', 'Treatment', 'Therapist', 'Status'],
  },
  'sharma-academy': {
    name: 'Sharma Academy', accent: '#b91c1c', soft: '#fee2e2', layout: 'service',
    nav: ['Courses', 'Batches', 'Free Lectures', 'Admissions'],
    headline: ['Prepare for MPPSC', '& UPSC with experts'], sub: 'Classroom and online coaching in Indore',
    cta: 'Enquire Now', cats: ['MPPSC Prelims', 'MPPSC Mains', 'UPSC', 'Test Series', 'Video Lectures', 'Study Material'],
    items: [['MPPSC Foundation', '1 year'], ['MPPSC Mains Batch', '6 months'], ['UPSC GS Course', '1 year'], ['Test Series', '30 tests']],
    kpis: [['Enquiries', '214'], ['New admissions', '58'], ['Active batches', '12'], ['Demo classes', '31']],
    table: ['Student', 'Course', 'Batch', 'Status'],
  },
  'adonline-services': {
    name: 'Adonline Services', accent: '#f59e0b', soft: '#fef3c7', layout: 'service',
    nav: ['Services', 'About', 'Clients', 'Contact'],
    headline: ['Grow your business', 'online with us'], sub: 'Online services for growing businesses',
    cta: 'Get in Touch', cats: ['Services', 'Solutions', 'Support', 'Consulting', 'Pricing', 'Contact'],
    items: [['Service enquiry', 'New'], ['Consultation', 'Scheduled'], ['Quote request', 'Sent'], ['Support ticket', 'Closed']],
    kpis: [['Enquiries', '96'], ['Leads', '41'], ['Quotes sent', '18'], ['Clients', '120+']],
    table: ['Lead', 'Service', 'Source', 'Status'],
  },
};

/* ---------------------------------------------------------------- pieces */

const rect = (x, y, w, h, fill, r = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, s, size, fill, weight = 400, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const bar = (x, y, w, h, fill) => rect(x, y, w, h, fill, h / 2);

function logo(x, y, p, light = false) {
  return `${rect(x, y - 22, 30, 30, p.accent, 8)}${text(x + 15, y - 1, p.name[0], 17, '#fff', 800, 'middle')}${text(x + 40, y, p.name, 20, light ? '#fff' : '#0f172a', 800)}`;
}

function mapArt(x, y, w, h, p) {
  const roads = [];
  for (let i = 1; i < 7; i++) roads.push(`<line x1="${x}" y1="${y + (h * i) / 7}" x2="${x + w}" y2="${y + (h * i) / 7 + 30}" stroke="#ffffff" stroke-width="${i % 3 ? 6 : 12}" opacity="0.9"/>`);
  for (let i = 1; i < 8; i++) roads.push(`<line x1="${x + (w * i) / 8}" y1="${y}" x2="${x + (w * i) / 8 - 40}" y2="${y + h}" stroke="#ffffff" stroke-width="${i % 3 ? 6 : 12}" opacity="0.9"/>`);
  const route = `M ${x + w * 0.18} ${y + h * 0.78} C ${x + w * 0.35} ${y + h * 0.55}, ${x + w * 0.45} ${y + h * 0.7}, ${x + w * 0.58} ${y + h * 0.42} S ${x + w * 0.78} ${y + h * 0.22}, ${x + w * 0.84} ${y + h * 0.2}`;
  return `<g>
    ${rect(x, y, w, h, '#e8eef3', 0)}
    ${rect(x + w * 0.62, y + h * 0.55, w * 0.25, h * 0.3, '#d4ebd6', 0)}
    ${rect(x + w * 0.05, y + h * 0.08, w * 0.2, h * 0.25, '#d4ebd6', 0)}
    ${roads.join('')}
    <path d="${route}" fill="none" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="${x + w * 0.18}" cy="${y + h * 0.78}" r="11" fill="#0f172a"/><circle cx="${x + w * 0.18}" cy="${y + h * 0.78}" r="4" fill="#fff"/>
    <circle cx="${x + w * 0.84}" cy="${y + h * 0.2}" r="13" fill="${p.accent}"/><circle cx="${x + w * 0.84}" cy="${y + h * 0.2}" r="5" fill="#fff"/>
    ${rect(x + w * 0.45, y + h * 0.52, 34, 20, '#0f172a', 6)}
  </g>`;
}

function tile(x, y, w, h, p, i) {
  const tints = [p.soft, '#f1f5f9', p.soft, '#f8fafc'];
  return `${rect(x, y, w, h, tints[i % 4], 14)}<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${Math.min(w, h) * 0.24}" fill="${p.accent}" opacity="${0.25 + (i % 3) * 0.2}"/>`;
}

function propertyImg(x, y, w, h, p, i) {
  const skies = ['#c7d2fe', '#bae6fd', '#ddd6fe', '#a5f3fc'];
  return `<g>${rect(x, y, w, h, skies[i % 4], 14)}
    <polygon points="${x + w * 0.2},${y + h * 0.55} ${x + w * 0.5},${y + h * 0.25} ${x + w * 0.8},${y + h * 0.55}" fill="${p.accent}" opacity="0.85"/>
    ${rect(x + w * 0.27, y + h * 0.55, w * 0.46, h * 0.33, '#ffffff', 0)}
    ${rect(x + w * 0.45, y + h * 0.66, w * 0.1, h * 0.22, p.accent, 0, 'opacity="0.6"')}
    ${rect(x + w * 0.32, y + h * 0.62, w * 0.09, h * 0.09, '#cbd5e1', 0)}${rect(x + w * 0.59, y + h * 0.62, w * 0.09, h * 0.09, '#cbd5e1', 0)}
    ${rect(x, y + h * 0.88, w, h * 0.12, '#86efac', 0, 'opacity="0.7"')}</g>`;
}

/* --------------------------------------------------------------- desktop */

function desktop(p) {
  const W = 1440, H = 900;
  const dark = !!p.dark;
  const bg = dark ? '#0b1220' : '#ffffff';
  const ink = dark ? '#ffffff' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ${FONT}>`;
  s += rect(0, 0, W, H, bg);
  // nav
  s += logo(72, 62, p, dark);
  p.nav.forEach((n, i) => { s += text(560 + i * 150, 60, n, 16, muted, 500); });
  s += rect(1220, 34, 150, 44, p.accent, 22) + text(1295, 62, p.cta, 15, '#fff', 700, 'middle');

  if (p.layout === 'map') {
    s += mapArt(720, 110, 720, 560, p);
    s += text(72, 220, p.headline[0], 54, ink, 800) + text(72, 286, p.headline[1], 54, p.accent, 800);
    s += text(72, 336, p.sub, 20, muted, 400);
    s += rect(72, 380, 560, 210, dark ? '#111a2e' : '#ffffff', 20, `stroke="${dark ? '#1e293b' : '#e2e8f0'}" stroke-width="2"`);
    s += `<circle cx="104" cy="425" r="7" fill="${ink}"/>` + text(126, 431, 'Pickup location', 17, muted) + rect(104, 448, 2, 34, muted);
    s += `<circle cx="104" cy="500" r="7" fill="${p.accent}"/>` + text(126, 506, 'Where to?', 17, muted);
    s += rect(96, 530, 512, 44, p.accent, 12) + text(352, 558, p.cta, 17, '#fff', 700, 'middle');
    s += rect(0, 670, W, 230, dark ? '#0f172a' : '#f8fafc');
    p.items.forEach(([a, b], i) => {
      const x = 72 + i * 330;
      s += rect(x, 710, 300, 140, dark ? '#111a2e' : '#ffffff', 18, `stroke="${dark ? '#1e293b' : '#e2e8f0'}"`);
      s += rect(x + 24, 734, 52, 52, p.soft, 14) + `<circle cx="${x + 50}" cy="760" r="12" fill="${p.accent}"/>`;
      s += text(x + 92, 756, a, 18, ink, 700) + text(x + 92, 782, b, 16, p.accent, 700);
      s += bar(x + 24, 812, 220, 10, dark ? '#1e293b' : '#e2e8f0');
    });
  } else if (p.layout === 'listings') {
    s += rect(0, 100, W, 380, p.soft);
    s += text(720, 210, `${p.headline[0]} ${p.headline[1]}`, 54, ink, 800, 'middle');
    s += text(720, 256, p.sub, 20, muted, 400, 'middle');
    s += rect(300, 300, 840, 76, '#ffffff', 38, 'stroke="#e2e8f0" stroke-width="2"');
    p.cats.forEach((c, i) => { s += text(350 + i * 140, 345, c, 16, i === 0 ? p.accent : muted, 600); });
    s += rect(960, 312, 164, 52, p.accent, 26) + text(1042, 345, p.cta, 17, '#fff', 700, 'middle');
    s += text(72, 540, 'Featured properties', 26, ink, 800);
    p.items.forEach(([a, b], i) => {
      const x = 72 + i * 330;
      s += rect(x, 570, 300, 300, '#ffffff', 18, 'stroke="#e2e8f0"');
      s += propertyImg(x + 12, 582, 276, 170, p, i);
      s += text(x + 20, 784, b, 20, p.accent, 800) + text(x + 20, 812, a.length > 28 ? a.slice(0, 27) + '…' : a, 15, ink, 600);
      s += bar(x + 20, 832, 70, 12, '#e2e8f0') + bar(x + 100, 832, 70, 12, '#e2e8f0') + bar(x + 180, 832, 70, 12, '#e2e8f0');
    });
  } else {
    // shop + service share a hero with a visual, then a grid
    s += rect(40, 100, W - 80, 400, p.navy || p.soft, 28);
    const heroInk = p.navy ? '#ffffff' : ink;
    s += text(110, 230, p.headline[0], 52, heroInk, 800) + text(110, 292, p.headline[1], 52, p.navy ? '#fdba74' : p.accent, 800);
    s += text(110, 340, p.sub, 20, p.navy ? '#cbd5e1' : muted, 400);
    s += rect(110, 380, 200, 56, p.accent, 28) + text(210, 415, p.cta, 17, '#fff', 700, 'middle');
    s += `<circle cx="1060" cy="300" r="170" fill="${p.accent}" opacity="0.18"/><circle cx="1060" cy="300" r="110" fill="${p.accent}" opacity="0.35"/>`;
    s += rect(960, 200, 200, 200, '#ffffff', 28, 'opacity="0.95"') + `<circle cx="1060" cy="300" r="54" fill="${p.accent}"/>`;
    s += text(72, 560, p.layout === 'shop' ? 'Shop by category' : 'Popular services', 26, ink, 800);
    p.cats.slice(0, 6).forEach((c, i) => {
      const x = 72 + i * 220;
      s += tile(x, 585, 196, 110, p, i) + text(x + 98, 720, c, 16, ink, 600, 'middle');
    });
    p.items.forEach(([a, b], i) => {
      const x = 72 + i * 330;
      s += rect(x, 750, 300, 120, '#ffffff', 18, 'stroke="#e2e8f0"');
      s += rect(x + 16, 766, 88, 88, p.soft, 14) + `<circle cx="${x + 60}" cy="810" r="22" fill="${p.accent}" opacity="0.7"/>`;
      s += text(x + 120, 798, a.length > 20 ? a.slice(0, 19) + '…' : a, 16, ink, 700) + text(x + 120, 826, b, 17, p.accent, 800);
      s += rect(x + 236, 830, 48, 28, p.accent, 8) + text(x + 260, 849, '+', 18, '#fff', 700, 'middle');
    });
  }
  return s + '</svg>';
}

/* ---------------------------------------------------------------- mobile */

function mobile(p) {
  const W = 390, H = 844;
  const dark = !!p.dark;
  const bg = dark ? '#0b1220' : '#ffffff';
  const ink = dark ? '#ffffff' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ${FONT}>`;
  s += rect(0, 0, W, H, bg);
  s += text(28, 34, '9:41', 15, ink, 700) + rect(330, 22, 30, 13, ink, 4);
  if (p.layout === 'map') {
    s += mapArt(0, 50, W, 470, p);
    s += rect(20, 70, W - 40, 50, '#ffffff', 25, 'stroke="#e2e8f0"') + `<circle cx="48" cy="95" r="7" fill="${p.accent}"/>` + text(66, 101, p.layout === 'map' && p.name.includes('Transport') ? 'Enter LR / tracking number' : 'Where to?', 15, '#64748b');
    s += rect(0, 490, W, 354, dark ? '#111a2e' : '#ffffff', 28);
    s += bar(170, 504, 50, 5, '#cbd5e1');
    s += text(24, 548, p.name.includes('Transport') ? 'Your shipments' : 'Choose a ride', 20, ink, 800);
    p.items.slice(0, 3).forEach(([a, b], i) => {
      const y = 568 + i * 72;
      s += rect(20, y, W - 40, 62, i === 0 ? p.soft : (dark ? '#0f172a' : '#f8fafc'), 14, i === 0 ? `stroke="${p.accent}" stroke-width="2"` : '');
      s += rect(34, y + 12, 38, 38, dark && i ? '#1e293b' : '#ffffff', 10) + `<circle cx="53" cy="${y + 31}" r="9" fill="${p.accent}"/>`;
      s += text(86, y + 37, a, 16, i === 0 ? '#0f172a' : ink, 700) + text(W - 36, y + 37, b, 15, i === 0 ? '#0f172a' : p.accent, 800, 'end');
    });
    s += rect(20, 784, W - 40, 50, p.accent, 14) + text(W / 2, 815, p.cta, 17, '#fff', 700, 'middle');
  } else {
    s += logo(24, 86, p, dark);
    s += `<circle cx="352" cy="78" r="18" fill="${p.soft}"/>`;
    s += rect(20, 112, W - 40, 46, '#f1f5f9', 23) + text(46, 141, 'Search…', 15, '#94a3b8');
    s += rect(20, 174, W - 40, 170, p.navy || p.accent, 22);
    s += text(40, 226, p.headline[0], 22, '#fff', 800) + text(40, 254, p.headline[1], 22, '#fff', 800);
    s += rect(40, 282, 130, 38, '#ffffff', 19) + text(105, 306, p.cta, 14, p.navy || p.accent, 700, 'middle');
    s += `<circle cx="318" cy="290" r="44" fill="#ffffff" opacity="0.2"/>`;
    s += text(20, 382, p.layout === 'listings' ? 'Near you' : 'Categories', 18, ink, 800);
    if (p.layout === 'listings') {
      p.items.slice(0, 2).forEach(([a, b], i) => {
        const y = 400 + i * 210;
        s += rect(20, y, W - 40, 196, '#ffffff', 18, 'stroke="#e2e8f0"') + propertyImg(30, y + 10, W - 60, 120, p, i);
        s += text(34, y + 158, b, 18, p.accent, 800) + text(34, y + 182, a.length > 30 ? a.slice(0, 29) + '…' : a, 14, ink, 600);
      });
    } else {
      p.cats.slice(0, 4).forEach((c, i) => {
        const x = 20 + i * 88;
        s += tile(x, 398, 78, 78, p, i) + text(x + 39, 494, c.length > 10 ? c.slice(0, 9) + '…' : c, 12, ink, 600, 'middle');
      });
      p.items.slice(0, 3).forEach(([a, b], i) => {
        const y = 516 + i * 86;
        s += rect(20, y, W - 40, 74, '#ffffff', 16, 'stroke="#e2e8f0"') + rect(30, y + 10, 54, 54, p.soft, 12);
        s += `<circle cx="57" cy="${y + 37}" r="13" fill="${p.accent}" opacity="0.7"/>`;
        s += text(98, y + 33, a, 15, ink, 700) + text(98, y + 56, b, 14, p.accent, 800);
        s += rect(W - 72, y + 22, 36, 30, p.accent, 9) + text(W - 54, y + 43, '+', 17, '#fff', 700, 'middle');
      });
    }
    // tab bar
    s += rect(0, 784, W, 60, '#ffffff', 0, 'stroke="#e2e8f0"');
    for (let i = 0; i < 4; i++) s += `<circle cx="${60 + i * 90}" cy="808" r="9" fill="${i === 0 ? p.accent : '#cbd5e1'}"/>` + bar(45 + i * 90, 824, 30, 5, i === 0 ? p.accent : '#e2e8f0');
  }
  return s + '</svg>';
}

/* ----------------------------------------------------------------- admin */

function admin(p) {
  const W = 1440, H = 900;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ${FONT}>`;
  s += rect(0, 0, W, H, '#f1f5f9');
  s += rect(0, 0, 260, H, '#0f172a');
  s += logo(28, 60, p, true);
  ['Dashboard', ...p.nav, 'Reports', 'Settings'].forEach((n, i) => {
    const y = 120 + i * 52;
    if (i === 0) s += rect(16, y - 6, 228, 42, p.accent, 10);
    s += rect(36, y + 6, 18, 18, i === 0 ? '#fff' : '#475569', 5) + text(68, y + 21, n, 15, i === 0 ? '#fff' : '#94a3b8', 600);
  });
  s += text(300, 70, 'Dashboard', 28, '#0f172a', 800) + text(300, 98, `Welcome back, ${p.name} admin`, 15, '#64748b');
  s += rect(1072, 44, 260, 42, '#ffffff', 21, 'stroke="#e2e8f0"') + text(1104, 71, 'Search…', 14, '#94a3b8');
  s += `<circle cx="1372" cy="65" r="20" fill="${p.accent}"/>`;
  p.kpis.forEach(([label, val], i) => {
    const x = 300 + i * 278;
    s += rect(x, 130, 258, 120, '#ffffff', 16);
    s += text(x + 22, 168, label, 14, '#64748b', 600) + text(x + 22, 212, val, 30, '#0f172a', 800);
    s += rect(x + 196, 150, 42, 42, p.soft, 12) + `<circle cx="${x + 217}" cy="171" r="9" fill="${p.accent}"/>`;
    s += text(x + 22, 236, `▲ ${8 + i * 3}% this week`, 12, '#16a34a', 600);
  });
  // chart
  s += rect(300, 274, 720, 320, '#ffffff', 16) + text(324, 312, 'Performance overview', 18, '#0f172a', 800);
  const vals = [40, 62, 48, 75, 58, 88, 70, 95, 80, 104, 92, 118];
  vals.forEach((v, i) => {
    const h = v * 1.8;
    s += rect(330 + i * 54, 560 - h, 30, h, i === vals.length - 1 ? p.accent : p.soft, 6);
  });
  s += rect(1040, 274, 352, 320, '#ffffff', 16) + text(1064, 312, 'Breakdown', 18, '#0f172a', 800);
  s += `<circle cx="1216" cy="440" r="90" fill="none" stroke="${p.soft}" stroke-width="34"/>`;
  s += `<circle cx="1216" cy="440" r="90" fill="none" stroke="${p.accent}" stroke-width="34" stroke-dasharray="380 566" transform="rotate(-90 1216 440)"/>`;
  s += text(1216, 448, '67%', 26, '#0f172a', 800, 'middle');
  // table
  s += rect(300, 616, 1092, 260, '#ffffff', 16) + text(324, 654, 'Recent activity', 18, '#0f172a', 800);
  p.table.forEach((c, i) => { s += text(324 + i * 260, 692, c, 13, '#64748b', 700); });
  const statuses = ['Completed', 'In progress', 'Pending', 'Completed'];
  for (let r = 0; r < 4; r++) {
    const y = 712 + r * 40;
    s += rect(316, y, 1060, 1, '#e2e8f0');
    s += bar(324, y + 16, 90, 10, '#cbd5e1') + bar(584, y + 16, 130, 10, '#e2e8f0') + bar(844, y + 16, 110, 10, '#e2e8f0');
    const st = statuses[r];
    const c = st === 'Completed' ? ['#dcfce7', '#15803d'] : st === 'Pending' ? ['#fef3c7', '#b45309'] : [p.soft, p.accent];
    s += rect(1124, y + 8, 110, 26, c[0], 13) + text(1179, y + 26, st, 12, c[1], 700, 'middle');
  }
  return s + '</svg>';
}

// Projects that already ship real screenshots get no generated previews
// (Grovio keeps store/app previews next to its real admin & login captures).
const REAL = { 'ride-and-transport': [], 'real-estate': [], 'khushi-transport': [], grovio: ['desktop', 'mobile'] };

let count = 0;
for (const [slug, p] of Object.entries(P)) {
  const wanted = REAL[slug] ?? ['desktop', 'mobile', 'admin'];
  if (!wanted.length) continue;
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  const render = { desktop, mobile, admin };
  for (const kind of wanted) fs.writeFileSync(path.join(dir, `${kind}.svg`), render[kind](p));
  count++;
}
console.log(`Generated previews for ${count} projects in ${OUT}`);
