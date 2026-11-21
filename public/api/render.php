<?php
declare(strict_types=1);

/**
 * Server-side SEO renderer for CMS pages (blog, portfolio, careers).
 * Apache routes these URLs here (see /.htaccess). The page is served with
 * correct <title>, meta tags, canonical URL, JSON-LD and readable content
 * straight from the database, so new or edited content is SEO-ready instantly.
 * React then renders the interactive page on top (data-csr + __UMT_DATA__).
 */

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/content.php';

const BRAND = 'UltraModern Technologies';

$site = rtrim((string) cfg('site_dir'), '/\\');
$siteUrl = rtrim((string) cfg('site_url'), '/');
$path = trim((string) ($_GET['path'] ?? ''), '/');

function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function not_found(string $site): void
{
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile($site . '/404.html');
    exit;
}

function snapshot_file(string $site, string $path): string
{
    return $site . '/_snapshots/' . ($path === '' ? 'index' : $path) . '.html';
}

/** Serve the build-time snapshot unchanged (used when the database is unavailable). */
function serve_snapshot_or_404(string $site, string $path): void
{
    $file = snapshot_file($site, $path);
    if (is_file($file)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($file);
        exit;
    }
    not_found($site);
}

function abs_url(string $siteUrl, string $u): string
{
    if ($u === '') {
        return $siteUrl . '/IMG/umt-logo.png';
    }
    return preg_match('~^https?://~', $u) ? $u : $siteUrl . implode('/', array_map('rawurlencode', explode('/', $u)));
}

function head_html(array $m): string
{
    $tags = ['<title data-rh="true">' . e($m['title']) . '</title>'];
    $meta = function (string $attr, string $key, ?string $val) use (&$tags) {
        if ($val !== null && $val !== '') {
            $tags[] = '<meta data-rh="true" ' . $attr . '="' . e($key) . '" content="' . e($val) . '"/>';
        }
    };
    $meta('name', 'description', $m['description'] ?? '');
    $meta('name', 'keywords', $m['keywords'] ?? '');
    $tags[] = '<link data-rh="true" rel="canonical" href="' . e($m['canonical']) . '"/>';
    $meta('name', 'robots', $m['robots'] ?? 'index, follow');
    $meta('property', 'og:type', $m['ogType'] ?? 'website');
    $meta('property', 'og:site_name', BRAND);
    $meta('property', 'og:title', $m['ogTitle'] ?? $m['title']);
    $meta('property', 'og:description', $m['ogDescription'] ?? ($m['description'] ?? ''));
    $meta('property', 'og:url', $m['canonical']);
    $meta('property', 'og:image', $m['image']);
    $meta('name', 'twitter:card', 'summary_large_image');
    foreach ($m['jsonLd'] ?? [] as $ld) {
        $tags[] = '<script data-rh="true" type="application/ld+json">'
            . json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>';
    }
    return implode("\n    ", $tags);
}

/** Legacy structured data first; generated blocks only when their type is not already present. */
function merge_ld(array $legacy, array $extra): array
{
    $types = [];
    foreach ($legacy as $ld) {
        foreach ((array) ($ld['@type'] ?? []) as $t) {
            $types[$t] = true;
        }
    }
    foreach ($extra as $ld) {
        $t = (array) ($ld['@type'] ?? []);
        if (!array_intersect($t, array_keys($types))) {
            $legacy[] = $ld;
        }
    }
    return $legacy;
}

function breadcrumb_ld(string $siteUrl, array $items): array
{
    $list = [];
    foreach ($items as $i => [$name, $p]) {
        $list[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $name, 'item' => $siteUrl . $p];
    }
    return ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $list];
}

/* JSON-LD builders. KEEP IN SYNC with src/lib/schema.js (React replaces these tags in the browser). */

const ORG_NAME = 'UltraModern Technologies Pvt. Ltd.';

function org_ref(string $siteUrl): array
{
    return ['@type' => 'Organization', 'name' => ORG_NAME, 'url' => $siteUrl . '/', 'logo' => $siteUrl . '/IMG/umt-logo.png'];
}

/** "10 July 2026" / "July 10, 2026" / "2026-07-10" → "2026-07-10" (or null). */
function iso_date(?string $s): ?string
{
    $s = trim((string) $s);
    if ($s === '') {
        return null;
    }
    if (preg_match('~^\d{4}-\d{2}-\d{2}~', $s)) {
        return substr($s, 0, 10);
    }
    $d = date_create_immutable($s, new DateTimeZone('UTC'));
    return $d ? $d->format('Y-m-d') : null;
}

/** Drop empty values, like clean() in schema.js. */
function ld_clean(array $o): array
{
    return array_filter($o, fn($v) => $v !== null && $v !== '' && $v !== []);
}

function job_address(string $location): array
{
    return preg_match('~bengaluru|bangalore~i', $location)
        ? ['@type' => 'PostalAddress', 'streetAddress' => 'Aviator Building, Whitefield Main Rd, Pattandur Agrahara, Whitefield', 'addressLocality' => 'Bengaluru', 'addressRegion' => 'Karnataka', 'postalCode' => '560066', 'addressCountry' => 'IN']
        : ['@type' => 'PostalAddress', 'streetAddress' => '565, Sapna Sangeeta Rd, near Axis Bank, Snehnagar', 'addressLocality' => 'Indore', 'addressRegion' => 'Madhya Pradesh', 'postalCode' => '452001', 'addressCountry' => 'IN'];
}

function employment_type(string $type): string
{
    if (stripos($type, 'part') !== false) return 'PART_TIME';
    if (stripos($type, 'intern') !== false) return 'INTERN';
    if (preg_match('~contract|freelance~i', $type)) return 'CONTRACTOR';
    return 'FULL_TIME';
}

function page_html(string $html, string $head, string $body, array $data): string
{
    // drop head tags from a snapshot (react-helmet marks them with data-rh) before injecting new ones
    if ($head !== '') {
        $html = preg_replace('~<(title|meta|link|script)\b[^>]*\bdata-rh="true"[^>]*>(?:.*?</\1>)?\s*~is', '', $html);
        $html = str_replace('</head>', '    ' . $head . "\n  </head>", $html);
    }
    $payload = '<script>window.__UMT_DATA__=' . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) . ';</script>';
    // callback replacement: content is inserted literally ($ and \ in articles stay intact)
    $html = preg_replace_callback(
        '~<div id="root">.*</div>(?=\s*</body>)~s',
        fn() => '<div id="root" data-csr="1">' . $body . "</div>\n    " . $payload,
        $html,
        1,
        $count
    );
    if (!$count) {
        // template layout changed: inject the payload before </body> as a fallback
        $html = str_replace('</body>', $payload . '</body>', $html);
    }
    return $html;
}

function output(string $html): void
{
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache');
    echo $html;
    exit;
}

/* ------------------------------------------------------------------ route */

try {
    db();
} catch (Throwable $e) {
    error_log('[umt-render] ' . $e->getMessage());
    serve_snapshot_or_404($site, $path);
}

$segments = explode('/', $path);
$template = (string) @file_get_contents($site . '/_template.html');

// List pages keep their SEO head from the build snapshot (identical to the old site)
// and receive fresh items from the database.
$lists = ['blog' => 'posts', 'portfolio' => 'projects', 'career' => 'jobs'];
if (count($segments) === 1 && isset($lists[$path])) {
    $type = $lists[$path];
    $items = list_rows($type);
    if ($type === 'posts') {
        $items = array_map(function ($p) { unset($p['content']); return $p; }, $items);
    }
    $snap = snapshot_file($site, $path);
    $html = is_file($snap) ? (string) file_get_contents($snap) : $template;
    // keep the prerendered body for crawlers; React re-renders it with the fresh list
    if (preg_match('~<div id="root">(.*)</div>\s*</body>~s', $html, $m)) {
        $body = $m[1];
    } else {
        $body = '';
    }
    output(page_html($html, '', $body, ['kind' => $type, 'path' => '/' . $path, 'items' => $items]));
}

$pageType = null;
$slug = '';
if (count($segments) === 2 && $segments[0] === 'portfolio') {
    [$pageType, $slug] = ['projects', $segments[1]];
} elseif (count($segments) === 2 && $segments[0] === 'career') {
    [$pageType, $slug] = ['jobs', $segments[1]];
} elseif (count($segments) === 1 && $path !== '') {
    [$pageType, $slug] = ['posts', $segments[0]];
}
if (!$pageType || $template === '') {
    not_found($site);
}
$item = find_row($pageType, $slug);
if (!$item) {
    not_found($site);
}
$meta = $item['meta'] ?? [];
$canonicalPath = ['posts' => '/', 'projects' => '/portfolio/', 'jobs' => '/career/'][$pageType] . $item['slug'];
$canonical = $siteUrl . $canonicalPath;

if ($pageType === 'posts') {
    $title = $meta['title'] ?? ($item['title'] . ' | ' . BRAND);
    $desc = $meta['description'] ?? ($item['excerpt'] ?? '');
    $image = abs_url($siteUrl, $meta['ogImage'] ?? ($item['cover'] ?? ''));
    $ld = merge_ld($meta['jsonLd'] ?? [], [
        breadcrumb_ld($siteUrl, [['Home', '/'], ['Blog', '/blog'], [$item['title'], $canonicalPath]]),
        ld_clean([
            '@context' => 'https://schema.org', '@type' => 'BlogPosting', 'headline' => $item['title'],
            'description' => $meta['description'] ?? ($item['excerpt'] ?? ''),
            'image' => abs_url($siteUrl, $item['cover'] ?? ''),
            'datePublished' => iso_date($item['date'] ?? ''),
            'dateModified' => iso_date($item['updatedAt'] ?? '') ?? iso_date($item['date'] ?? ''),
            'author' => ['@type' => 'Organization', 'name' => ORG_NAME, 'url' => $siteUrl . '/'],
            'publisher' => ['@type' => 'Organization', 'name' => ORG_NAME, 'logo' => ['@type' => 'ImageObject', 'url' => $siteUrl . '/IMG/umt-logo.png']],
            'mainEntityOfPage' => $canonical,
            'inLanguage' => 'en-IN',
        ]),
    ]);
    $body = '<main class="ssr-page"><article><h1>' . e($item['title']) . '</h1>'
        . '<p>' . e(trim(($item['date'] ?? '') . ' · ' . ($item['author'] ?? ''), ' ·')) . '</p>'
        . (!empty($item['cover']) ? '<img src="' . e($item['cover']) . '" alt="' . e($item['title']) . '">' : '')
        . '<div>' . ($item['content'] ?? '') . '</div></article></main>';
    $ogType = $meta['ogType'] ?? 'article';
} elseif ($pageType === 'projects') {
    $title = $meta['title'] ?? ($item['name'] . (!empty($item['tagline']) ? ': ' . $item['tagline'] : '') . ' | UltraModern Portfolio');
    $desc = $meta['description'] ?? ($item['summary'] ?? '');
    $shots = array_values(array_filter($item['screenshots'] ?? [], fn($s) => empty($s['illustrative'])));
    $image = abs_url($siteUrl, $meta['ogImage'] ?? ($item['screenshots'][0]['src'] ?? ($item['thumb'] ?? '')));
    $ld = merge_ld($meta['jsonLd'] ?? [], [
        breadcrumb_ld($siteUrl, [['Home', '/'], ['Portfolio', '/portfolio'], [$item['name'], $canonicalPath]]),
        ld_clean([
            '@context' => 'https://schema.org', '@type' => 'CreativeWork', '@id' => $canonical . '#project',
            'name' => $item['name'], 'headline' => ($item['tagline'] ?? '') !== '' ? $item['tagline'] : $item['name'],
            'description' => $item['summary'] ?? '', 'url' => $canonical, 'mainEntityOfPage' => $canonical, 'inLanguage' => 'en-IN',
            'image' => array_map(fn($s) => ['@type' => 'ImageObject', 'url' => abs_url($siteUrl, $s['src']), 'caption' => ($s['caption'] ?? '') !== '' ? $s['caption'] : $item['name']], $shots),
            'creator' => org_ref($siteUrl),
            'about' => $item['industry'] ?? '',
            'genre' => implode(', ', $item['category'] ?? []),
            'keywords' => implode(', ', array_merge($item['tech'] ?? [], $item['platforms'] ?? [])),
            'isPartOf' => ['@type' => 'CollectionPage', '@id' => $siteUrl . '/portfolio#page', 'url' => $siteUrl . '/portfolio'],
        ]),
    ]);
    $list = fn(array $xs) => $xs ? '<ul>' . implode('', array_map(fn($x) => '<li>' . e($x) . '</li>', $xs)) . '</ul>' : '';
    $body = '<main class="ssr-page"><h1>' . e($item['name']) . '</h1><p>' . e($item['tagline'] ?? '') . '</p>'
        . '<p>' . e($item['summary'] ?? '') . '</p>'
        . (!empty($item['challenge']) ? '<h2>The challenge</h2><p>' . e($item['challenge']) . '</p>' : '')
        . (!empty($item['solution']) ? '<h2>Our solution</h2><p>' . e($item['solution']) . '</p>' : '')
        . (!empty($item['features']) ? '<h2>Key features</h2>' . $list($item['features']) : '')
        . implode('', array_map(fn($s) => '<img src="' . e($s['src']) . '" alt="' . e($item['name'] . ': ' . ($s['caption'] ?? '')) . '">', $item['screenshots'] ?? []))
        . '</main>';
    $ogType = $meta['ogType'] ?? 'article';
} else {
    $title = $meta['title'] ?? ($item['title'] . ' Job in Indore | Careers at ' . BRAND);
    $desc = $meta['description'] ?? ($item['desc'] ?? '');
    $image = abs_url($siteUrl, $meta['ogImage'] ?? '');
    $remote = (bool) preg_match('~remote~i', $item['location'] ?? '');
    $ld = merge_ld($meta['jsonLd'] ?? [], [
        breadcrumb_ld($siteUrl, [['Home', '/'], ['Career', '/career'], [$item['title'], $canonicalPath]]),
        ld_clean([
            '@context' => 'https://schema.org', '@type' => 'JobPosting', 'title' => $item['title'],
            'description' => ($item['description'] ?? '') !== '' ? $item['description'] : '<p>' . ($item['desc'] ?? '') . '</p>',
            'datePosted' => iso_date($item['createdAt'] ?? ''),
            'employmentType' => employment_type($item['type'] ?? ''),
            'hiringOrganization' => ['@type' => 'Organization', 'name' => ORG_NAME, 'sameAs' => $siteUrl . '/', 'logo' => $siteUrl . '/IMG/umt-logo.png'],
            'jobLocation' => ['@type' => 'Place', 'address' => job_address($item['location'] ?? '')],
            'jobLocationType' => $remote ? 'TELECOMMUTE' : null,
            'applicantLocationRequirements' => $remote ? ['@type' => 'Country', 'name' => 'India'] : null,
            'skills' => implode(', ', $item['skills'] ?? []),
            'occupationalCategory' => $item['department'] ?? '',
            'directApply' => empty($item['href']),
            'url' => $canonical,
        ]),
    ]);
    $body = '<main class="ssr-page"><h1>' . e($item['title']) . '</h1><p>'
        . e(implode(' · ', array_filter([$item['type'] ?? '', $item['location'] ?? '', $item['exp'] ?? '']))) . '</p>'
        . '<p>' . e($item['desc'] ?? '') . '</p><div>' . ($item['description'] ?? '') . '</div></main>';
    $ogType = $meta['ogType'] ?? 'website';
}

$head = head_html([
    'title' => $title,
    'description' => $desc,
    'keywords' => $meta['keywords'] ?? '',
    'robots' => $meta['robots'] ?? 'index, follow',
    'canonical' => $canonical,
    'ogType' => $ogType,
    'ogTitle' => $meta['ogTitle'] ?? null,
    'ogDescription' => $meta['ogDescription'] ?? null,
    'image' => $image,
    'jsonLd' => $ld,
]);
$kind = ['posts' => 'post', 'projects' => 'project', 'jobs' => 'job'][$pageType];
output(page_html($template, $head, $body, ['kind' => $kind, 'path' => '/' . $path, 'slug' => $item['slug'], 'item' => $item]));
