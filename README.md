# UltraModern Technologies — React website

The ultramoderntechnologies.com website, built entirely in React (Vite + React Router), with an
admin panel for **Portfolio, Blog and Careers**. The old static HTML site has been removed from
this folder (a full backup is in `../UltraModern-legacy-html-backup.zip`); every old URL still
works through 301 redirects and keeps its original SEO tags.

- Static pages (home, about, services, job-track pages…) are **prerendered to HTML** at build time.
- Portfolio projects, blog posts and job openings are **managed in the admin panel** (`/admin`)
  and stored in a database via a small PHP API. Changes go live instantly; the server renders
  each of these pages with full SEO tags, so new content is indexable without a rebuild.

## Commands

```bash
npm install          # once
npm run dev          # website at http://localhost:5173 (or the next free port)
npm run api          # PHP API for the admin panel (run in a second terminal, needs php on PATH)
npm run build        # production build -> dist/
npm run seo:check    # after a build: confirm every old page kept its SEO tags + GTM
                     # (compares with scripts/seo-baseline.json, captured from the old HTML site;
                     #  or against a running server: npm run seo:check -- http://localhost:8088)
npm run extract -- <folder>   # one-time import tool: re-import content from an unzipped copy
                              # of the old HTML site (overwrites src/data/generated/)
npm run mockups      # regenerate illustrative portfolio previews (SVG)
```

## Admin panel (`/admin`)

**Local:** run `npm run dev` and `npm run api`, then open http://localhost:5173/admin.

**First time (local or live):** the admin page asks you to create an account. It needs a
one-time **setup key**, stored in the file `umt-data/setup-key.txt` (next to the website
folder; on the server open it with the hosting File Manager), or print it with
`php api/cli.php setup-key`. The key is deleted once the account exists.

What you can do:
- **Portfolio:** add/edit projects, upload screenshots (drag & drop, reorder, captions,
  browser/phone frame), case-study text, features, tech stack, filters, “New” spotlight.
- **Blog:** write posts in a visual editor (headings, lists, links, images, highlight boxes,
  or raw HTML), cover image, date/author, excerpt.
- **Careers:** job openings with type, location, experience, salary, skills and full description.
  Each opening gets its own page `/career/<slug>` with an application form.
- Every item: Published/Draft switch, page URL, reorder, delete, and **SEO settings**
  (meta title, description, keywords, noindex, structured data) with a Google preview.

On the first run the database imports the current portfolio, all 9 blog posts (with their
original SEO data) and the job openings. After that the database is the source of truth:
rebuilding or redeploying the site never overwrites admin changes.

Command-line helpers (run from the website folder on the server, or `public/` locally):

```bash
php api/cli.php info                                   # database + row counts
php api/cli.php create-admin "Name" you@mail.com "password"
php api/cli.php reset-password you@mail.com "new-password"
php api/cli.php setup-key
```

## Deploying (Apache + PHP 8, e.g. Hostinger / cPanel)

1. `npm run build`
2. Upload the **contents** of `dist/` to the web root (`public_html`), including the hidden
   `.htaccess` files. **Do not delete** the `uploads/` folder on the server when redeploying:
   it holds images uploaded in the admin.
3. Open `https://your-domain/admin` and create the admin account (see above).

Requirements: PHP 8.0+ with `pdo_sqlite` (default) or `pdo_mysql`, plus `gd` and `fileinfo`
(standard on Hostinger). The database lives in **`umt-data/`, created automatically next to
`public_html`** (outside the web root), so it is never publicly reachable and survives redeploys.

**Use MySQL instead of SQLite (optional):** create the file `umt-data/config.php`:

```php
<?php return ['db' => ['driver' => 'mysql', 'host' => 'localhost',
  'name' => 'DATABASE', 'user' => 'USER', 'pass' => 'PASSWORD']];
```

**Backups:** download `umt-data/` (database) and `public_html/uploads/` (images).

`dist/.htaccess` gives clean URLs (`/seo-company-in-indore`), 301-redirects every old
`.html` URL, routes `/admin`, the CMS pages and `/sitemap.xml` (generated live, includes all
published posts, projects and openings) to PHP, blocks internal files, returns a real 404 page,
and sets caching and compression. Uncomment the https/www block once SSL is confirmed.

## SEO and analytics carried over from the old site

Every page reuses the original page's `<head>` data unchanged: title, meta description,
keywords, robots, Open Graph tags, and all JSON-LD structured data (LocalBusiness, FAQPage,
Service, JobPosting, Organization, WebSite). Old blog posts keep this data in the database
(editable under “SEO” in the admin). Google Tag Manager (`GTM-PZQ6K54T`) is on every page,
and in-app navigation pushes a `virtual_page_view` event to the dataLayer.

## Where things live

| What | File |
|---|---|
| Company details, phone, offices, menus, testimonials, tech stack | `src/data/site.js` |
| Admin panel (UI) | `src/admin/` |
| CMS API, server renderer, sitemap (PHP) | `public/api/` |
| Live-content hooks used by the pages | `src/lib/cms.js` |
| Build-time copies of portfolio / jobs (first-run import + fallback) | `src/data/portfolio.js`, `src/data/site.js` |
| Service / job-track / privacy content (generated) | `src/data/generated/` |
| Pages | `src/pages/` |
| Layout (top bar, header, mega menu, footer, popup, social icons) | `src/components/Layout.jsx` |
| Social media links (top bar, footer, mobile menu) | `company.social` in `src/data/site.js`; icons in `public/social/` |
| Forms (EmailJS enquiry, career + resume upload) | `src/components/Forms.jsx` |
| Design system / all styles | `src/styles/global.css` |

### Editing service or job-track page content
These pages were imported from the old HTML site. Edit the JSON in
`src/data/generated/items/` directly, then rebuild.
