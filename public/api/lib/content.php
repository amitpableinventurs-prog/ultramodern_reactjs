<?php
declare(strict_types=1);

/**
 * Content types managed in the admin panel and how each field is validated.
 * Field types: str (single line), text (multi-line), html (rich text, sanitised),
 * bool, int, list (array of strings), shots (screenshot objects), meta (SEO object), color, url.
 */
const RESOURCES = [
    'projects' => [
        'label' => 'Portfolio project',
        'title' => 'name',
        'fields' => [
            'name' => ['str', true], 'tagline' => ['str'], 'industry' => ['str'], 'accent' => ['color'],
            'summary' => ['text', true], 'challenge' => ['text'], 'solution' => ['text'],
            'features' => ['list'], 'tech' => ['list'], 'platforms' => ['list'], 'category' => ['list'],
            'isNew' => ['bool'], 'thumb' => ['url'], 'liveUrl' => ['url'], 'screenshots' => ['shots'],
            'meta' => ['meta'],
        ],
    ],
    'posts' => [
        'label' => 'Blog post',
        'title' => 'title',
        'fields' => [
            'title' => ['str', true], 'date' => ['str'], 'author' => ['str'], 'cover' => ['url'],
            'excerpt' => ['text'], 'content' => ['html', true], 'readingMinutes' => ['int'],
            'meta' => ['meta'],
        ],
    ],
    'jobs' => [
        'label' => 'Job opening',
        'title' => 'title',
        'fields' => [
            'title' => ['str', true], 'department' => ['str'], 'location' => ['str'], 'type' => ['str'],
            'exp' => ['str'], 'salary' => ['str'], 'icon' => ['str'], 'desc' => ['text', true],
            'description' => ['html'], 'skills' => ['list'], 'href' => ['url'], 'meta' => ['meta'],
        ],
    ],
];

const CATEGORIES = ['Mobile Apps', 'Web Platforms', 'E-Commerce', 'Business Websites'];

function slugify(string $s): string
{
    $s = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', str_replace(["'", '’'], '', $s)), '-'));
    return substr($s, 0, 120);
}

function clean_line($v): string
{
    return trim(preg_replace('/\s+/u', ' ', strip_tags((string) $v)));
}

function clean_url($v): string
{
    $v = trim((string) $v);
    if ($v === '') {
        return '';
    }
    if (preg_match('~^(https?://|/|mailto:|tel:|#)~i', $v) && !preg_match('~^\s*javascript:~i', $v)) {
        return $v;
    }
    return '';
}

/** Allow-list HTML sanitiser for rich text written in the admin editor. */
function sanitize_html(string $html): string
{
    $html = trim($html);
    if ($html === '') {
        return '';
    }
    $allowed = [
        'p' => ['class'], 'br' => [], 'hr' => [], 'h2' => ['class', 'id'], 'h3' => ['class', 'id'], 'h4' => ['class', 'id'],
        'strong' => [], 'b' => [], 'em' => [], 'i' => [], 'u' => [], 's' => [], 'sub' => [], 'sup' => [],
        'ul' => ['class'], 'ol' => ['class'], 'li' => ['class', 'data-list'], 'blockquote' => [], 'code' => [], 'pre' => ['class'],
        'a' => ['href', 'target', 'rel', 'title'], 'img' => ['src', 'alt', 'width', 'height', 'loading'],
        'figure' => [], 'figcaption' => [], 'aside' => ['class'], 'span' => ['class'],
        'table' => [], 'thead' => [], 'tbody' => [], 'tr' => [], 'th' => ['colspan', 'rowspan'], 'td' => ['colspan', 'rowspan'],
    ];
    $drop = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'svg', 'math'];

    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8"?><div id="umt-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    $root = $doc->getElementById('umt-root');
    if (!$root) {
        return '';
    }

    $walk = function (DOMNode $node) use (&$walk, $allowed, $drop) {
        for ($child = $node->firstChild; $child; $child = $next) {
            $next = $child->nextSibling;
            if ($child instanceof DOMComment) {
                $node->removeChild($child);
                continue;
            }
            if (!($child instanceof DOMElement)) {
                continue;
            }
            $tag = strtolower($child->tagName);
            if (in_array($tag, $drop, true)) {
                $node->removeChild($child);
                continue;
            }
            if (!isset($allowed[$tag])) {
                // unknown wrapper (div, font, ...): keep its children, drop the tag
                $walk($child);
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }
            foreach (iterator_to_array($child->attributes) as $attr) {
                $name = strtolower($attr->name);
                $value = $attr->value;
                $ok = in_array($name, $allowed[$tag], true);
                if ($ok && in_array($name, ['href', 'src'], true)) {
                    $ok = clean_url($value) !== '';
                }
                if ($ok && $name === 'class') {
                    $value = implode(' ', array_filter(preg_split('/\s+/', $value), fn($c) => preg_match('/^(ql-[a-z0-9-]+|callout)$/', $c)));
                    $ok = $value !== '';
                    if ($ok) {
                        $child->setAttribute('class', $value);
                    }
                }
                if (!$ok) {
                    $child->removeAttribute($attr->name);
                }
            }
            if ($tag === 'img' && !$child->hasAttribute('src')) {
                $node->removeChild($child); // its src was unsafe or missing
                continue;
            }
            if ($tag === 'a' && !$child->hasAttribute('href')) {
                $walk($child);
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child); // keep the link text
                }
                $node->removeChild($child);
                continue;
            }
            if ($tag === 'a' && $child->getAttribute('target') === '_blank') {
                $child->setAttribute('rel', 'noopener noreferrer');
            }
            $walk($child);
        }
    };
    $walk($root);

    $out = '';
    foreach ($root->childNodes as $n) {
        $out .= $doc->saveHTML($n);
    }
    return trim($out);
}

function clean_meta($v): array
{
    $v = is_array($v) ? $v : [];
    $meta = [];
    foreach (['title', 'description', 'keywords', 'ogTitle', 'ogDescription', 'ogType', 'ogImage'] as $k) {
        if (isset($v[$k]) && clean_line($v[$k]) !== '') {
            $meta[$k] = $k === 'ogImage' ? clean_url($v[$k]) : clean_line($v[$k]);
        }
    }
    if (isset($v['robots']) && in_array($v['robots'], ['index, follow', 'noindex, follow', 'noindex, nofollow'], true)) {
        $meta['robots'] = $v['robots'];
    }
    // Structured data blocks (kept from the old site; editable as raw JSON in "Advanced SEO")
    if (isset($v['jsonLd']) && is_array($v['jsonLd'])) {
        $meta['jsonLd'] = array_values(array_filter($v['jsonLd'], 'is_array'));
    }
    return $meta;
}

/** Validate + normalise an incoming record. Returns [data, errors]. */
function normalize(string $type, array $in): array
{
    $def = RESOURCES[$type];
    $out = [];
    $errors = [];
    foreach ($def['fields'] as $field => $spec) {
        [$kind] = $spec;
        $required = $spec[1] ?? false;
        $v = $in[$field] ?? null;
        switch ($kind) {
            case 'str':
                $v = clean_line($v);
                break;
            case 'text':
                $v = trim(strip_tags((string) $v));
                break;
            case 'html':
                $v = sanitize_html((string) $v);
                break;
            case 'bool':
                $v = (bool) $v;
                break;
            case 'int':
                $v = max(0, (int) $v);
                break;
            case 'url':
                $v = clean_url($v);
                break;
            case 'color':
                $v = preg_match('/^#[0-9a-fA-F]{6}$/', (string) $v) ? strtolower((string) $v) : '#0a6fd1';
                break;
            case 'list':
                $v = array_values(array_filter(array_map('clean_line', is_array($v) ? $v : preg_split('/\r?\n|,/', (string) $v)), 'strlen'));
                break;
            case 'shots':
                $v = array_values(array_filter(array_map(function ($s) {
                    if (!is_array($s) || clean_url($s['src'] ?? '') === '') {
                        return null;
                    }
                    return [
                        'src' => clean_url($s['src']),
                        'caption' => clean_line($s['caption'] ?? ''),
                        'type' => ($s['type'] ?? '') === 'mobile' ? 'mobile' : 'desktop',
                        'illustrative' => !empty($s['illustrative']),
                    ];
                }, is_array($v) ? $v : [])));
                break;
            case 'meta':
                $v = clean_meta($v);
                break;
        }
        if ($required && ($v === '' || $v === [] || $v === null)) {
            $errors[$field] = 'This field is required';
        }
        $out[$field] = $v;
    }
    if ($type === 'projects') {
        $out['category'] = array_values(array_intersect($out['category'], CATEGORIES));
    }
    if ($type === 'posts') {
        // tags -> spaces first, so text from separate paragraphs/headings doesn't run together
        $plain = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags(preg_replace('/<[^>]+>/', ' $0 ', $out['content'])), ENT_QUOTES | ENT_HTML5, 'UTF-8')));
        if (empty($out['readingMinutes'])) {
            $out['readingMinutes'] = max(2, (int) round(count(preg_split('/\s+/u', $plain, -1, PREG_SPLIT_NO_EMPTY)) / 220));
        }
        if ($out['excerpt'] === '') {
            $out['excerpt'] = mb_strlen($plain) > 220 ? rtrim(mb_substr($plain, 0, 217)) . '…' : $plain;
        }
    }
    return [$out, $errors];
}

/* ------------------------------------------------------------------ queries */

function row_out(array $row, bool $withAdminFields = false): array
{
    $data = json_decode($row['data'], true) ?: [];
    $out = ['slug' => $row['slug']] + $data;
    // dates for structured data (JobPosting.datePosted, BlogPosting.dateModified); read-only, never saved back
    $out['createdAt'] = substr((string) $row['created_at'], 0, 10);
    $out['updatedAt'] = substr((string) $row['updated_at'], 0, 10);
    if ($withAdminFields) {
        $out['id'] = (int) $row['id'];
        $out['published'] = (bool) $row['published'];
        $out['sortOrder'] = (int) $row['sort_order'];
        $out['updatedAt'] = $row['updated_at'];
    }
    return $out;
}

function order_sql(string $type): string
{
    // blog posts: newest first by their date, then manual order; others: manual order
    return $type === 'posts' ? 'ORDER BY sort_order ASC, id DESC' : 'ORDER BY sort_order ASC, id ASC';
}

function list_rows(string $type, bool $admin = false): array
{
    $where = $admin ? '' : 'WHERE published = 1';
    $rows = db()->query("SELECT * FROM $type $where " . order_sql($type))->fetchAll();
    return array_map(fn($r) => row_out($r, $admin), $rows);
}

function find_row(string $type, string $slug, bool $admin = false): ?array
{
    $sql = "SELECT * FROM $type WHERE " . (is_mysql() ? 'slug = ?' : 'slug = ? COLLATE NOCASE') . ($admin ? '' : ' AND published = 1');
    $stmt = db()->prepare($sql);
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    return $row ? row_out($row, $admin) : null;
}

function unique_slug(string $type, string $wanted, ?int $exceptId = null): string
{
    $base = slugify($wanted) ?: 'item';
    $slug = $base;
    for ($i = 2; ; $i++) {
        $stmt = db()->prepare("SELECT id FROM $type WHERE slug = ?" . ($exceptId ? ' AND id <> ?' : ''));
        $stmt->execute($exceptId ? [$slug, $exceptId] : [$slug]);
        if (!$stmt->fetch() && !reserved_slug($type, $slug)) {
            return $slug;
        }
        $slug = $base . '-' . $i;
    }
}

/** Blog posts live at the site root, so they must not collide with existing pages. */
function reserved_slug(string $type, string $slug): bool
{
    if ($type !== 'posts') {
        return false;
    }
    static $reserved = null;
    if ($reserved === null) {
        $reserved = ['admin', 'api', 'uploads', 'assets', 'portfolio', 'career', 'blog', 'services', 'about', 'contact', 'privacy-policy', 'index', 'sitemap', 'img', 'logo', 'favicon', 'video'];
        // every static page of the site (service + job pages), shipped with the seed
        $seed = json_decode((string) @file_get_contents(__DIR__ . '/../seed.json'), true);
        foreach ($seed['reservedSlugs'] ?? [] as $s) {
            $reserved[] = strtolower($s);
        }
    }
    if (in_array(strtolower($slug), $reserved, true)) {
        return true;
    }
    return is_file(cfg('site_dir') . DIRECTORY_SEPARATOR . $slug . '.html');
}
