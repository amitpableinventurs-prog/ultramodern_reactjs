import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import staticMeta from '../data/generated/static-meta.json';
import { CtaBand, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { useCmsList } from '../lib/cms.js';
import { fallbackPosts } from '../data/cmsFallback.js';
import { SITE_URL, company, serviceGroups } from '../data/site.js';
import { BlogCard } from './Home.jsx';
import { blogPostingLd } from '../lib/schema.js';

/* ------------------------------------------------------------ /blog */
export function Blog() {
  const [featured, ...rest] = useCmsList('posts', fallbackPosts);
  return (
    <>
      <Seo
        legacy={staticMeta['/blog']}
        jsonLd={[breadcrumbLd([['Home', '/'], ['Blog', '/blog']])]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Blog', '/blog']]}
        eyebrow="Knowledge hub"
        titleHtml="Insights across web, AI, software &amp; <span>digital marketing</span>"
        lead="Practical guides and industry trends, written from real experience delivering 250+ projects across healthcare, e-commerce, education, real estate, and professional services."
      />
      <section className="section">
        <div className="container">
          {!featured && <p className="lead center">New articles are coming soon.</p>}
          {featured && <Reveal as="article" className="featured-post">
            <Link to={`/${featured.slug}`} className="fp-media" tabIndex={-1} aria-hidden="true">{featured.cover ? <img src={featured.cover} alt="" /> : <span className="media-ph" />}</Link>
            <div className="fp-body">
              <span className="badge">Latest article</span>
              <h2><Link to={`/${featured.slug}`}>{featured.title}</Link></h2>
              <p className="blog-meta"><span><i className="fa-regular fa-calendar" /> {featured.date}</span><span><i className="fa-regular fa-user" /> {featured.author}</span><span><i className="fa-regular fa-clock" /> {featured.readingMinutes} min read</span></p>
              <p>{featured.excerpt}</p>
              <Link to={`/${featured.slug}`} className="btn btn-primary">Read article <i className="fa-solid fa-arrow-right" /></Link>
            </div>
          </Reveal>}
          <SectionHead eyebrow="All articles" title="Latest articles &amp; insights" />
          <div className="card-grid cols-3">
            {rest.map((b, i) => <BlogCard key={b.slug} post={b} index={i} />)}
          </div>
        </div>
      </section>
      <CtaBand title="Turn insights into results" text="Need help applying these ideas to your business? Our team can audit your website, marketing, or software and recommend next steps." />
    </>
  );
}

/* ------------------------------------------------------------ blog post */
export function BlogPost({ post }) {
  const others = useCmsList('posts', fallbackPosts).filter((b) => b.slug !== post.slug).slice(0, 3);
  const url = `${SITE_URL}/${post.slug}`;
  const crumbs = [['Home', '/'], ['Blog', '/blog'], [post.title, `/${post.slug}`]];
  const article = blogPostingLd(post);
  const share = encodeURIComponent(url);
  return (
    <>
      <Seo legacy={post.meta} title={`${post.title} | UltraModern Technologies`} description={post.excerpt} image={post.cover} type="article" jsonLd={[breadcrumbLd(crumbs), article]} />
      <PageHero
        compact
        crumbs={[['Home', '/'], ['Blog', '/blog'], ['Article', `/${post.slug}`]]}
        eyebrow={post.author}
        title={post.title}
        lead={<span className="post-meta"><span><i className="fa-regular fa-calendar" /> {post.date}</span><span><i className="fa-regular fa-clock" /> {post.readingMinutes} min read</span></span>}
      />
      <section className="section post-section">
        <div className="container post-layout">
          <article className="post">
            {post.cover && <img className="post-cover" src={post.cover} alt={post.title} />}
            <div className="rich prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="share">
              <span>Share this article</span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${share}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><i className="fa-brands fa-facebook-f" /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
              <a href={`https://twitter.com/intent/tweet?url=${share}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X"><i className="fa-brands fa-x-twitter" /></a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
            </div>
          </article>
          <aside className="post-aside">
            <div className="aside-card cta">
              <h3>Need expert help?</h3>
              <p>Get a free consultation with our team in Indore.</p>
              <Link to="/contact" className="btn btn-light btn-block">Contact us</Link>
              <a href={company.phoneHref} className="aside-phone"><i className="fa-solid fa-phone" /> {company.phone}</a>
            </div>
            <div className="aside-card">
              <h3>Popular services</h3>
              <ul className="aside-links">
                {[serviceGroups[1].items[0], serviceGroups[0].items[0], serviceGroups[2].items[0], serviceGroups[0].items[5], serviceGroups[3].items[2]].map(([n, s]) => (
                  <li key={s}><Link to={`/${s}`}>{n} <i className="fa-solid fa-arrow-right" /></Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <section className="section tint">
        <div className="container">
          <SectionHead eyebrow="Keep reading" title="More articles" />
          <div className="card-grid cols-3">{others.map((b, i) => <BlogCard key={b.slug} post={b} index={i} />)}</div>
        </div>
      </section>
    </>
  );
}
