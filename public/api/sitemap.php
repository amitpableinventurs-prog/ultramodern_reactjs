<?php
declare(strict_types=1);

/**
 * sitemap.xml = static pages from the build + live blog posts, projects and job openings.
 *  - items hidden from Google in the admin (robots "noindex") are left out
 *  - <lastmod> is the real change date: build date for static pages, last edit for CMS items,
 *    and the newest item for the /blog, /portfolio and /career list pages
 *  - Google image extension: real portfolio screenshots and blog cover images
 */
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/content.php';

$site = rtrim((string) cfg('site_dir'), '/\\');
$base = rtrim((string) cfg('site_url'), '/');
$routesFile = $site . '/_routes.json';
$static = json_decode((string) @file_get_contents($routesFile), true) ?: ['/'];
$built = is_file($routesFile) ? gmdate('Y-m-d', (int) filemtime($routesFile)) : gmdate('Y-m-d');

$x = fn(string $s): string => htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');
$abs = function (string $path) use ($base): string {
    if (preg_match('~^https?://~i', $path)) {
        return $path;
    }
    return $base . ($path === '/' ? '/' : implode('/', array_map('rawurlencode', explode('/', $path))));
};

$urls = [];      // path => [lastmod, priority, images[]]
$add = function (string $path, string $lastmod, string $priority, array $images = []) use (&$urls) {
    $urls[$path] = [$lastmod, $priority, $images];
};
foreach ($static as $p) {
    $prio = $p === '/' ? '1.0' : (preg_match('~^/(services|products|portfolio|about|contact|blog|career)$~', $p) ? '0.9' : '0.8');
    $add($p, $built, $prio);
}
// list pages are rendered from the database (api/render.php), so they are not in _routes.json
$listPage = ['posts' => '/blog', 'projects' => '/portfolio', 'jobs' => '/career'];
foreach ($listPage as $p) {
    $add($p, $built, '0.9');
}

try {
    $prefix = ['posts' => '/', 'projects' => '/portfolio/', 'jobs' => '/career/'];
    foreach ($prefix as $type => $pre) {
        $newest = '';
        foreach (list_rows($type) as $item) {
            if (stripos((string) ($item['meta']['robots'] ?? ''), 'noindex') !== false) {
                continue; // hidden from search engines in the admin
            }
            $images = [];
            if ($type === 'projects') {
                foreach ($item['screenshots'] ?? [] as $s) {
                    if (empty($s['illustrative']) && !empty($s['src'])) {
                        $images[] = $s['src'];
                    }
                }
            } elseif ($type === 'posts' && !empty($item['cover'])) {
                $images[] = $item['cover'];
            }
            $mod = $item['updatedAt'] ?: $built;
            $newest = max($newest, $mod);
            $add($pre . $item['slug'], $mod, $type === 'jobs' ? '0.6' : '0.7', $images);
        }
        if ($newest !== '' && isset($urls[$listPage[$type]])) {
            $urls[$listPage[$type]][0] = max($urls[$listPage[$type]][0], $newest);
        }
    }
} catch (Throwable $e) {
    error_log('[umt-sitemap] ' . $e->getMessage());
}

$out = [];
foreach ($urls as $path => [$lastmod, $prio, $images]) {
    $entry = '  <url><loc>' . $x($abs($path)) . "</loc><lastmod>$lastmod</lastmod><priority>$prio</priority>";
    foreach ($images as $src) {
        $entry .= "\n    <image:image><image:loc>" . $x($abs($src)) . '</image:loc></image:image>';
    }
    $out[] = $entry . ($images ? "\n  " : '') . '</url>';
}

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
header('X-Robots-Tag: noindex');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
    . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n"
    . implode("\n", $out) . "\n</urlset>\n";
