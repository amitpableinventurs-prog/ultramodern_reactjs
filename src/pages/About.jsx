import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd, organizationLd } from '../components/Seo.jsx';
import staticMeta from '../data/generated/static-meta.json';
import { Counter, CtaBand, Icon, PageHero, Reveal, SectionHead } from '../components/ui.jsx';

const TIMELINE = [
  ['2019', 'Founded in Indore', 'UltraModern Technologies Pvt Ltd was established with a clear purpose: deliver honest, high-quality website and software solutions to growing businesses across India.', ['Company founded', 'First clients', 'Indore base']],
  ['2020', 'Team expands, scope widens', 'We grew to a 12-member team and landed our first enterprise client. With 50+ completed projects, our reputation as a reliable web and software development company took hold.', ['12-member team', '50+ projects', 'Enterprise clients']],
  ['2021', 'Full-service capability', 'We launched our digital marketing and mobile app divisions. Clients could now get their website built, ranked on Google, and supported by a dedicated app, all under one roof.', ['Digital marketing', '100+ projects', 'Mobile apps']],
  ['2022', 'Bengaluru office & AI division', 'We opened our Bengaluru branch and introduced AI and machine learning solutions. With 35+ professionals, UltraModern became a multi-city IT company.', ['Bengaluru office', '35+ professionals', 'AI & ML launch']],
  ['2023', '250+ projects, 150+ clients', 'A milestone year: 250+ successful projects and happy clients across 12+ cities, recognised as a trusted website development and software solution provider.', ['250+ projects', '150+ clients', '12+ cities']],
  ['2024+', 'Leading. Growing. Innovating.', 'Today we operate with 50+ professionals across Indore and Bengaluru, covering web, mobile, marketing, AI/ML, and enterprise software, with plans to expand across India and internationally.', ['50+ experts', 'Full-service IT', 'Pan-India']],
];

const VALUES = [
  ['fa-solid fa-lightbulb', 'Innovation with purpose', 'Every tool or framework we recommend is chosen because it fits your goals and will serve you well over time, not just at launch.'],
  ['fa-solid fa-gem', 'Uncompromising quality', 'Whether it’s a five-page website or an enterprise platform, every deliverable goes through structured review before it reaches you.'],
  ['fa-solid fa-comments', 'Transparent communication', 'Clear timelines, regular updates, honest feedback, and no hidden costs. It’s why clients keep coming back.'],
  ['fa-solid fa-headset', 'Dedicated client support', 'Our relationship doesn’t end at delivery. We provide prompt post-launch support, maintenance, and guidance.'],
  ['fa-solid fa-people-group', 'Experienced, versatile team', '50+ professionals across web, mobile, software, UI/UX, marketing, and AI, all under a single accountable partner.'],
  ['fa-solid fa-bullseye', 'Results, not just deliverables', 'We measure our work against your business outcomes: leads, sales, and efficiency, not just a project checklist.'],
];

const OFFER = [
  ['Website development', 'website-design-and-development-company-in-indore', 'fa-solid fa-globe', ['Business & corporate websites', 'E-commerce development', 'CRM & ERP web portals', 'Healthcare & education portals']],
  ['Mobile app development', 'best-mobile-app-development-company-in-indore', 'fa-solid fa-mobile-screen', ['Android & iOS apps', 'Hybrid & React Native apps', 'Windows apps', 'App maintenance']],
  ['Digital marketing', 'digital-marketing-company-in-indore', 'fa-solid fa-chart-line', ['SEO', 'Google Ads & Meta Ads', 'Social media marketing', 'Google Business Profile']],
  ['Software development', 'software-development-company-in-indore', 'fa-solid fa-laptop-code', ['HR & payroll', 'Hospital & school management', 'Inventory management', 'Jewellery & real-estate software']],
  ['AI & machine learning', 'artificial-intelligence-company-in-indore', 'fa-solid fa-brain', ['AI integration & consulting', 'ML models', 'Data analytics & BI', 'NLP & chatbots']],
  ['UI/UX design & IT consulting', 'best-ui-ux-design-company-in-indore', 'fa-solid fa-pen-ruler', ['UI/UX design & prototyping', 'Logo & brand identity', 'Brochure design', 'IT strategy & audits']],
];

export default function About() {
  return (
    <>
      <Seo
        legacy={staticMeta['/about']}
        jsonLd={[organizationLd, breadcrumbLd([['Home', '/'], ['About', '/about']])]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['About', '/about']]}
        eyebrow="10+ years of digital excellence"
        titleHtml="Your trusted technology partner for <span>business growth</span>"
        lead="UltraModern Technologies is a full-service IT company helping businesses across India build stronger digital foundations, from websites and mobile apps to enterprise software, AI, and result-driven marketing."
        actions={<><Link to="/contact" className="btn btn-light">Start a conversation</Link><Link to="/portfolio" className="btn btn-ghost-light">See our work</Link></>}
        aside={<div className="hero-photo"><img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900" alt="UltraModern Technologies team collaborating" /></div>}
      />

      <section className="section">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">Who we are</span>
            <h2>Building technology that businesses can rely on</h2>
            <p className="lead">UltraModern Technologies Pvt Ltd is based in Indore, with an office in Bengaluru and clients in 12+ cities across India.</p>
            <p>We work with startups, SMEs, and established enterprises to design, build, and grow their digital presence across website development, mobile apps, software engineering, digital marketing, and AI-driven solutions.</p>
            <p>What sets us apart is technical depth combined with practical focus. Our team understands business goals, timelines, and budgets, and every solution is built to work in the real world, whether it’s a fast e-commerce site, a custom ERP, a cross-platform app, or an SEO campaign that generates consistent leads.</p>
          </Reveal>
          <div className="stat-tiles">
            {[[250, '+', 'Projects delivered'], [150, '+', 'Happy clients'], [98, '%', 'Client satisfaction'], [12, '+', 'Cities served']].map(([v, s, l], i) => (
              <Reveal key={l} delay={i} className="stat-tile">
                <strong><Counter value={v} suffix={s} /></strong>
                <span>{l}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHead center eyebrow="Our story" title="The UltraModern journey" lead="Years of growth, learning, and building technology that makes a real difference." />
          <ol className="timeline">
            {TIMELINE.map(([year, title, text, tags], i) => (
              <Reveal as="li" key={year} delay={i % 2} className="tl-item">
                <span className="tl-year">{year}</span>
                <div className="tl-card">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className="tag-row">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Why choose us" title="What makes UltraModern different" lead="The biggest frustrations in tech projects aren’t technical: they’re communication, timelines, and trust. Here’s how we address them." />
          <div className="card-grid cols-3">
            {VALUES.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i} className="info-card">
                <span className="card-icon"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container mv-grid">
          <Reveal className="mv-card">
            <span className="mv-icon"><i className="fa-solid fa-crosshairs" /></span>
            <h2>Our mission</h2>
            <p>To help businesses in India and beyond use technology with confidence. We build websites, software, apps, and marketing systems that are reliable, well-designed, and built to last, making a measurable difference to every client’s business.</p>
          </Reveal>
          <Reveal className="mv-card" delay={1}>
            <span className="mv-icon"><i className="fa-solid fa-binoculars" /></span>
            <h2>Our vision</h2>
            <p>To be the technology partner Indian businesses grow with, not just a vendor they hire once: recognised for technical excellence, long-term relationships, and a team that treats every client goal as its own.</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="What we offer" title="Our services" lead="From your first website to complex enterprise software, we cover every stage of your digital journey." />
          <div className="card-grid cols-3">
            {OFFER.map(([title, slug, icon, items], i) => (
              <Reveal key={title} delay={i} className="info-card offer-card">
                <span className="offer-num">0{i + 1}</span>
                <span className="card-icon"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <ul className="ticks">{items.map((t) => <li key={t}>{t}</li>)}</ul>
                <Link to={`/${slug}`} className="card-link">Explore <i className="fa-solid fa-arrow-right" /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Ready to build something that works for your business?" text="Whether you’re starting from scratch or improving an existing presence, tell us what you need. No hard sell, just an honest conversation." />
    </>
  );
}
