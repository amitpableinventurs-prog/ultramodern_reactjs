<?php
declare(strict_types=1);

/**
 * Command-line helper (run on the server or locally):
 *   php api/cli.php create-admin "Full Name" email@example.com "a-strong-password"
 *   php api/cli.php reset-password email@example.com "new-strong-password"
 *   php api/cli.php setup-key          (prints the one-time key for the /admin setup screen)
 *   php api/cli.php info
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require __DIR__ . '/lib/bootstrap.php';

$cmd = $argv[1] ?? 'info';
try {
    switch ($cmd) {
        case 'create-admin':
            [$name, $email, $pass] = [$argv[2] ?? '', $argv[3] ?? '', $argv[4] ?? ''];
            $id = create_admin($name, $email, $pass);
            echo "Admin #$id created for $email\n";
            break;
        case 'reset-password':
            [$email, $pass] = [strtolower($argv[2] ?? ''), $argv[3] ?? ''];
            if (strlen($pass) < 10) {
                throw new InvalidArgumentException('Password must be at least 10 characters');
            }
            $stmt = db()->prepare('UPDATE admins SET password_hash = ? WHERE email = ?');
            $stmt->execute([password_hash($pass, PASSWORD_DEFAULT), $email]);
            echo $stmt->rowCount() ? "Password updated for $email\n" : "No admin with email $email\n";
            break;
        case 'setup-key':
            echo admins_exist() ? "Setup already completed.\n" : setup_key() . "\n";
            break;
        default:
            db();
            echo 'Data folder: ' . cfg('data_dir') . "\nDatabase:    " . cfg('db')['driver'] . "\n";
            foreach (UMT_TABLES as $t) {
                echo str_pad($t, 12) . (int) db()->query("SELECT COUNT(*) FROM $t")->fetchColumn() . " rows\n";
            }
            echo 'Admins:      ' . (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() . "\n";
    }
} catch (Throwable $e) {
    fwrite(STDERR, 'Error: ' . $e->getMessage() . "\n");
    exit(1);
}
