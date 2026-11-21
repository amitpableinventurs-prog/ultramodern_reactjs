<?php
declare(strict_types=1);

/**
 * Core of the UltraModern CMS API: config, database (SQLite or MySQL),
 * schema + first-run seed import, JSON helpers, and authentication.
 */

const UMT_TABLES = ['projects', 'posts', 'jobs'];

function cfg(?string $key = null)
{
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/../config.php';
    }
    return $key === null ? $config : ($config[$key] ?? null);
}

function now(): string
{
    return gmdate('Y-m-d H:i:s');
}

/* ------------------------------------------------------------------ database */

function db(): PDO
{
    static $pdo = null;
    if ($pdo) {
        return $pdo;
    }
    $c = cfg('db');
    if ($c['driver'] === 'mysql') {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['host'], (int) $c['port'], $c['name']);
        $pdo = new PDO($dsn, $c['user'], $c['pass']);
    } else {
        $dir = dirname($c['sqlite_path']);
        if (!is_dir($dir) && !@mkdir($dir, 0775, true)) {
            throw new RuntimeException('Cannot create data directory: ' . $dir);
        }
        $pdo = new PDO('sqlite:' . $c['sqlite_path']);
        $pdo->exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    migrate($pdo, $c['driver']);
    return $pdo;
}

function is_mysql(): bool
{
    return cfg('db')['driver'] === 'mysql';
}

function migrate(PDO $pdo, string $driver): void
{
    $id = $driver === 'mysql' ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    $str = $driver === 'mysql' ? 'VARCHAR(191)' : 'TEXT';
    $big = $driver === 'mysql' ? 'LONGTEXT' : 'TEXT';
    $tail = $driver === 'mysql' ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';

    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id $id, name $str NOT NULL, email $str NOT NULL UNIQUE, password_hash $str NOT NULL,
        created_at $str NOT NULL, last_login_at $str NULL)$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id $id, ip $str NOT NULL, created_at $str NOT NULL)$tail");
    foreach (UMT_TABLES as $t) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS $t (
            id $id, slug $str NOT NULL UNIQUE, published INT NOT NULL DEFAULT 1,
            sort_order INT NOT NULL DEFAULT 0, sort_date $str NULL, data $big NOT NULL,
            created_at $str NOT NULL, updated_at $str NOT NULL)$tail");
    }
    seed_if_empty($pdo);
}

/** First run: import the site's existing portfolio, blog posts and job openings. */
function seed_if_empty(PDO $pdo): void
{
    $seedFile = __DIR__ . '/../seed.json';
    if (!is_file($seedFile)) {
        return;
    }
    $seed = null;
    foreach (UMT_TABLES as $t) {
        if ((int) $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn() > 0) {
            continue;
        }
        $seed = $seed ?? json_decode((string) file_get_contents($seedFile), true);
        if (empty($seed[$t])) {
            continue;
        }
        $stmt = $pdo->prepare("INSERT INTO $t (slug, published, sort_order, sort_date, data, created_at, updated_at) VALUES (?,?,?,?,?,?,?)");
        foreach ($seed[$t] as $i => $row) {
            $slug = $row['slug'];
            unset($row['slug']);
            $stmt->execute([$slug, 1, $i, $row['date'] ?? null, json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), now(), now()]);
        }
    }
}

/* ------------------------------------------------------------------ http */

function send_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400, array $extra = []): void
{
    send_json(['error' => $message] + $extra, $status);
}

function body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function client_ip(): string
{
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/* ------------------------------------------------------------------ auth */

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('UMTADMIN');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function current_admin(): ?array
{
    start_session();
    if (empty($_SESSION['admin_id'])) {
        return null;
    }
    $stmt = db()->prepare('SELECT id, name, email FROM admins WHERE id = ?');
    $stmt->execute([$_SESSION['admin_id']]);
    return $stmt->fetch() ?: null;
}

/** Admin-only endpoints: valid session + custom header (blocks cross-site form posts). */
function require_admin(): array
{
    if (($_SERVER['HTTP_X_UMT_REQUEST'] ?? '') !== '1') {
        fail('Missing request header', 403);
    }
    $admin = current_admin();
    if (!$admin) {
        fail('Please sign in', 401);
    }
    return $admin;
}

function admins_exist(): bool
{
    return (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0;
}

/** One-time key required to create the first admin (read it from the data folder). */
function setup_key(): string
{
    $file = cfg('data_dir') . DIRECTORY_SEPARATOR . 'setup-key.txt';
    if (!is_file($file)) {
        @mkdir(dirname($file), 0775, true);
        file_put_contents($file, bin2hex(random_bytes(12)));
    }
    return trim((string) file_get_contents($file));
}

function too_many_attempts(): bool
{
    $since = gmdate('Y-m-d H:i:s', time() - 15 * 60);
    $stmt = db()->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND created_at > ?');
    $stmt->execute([client_ip(), $since]);
    return (int) $stmt->fetchColumn() >= 8;
}

function record_failed_attempt(): void
{
    db()->prepare('INSERT INTO login_attempts (ip, created_at) VALUES (?, ?)')->execute([client_ip(), now()]);
    db()->prepare('DELETE FROM login_attempts WHERE created_at < ?')->execute([gmdate('Y-m-d H:i:s', time() - 86400)]);
}

function create_admin(string $name, string $email, string $password): int
{
    $email = strtolower(trim($email));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Enter a valid email address');
    }
    if (strlen($password) < 10) {
        throw new InvalidArgumentException('Password must be at least 10 characters');
    }
    $stmt = db()->prepare('INSERT INTO admins (name, email, password_hash, created_at) VALUES (?,?,?,?)');
    $stmt->execute([trim($name) ?: 'Admin', $email, password_hash($password, PASSWORD_DEFAULT), now()]);
    return (int) db()->lastInsertId();
}
