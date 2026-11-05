<?php
/**
 * Shared helpers for contact.php and reservation.php
 * ---------------------------------------------------
 * EDIT THESE TWO LINES:
 *  KRISHVI_TO   = the inbox that receives enquiries and reservation requests
 *  KRISHVI_FROM = an address on YOUR OWN domain (e.g. noreply@yourdomain.com).
 *                 Many hosts only deliver mail() when the From address belongs to the site's domain.
 */
const KRISHVI_TO   = 'krishvicoin@gmail.com';
const KRISHVI_FROM = 'noreply@' . 'krishvi.in';   // <- change to your real domain

date_default_timezone_set('Asia/Kolkata');

/* Clean a single-line value (strips control characters + header-injection attempts) */
function kv_line($v, $max = 200) {
    $v = is_string($v) ? $v : '';
    $v = preg_replace('/[\r\n\t\0]+/', ' ', $v);
    $v = trim(preg_replace('/\s{2,}/', ' ', $v));
    return mb_substr($v, 0, $max);
}
/* Clean a multi-line value */
function kv_text($v, $max = 2000) {
    $v = is_string($v) ? $v : '';
    $v = str_replace("\0", '', $v);
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    return mb_substr(trim($v), 0, $max);
}
function kv_is_ajax() {
    return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
        || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
}
/* Send JSON to the page's JavaScript, or redirect back when JavaScript is off */
function kv_respond($ok, $errors, $page, $extra = []) {
    if (kv_is_ajax()) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        http_response_code($ok ? 200 : (isset($errors['_server']) ? 500 : 422));
        echo json_encode(array_merge(['ok' => $ok, 'errors' => (object)$errors], $extra));
    } else {
        header('Location: ' . $page . '?' . ($ok ? 'sent=1' : 'error=1'));
    }
    exit;
}
function kv_only_post() {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        http_response_code(405);
        header('Allow: POST');
        exit('Method not allowed');
    }
}
/* Very small flood guard: max 5 submissions per 10 minutes per visitor (file based, no database needed) */
function kv_rate_limited($bucket) {
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'x';
    $file = sys_get_temp_dir() . '/krishvi_' . $bucket . '_' . md5($ip) . '.json';
    $now  = time();
    $hits = [];
    if (is_file($file)) {
        $d = json_decode((string)@file_get_contents($file), true);
        if (is_array($d)) { $hits = array_filter($d, function ($t) use ($now) { return $t > $now - 600; }); }
    }
    if (count($hits) >= 5) { return true; }
    $hits[] = $now;
    @file_put_contents($file, json_encode(array_values($hits)), LOCK_EX);
    return false;
}
function kv_send($subject, $body, $replyEmail, $replyName) {
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= 'From: Krishvi Website <' . KRISHVI_FROM . ">\r\n";
    if ($replyEmail && filter_var($replyEmail, FILTER_VALIDATE_EMAIL)) {
        $headers .= 'Reply-To: ' . kv_line($replyName, 80) . ' <' . $replyEmail . ">\r\n";
    }
    $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    return @mail(KRISHVI_TO, $subject, $body, $headers);
}
