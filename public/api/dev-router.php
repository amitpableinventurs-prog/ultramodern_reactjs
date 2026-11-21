<?php
/**
 * Local development only: router for PHP's built-in server.
 *   php -S 127.0.0.1:8091 -t public public/api/dev-router.php
 * (npm run api does this). Vite proxies /api and /uploads to it.
 */
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (str_starts_with($path, '/api/')) {
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    require __DIR__ . '/index.php';
    return true;
}
return false; // let the built-in server serve static files (e.g. /uploads/...)
