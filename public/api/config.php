<?php
/**
 * CMS configuration defaults.
 *
 * Do NOT put passwords here: this file is replaced on every deploy.
 * To override anything (e.g. switch to MySQL), create  <data_dir>/config.php
 * returning an array with only the keys you want to change, e.g.
 *
 *   <?php return ['db' => ['driver' => 'mysql', 'host' => 'localhost',
 *                          'name' => 'u123_umt', 'user' => 'u123_umt', 'pass' => '...']];
 *
 * <data_dir> defaults to a folder named "umt-data" NEXT TO the website root
 * (e.g. /home/<user>/umt-data when the site lives in /home/<user>/public_html),
 * so the database survives redeploys and is never reachable from the web.
 */
$docRoot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), '/\\');
if ($docRoot === '' || !is_dir($docRoot)) {
    $docRoot = dirname(__DIR__); // CLI: the folder that contains /api
}
$dataDir = getenv('UMT_DATA_DIR') ?: dirname($docRoot) . DIRECTORY_SEPARATOR . 'umt-data';

$config = [
    'data_dir' => $dataDir,
    'site_dir' => $docRoot,                 // folder holding index.html, _template.html, _snapshots/
    'db' => [
        'driver' => 'sqlite',               // 'sqlite' or 'mysql'
        'sqlite_path' => $dataDir . DIRECTORY_SEPARATOR . 'cms.sqlite',
        'host' => 'localhost',
        'port' => 3306,
        'name' => '',
        'user' => '',
        'pass' => '',
    ],
    'uploads_dir' => $docRoot . DIRECTORY_SEPARATOR . 'uploads',
    'uploads_url' => '/uploads',
    'max_upload_mb' => 8,
    'site_url' => 'https://www.ultramoderntechnologies.com',
];

$override = $dataDir . DIRECTORY_SEPARATOR . 'config.php';
if (is_file($override)) {
    $custom = require $override;
    if (is_array($custom)) {
        $config = array_replace_recursive($config, $custom);
    }
}
return $config;
