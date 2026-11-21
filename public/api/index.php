<?php
declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/content.php';

set_exception_handler(function (Throwable $e) {
    error_log('[umt-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    fail('Server error. Please try again.', 500);
});

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = preg_replace('~^.*?/api/?~', '', $path);           // works under any sub-folder
$parts = array_values(array_filter(explode('/', trim($path, '/')), 'strlen'));
$parts = array_map('rawurldecode', $parts);

$public = ['projects' => 'projects', 'posts' => 'posts', 'jobs' => 'jobs'];

/* ------------------------------------------------------------------ public */

if ($method === 'GET' && ($parts[0] ?? '') === 'health') {
    send_json(['ok' => true, 'driver' => cfg('db')['driver'], 'time' => now()]);
}

if ($method === 'GET' && isset($public[$parts[0] ?? ''])) {
    $type = $public[$parts[0]];
    header('Cache-Control: public, max-age=60');
    if (count($parts) === 1) {
        $items = list_rows($type);
        if ($type === 'posts') {
            // listings do not need full article bodies
            $items = array_map(function ($p) { unset($p['content']); return $p; }, $items);
        }
        send_json(['items' => $items]);
    }
    $item = find_row($type, $parts[1]);
    $item ? send_json(['item' => $item]) : fail('Not found', 404);
}

/* ------------------------------------------------------------------ auth */

if (($parts[0] ?? '') === 'auth') {
    $action = $parts[1] ?? '';
    if ($method === 'GET' && $action === 'me') {
        $admin = current_admin();
        $needsSetup = !admins_exist();
        if ($needsSetup) {
            setup_key(); // make sure the key file exists so the owner can read it
        }
        send_json(['admin' => $admin, 'setupRequired' => $needsSetup]);
    }
    if ($method === 'POST' && $action === 'setup') {
        if (admins_exist()) {
            fail('Setup has already been completed', 409);
        }
        $in = body();
        if (!hash_equals(setup_key(), trim((string) ($in['key'] ?? '')))) {
            record_failed_attempt();
            fail('Invalid setup key', 403);
        }
        try {
            $id = create_admin((string) ($in['name'] ?? ''), (string) ($in['email'] ?? ''), (string) ($in['password'] ?? ''));
        } catch (InvalidArgumentException $e) {
            fail($e->getMessage(), 422);
        }
        @unlink(cfg('data_dir') . DIRECTORY_SEPARATOR . 'setup-key.txt');
        start_session();
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $id;
        send_json(['admin' => current_admin()]);
    }
    if ($method === 'POST' && $action === 'login') {
        if (too_many_attempts()) {
            fail('Too many attempts. Please wait 15 minutes and try again.', 429);
        }
        $in = body();
        $stmt = db()->prepare('SELECT * FROM admins WHERE email = ?');
        $stmt->execute([strtolower(trim((string) ($in['email'] ?? '')))]);
        $row = $stmt->fetch();
        if (!$row || !password_verify((string) ($in['password'] ?? ''), $row['password_hash'])) {
            record_failed_attempt();
            usleep(400000);
            fail('Incorrect email or password', 401);
        }
        if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
            db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([password_hash((string) $in['password'], PASSWORD_DEFAULT), $row['id']]);
        }
        db()->prepare('UPDATE admins SET last_login_at = ? WHERE id = ?')->execute([now(), $row['id']]);
        start_session();
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int) $row['id'];
        send_json(['admin' => current_admin()]);
    }
    if ($method === 'POST' && $action === 'logout') {
        start_session();
        $_SESSION = [];
        session_destroy();
        send_json(['ok' => true]);
    }
    if ($method === 'POST' && $action === 'password') {
        $admin = require_admin();
        $in = body();
        $stmt = db()->prepare('SELECT password_hash FROM admins WHERE id = ?');
        $stmt->execute([$admin['id']]);
        if (!password_verify((string) ($in['current'] ?? ''), (string) $stmt->fetchColumn())) {
            fail('Current password is incorrect', 422);
        }
        if (strlen((string) ($in['next'] ?? '')) < 10) {
            fail('New password must be at least 10 characters', 422);
        }
        db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([password_hash((string) $in['next'], PASSWORD_DEFAULT), $admin['id']]);
        send_json(['ok' => true]);
    }
    fail('Not found', 404);
}

/* ------------------------------------------------------------------ admin */

if (($parts[0] ?? '') === 'admin') {
    require_admin();
    $type = $parts[1] ?? '';

    if ($type === 'stats' && $method === 'GET') {
        $out = [];
        foreach (UMT_TABLES as $t) {
            $out[$t] = [
                'total' => (int) db()->query("SELECT COUNT(*) FROM $t")->fetchColumn(),
                'published' => (int) db()->query("SELECT COUNT(*) FROM $t WHERE published = 1")->fetchColumn(),
            ];
        }
        send_json($out);
    }

    if ($type === 'upload' && $method === 'POST') {
        require __DIR__ . '/lib/upload.php';
        send_json(['url' => handle_upload($_FILES['file'] ?? null)]);
    }

    if (!isset(RESOURCES[$type])) {
        fail('Not found', 404);
    }
    $id = isset($parts[2]) && ctype_digit($parts[2]) ? (int) $parts[2] : null;

    if ($method === 'GET' && $id === null) {
        send_json(['items' => list_rows($type, true)]);
    }
    if ($method === 'GET' && $id !== null) {
        $stmt = db()->prepare("SELECT * FROM $type WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $row ? send_json(['item' => row_out($row, true)]) : fail('Not found', 404);
    }

    if ($method === 'POST' && ($parts[2] ?? '') === 'reorder') {
        $ids = array_map('intval', (array) (body()['ids'] ?? []));
        $stmt = db()->prepare("UPDATE $type SET sort_order = ? WHERE id = ?");
        foreach ($ids as $i => $rowId) {
            $stmt->execute([$i, $rowId]);
        }
        send_json(['ok' => true]);
    }

    if ($method === 'POST' && $id === null) {
        $in = body();
        [$data, $errors] = normalize($type, $in);
        if ($errors) {
            fail('Please fix the highlighted fields', 422, ['fields' => $errors]);
        }
        $slug = unique_slug($type, (string) (($in['slug'] ?? '') ?: $data[RESOURCES[$type]['title']]));
        $first = (int) db()->query("SELECT COALESCE(MIN(sort_order), 0) FROM $type")->fetchColumn() - 1;
        db()->prepare("INSERT INTO $type (slug, published, sort_order, sort_date, data, created_at, updated_at) VALUES (?,?,?,?,?,?,?)")
            ->execute([$slug, !empty($in['published']) ? 1 : 0, $first, $data['date'] ?? null, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), now(), now()]);
        $stmt = db()->prepare("SELECT * FROM $type WHERE id = ?");
        $stmt->execute([(int) db()->lastInsertId()]);
        send_json(['item' => row_out($stmt->fetch(), true)], 201);
    }

    if ($method === 'PUT' && $id !== null) {
        $stmt = db()->prepare("SELECT * FROM $type WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            fail('Not found', 404);
        }
        $in = body();
        [$data, $errors] = normalize($type, $in);
        if ($errors) {
            fail('Please fix the highlighted fields', 422, ['fields' => $errors]);
        }
        // keep the existing URL (incl. its original capitalisation) unless the admin changed it
        $wanted = trim((string) ($in['slug'] ?? ''));
        $slug = ($wanted === '' || strcasecmp($wanted, $existing['slug']) === 0)
            ? $existing['slug']
            : unique_slug($type, $wanted, $id);
        db()->prepare("UPDATE $type SET slug = ?, published = ?, sort_date = ?, data = ?, updated_at = ? WHERE id = ?")
            ->execute([$slug, !empty($in['published']) ? 1 : 0, $data['date'] ?? null, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), now(), $id]);
        $stmt->execute([$id]);
        send_json(['item' => row_out($stmt->fetch(), true)]);
    }

    if ($method === 'DELETE' && $id !== null) {
        db()->prepare("DELETE FROM $type WHERE id = ?")->execute([$id]);
        send_json(['ok' => true]);
    }
}

fail('Not found', 404);
