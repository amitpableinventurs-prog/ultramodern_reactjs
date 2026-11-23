<?php
declare(strict_types=1);

/**
 * Exports the CMS database (umt-data/cms.sqlite) as a MySQL/MariaDB dump:
 *   backups/mysql/ultramodern-<date>.sql
 *
 * The tables match what public/api/lib/bootstrap.php creates when the CMS runs on MySQL,
 * so the file can be imported with phpMyAdmin / HeidiSQL or
 *   mysql -u <user> -p <database> < backups/mysql/ultramodern-<date>.sql
 * and the site switched over with umt-data/config.php (see public/api/config.php).
 *
 * The dump includes the admins table (password hashes), so keep it private. backups/ is git-ignored.
 *
 * Usage: php scripts/backup-mysql.php [output.sql]
 */

$config = require __DIR__ . '/../public/api/config.php';
$sqlitePath = $config['db']['sqlite_path'];
if (!is_file($sqlitePath)) {
    fwrite(STDERR, "SQLite database not found: $sqlitePath\n");
    exit(1);
}

$out = $argv[1] ?? __DIR__ . '/../backups/mysql/ultramodern-' . date('Y-m-d') . '.sql';
if (!is_dir(dirname($out)) && !mkdir(dirname($out), 0775, true)) {
    fwrite(STDERR, 'Cannot create ' . dirname($out) . "\n");
    exit(1);
}

$db = new PDO('sqlite:' . $sqlitePath, null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$tail = ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
$content = "id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(191) NOT NULL UNIQUE, published INT NOT NULL DEFAULT 1,\n"
    . "  sort_order INT NOT NULL DEFAULT 0, sort_date VARCHAR(191) NULL, data LONGTEXT NOT NULL,\n"
    . '  created_at VARCHAR(191) NOT NULL, updated_at VARCHAR(191) NOT NULL';
$schema = [
    'admins' => "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(191) NOT NULL, email VARCHAR(191) NOT NULL UNIQUE,\n"
        . '  password_hash VARCHAR(191) NOT NULL, created_at VARCHAR(191) NOT NULL, last_login_at VARCHAR(191) NULL',
    'login_attempts' => 'id INT AUTO_INCREMENT PRIMARY KEY, ip VARCHAR(191) NOT NULL, created_at VARCHAR(191) NOT NULL',
    'projects' => $content,
    'posts' => $content,
    'jobs' => $content,
];

/** MySQL string literal (escapes backslashes too, unlike SQLite quoting). */
function q($v): string
{
    if ($v === null) {
        return 'NULL';
    }
    if (is_int($v) || is_float($v)) {
        return (string) $v;
    }
    return "'" . strtr((string) $v, ["\\" => "\\\\", "'" => "\\'", "\0" => "\\0", "\n" => "\\n", "\r" => "\\r", "\x1a" => "\\Z"]) . "'";
}

$sql = "-- UltraModern CMS: MySQL/MariaDB backup\n"
    . '-- Source: ' . basename($sqlitePath) . '   Created: ' . gmdate('Y-m-d H:i:s') . " UTC\n"
    . "-- Contains admin password hashes: keep this file private.\n\n"
    . "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n";

$counts = [];
foreach ($schema as $table => $cols) {
    $sql .= "DROP TABLE IF EXISTS `$table`;\nCREATE TABLE `$table` (\n  $cols\n)$tail;\n";
    $exists = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name=" . $db->quote($table))->fetchColumn();
    $rows = $exists ? $db->query("SELECT * FROM `$table` ORDER BY id")->fetchAll() : [];
    $counts[$table] = count($rows);
    foreach ($rows as $row) {
        $sql .= "INSERT INTO `$table` (`" . implode('`, `', array_keys($row)) . '`) VALUES ('
            . implode(', ', array_map('q', array_values($row))) . ");\n";
    }
    $sql .= "\n";
}
$sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";

file_put_contents($out, $sql);
echo 'Wrote ' . realpath($out) . ' (' . round(strlen($sql) / 1024) . " KB)\n";
foreach ($counts as $t => $n) {
    echo "  $t: $n rows\n";
}
