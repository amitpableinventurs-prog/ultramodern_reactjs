<?php
declare(strict_types=1);

/** Validates an uploaded image, downsizes very large ones, stores it under /uploads/YYYY/MM. */
function handle_upload(?array $file): string
{
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
        fail('Upload failed. Please choose an image and try again.', 422);
    }
    $maxBytes = (int) cfg('max_upload_mb') * 1024 * 1024;
    if ($file['size'] > $maxBytes) {
        fail('Image is too large (max ' . cfg('max_upload_mb') . ' MB).', 422);
    }
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset($types[$mime]) || @getimagesize($file['tmp_name']) === false) {
        fail('Only JPG, PNG, WebP or GIF images are allowed.', 422);
    }

    $sub = gmdate('Y') . '/' . gmdate('m');
    $dir = rtrim(cfg('uploads_dir'), '/\\') . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $sub);
    if (!is_dir($dir) && !@mkdir($dir, 0775, true)) {
        fail('Upload folder is not writable on the server.', 500);
    }
    $base = slugify(pathinfo((string) $file['name'], PATHINFO_FILENAME)) ?: 'image';
    $name = substr($base, 0, 60) . '-' . bin2hex(random_bytes(4)) . '.' . $types[$mime];
    $target = $dir . DIRECTORY_SEPARATOR . $name;

    if (!downsize($file['tmp_name'], $target, $mime) && !move_uploaded_file($file['tmp_name'], $target)) {
        fail('Could not save the image.', 500);
    }
    return rtrim(cfg('uploads_url'), '/') . '/' . $sub . '/' . $name;
}

/** Re-encodes images wider than 2000px (keeps uploads fast). Returns false when not needed/possible. */
function downsize(string $src, string $dest, string $mime): bool
{
    if (!function_exists('imagecreatetruecolor') || $mime === 'image/gif') {
        return false;
    }
    [$w, $h] = getimagesize($src) ?: [0, 0];
    $max = 2000;
    if ($w <= $max) {
        return false;
    }
    $load = ['image/jpeg' => 'imagecreatefromjpeg', 'image/png' => 'imagecreatefrompng', 'image/webp' => 'imagecreatefromwebp'][$mime] ?? null;
    if (!$load || !function_exists($load) || !($img = @$load($src))) {
        return false;
    }
    $nh = (int) round($h * $max / $w);
    $out = imagecreatetruecolor($max, $nh);
    imagealphablending($out, false);
    imagesavealpha($out, true);
    imagecopyresampled($out, $img, 0, 0, 0, 0, $max, $nh, $w, $h);
    $ok = match ($mime) {
        'image/jpeg' => imagejpeg($out, $dest, 84),
        'image/png' => imagepng($out, $dest, 7),
        'image/webp' => imagewebp($out, $dest, 84),
        default => false,
    };
    imagedestroy($img);
    imagedestroy($out);
    return $ok;
}
