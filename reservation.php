<?php
/* Reservation form handler: every field is mandatory except "Anything we should know?" (notes) */
require __DIR__ . '/mail-helper.php';
kv_only_post();

/* Honeypot */
if (!empty($_POST['company'] ?? '')) { kv_respond(true, [], 'reservation.html'); }

$slots = [
    '12:00' => '12:00 PM', '12:30' => '12:30 PM', '13:00' => '1:00 PM',  '13:30' => '1:30 PM',
    '14:00' => '2:00 PM',  '14:30' => '2:30 PM',  '15:00' => '3:00 PM',  '15:30' => '3:30 PM',
    '19:00' => '7:00 PM',  '19:30' => '7:30 PM',  '20:00' => '8:00 PM',  '20:30' => '8:30 PM',
    '21:00' => '9:00 PM',  '21:30' => '9:30 PM',  '22:00' => '10:00 PM', '22:30' => '10:30 PM',
];
$occasions = ['Just dinner', 'Birthday', 'Anniversary', 'Family', 'Business', 'Other'];

$date     = kv_line($_POST['date'] ?? '', 10);
$time     = kv_line($_POST['time'] ?? '', 5);
$guests   = (int)($_POST['guests'] ?? 0);
$occasion = kv_line($_POST['occasion'] ?? '', 40);
$name     = kv_line($_POST['name'] ?? '', 100);
$phone    = kv_line($_POST['phone'] ?? '', 30);
$email    = kv_line($_POST['email'] ?? '', 150);
$notes    = kv_text($_POST['notes'] ?? '', 1500);      /* optional */

$err    = [];
$digits = preg_replace('/\D/', '', $phone);
$today  = date('Y-m-d');
$max    = date('Y-m-d', strtotime('+120 days'));

/* date */
if ($date === '')                                                       $err['date'] = 'Please choose a date.';
elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !checkdate((int)substr($date, 5, 2), (int)substr($date, 8, 2), (int)substr($date, 0, 4)))
                                                                        $err['date'] = 'Please choose a valid date.';
elseif ($date < $today)                                                 $err['date'] = 'That date has passed. Please pick today or later.';
elseif ($date > $max)                                                   $err['date'] = 'We take bookings up to 120 days ahead.';

/* time */
if ($time === '')                                                       $err['time'] = 'Please pick a time.';
elseif (!isset($slots[$time]))                                          $err['time'] = 'Please pick one of the listed times.';
elseif (!isset($err['date']) && $date === $today) {
    [$h, $m] = array_map('intval', explode(':', $time));
    if ($h * 60 + $m < ((int)date('G')) * 60 + (int)date('i') + 30)     $err['time'] = 'That time has passed. Please pick a later time or another date.';
}

/* guests + occasion */
if ($guests < 1 || $guests > 20)                                        $err['guests'] = 'Guests must be between 1 and 20.';
if (!in_array($occasion, $occasions, true))                             $err['occasion'] = 'Please choose an occasion.';

/* contact details (all mandatory) */
if (mb_strlen($name) < 2)                                               $err['name'] = 'Please tell us your name.';
if ($phone === '')                                                      $err['phone'] = 'Please enter your phone number.';
elseif (strlen($digits) < 10 || strlen($digits) > 13)                   $err['phone'] = 'Enter a valid phone number.';
if ($email === '')                                                      $err['email'] = 'Please enter your email address.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL))                     $err['email'] = 'Enter a valid email address.';

if ($err) { kv_respond(false, $err, 'reservation.html'); }
if (kv_rate_limited('reservation')) { kv_respond(false, ['_server' => 'Too many requests. Please try again in a few minutes.'], 'reservation.html'); }

$niceDate = date('D, j M Y', strtotime($date));
$when     = $niceDate . ', ' . $slots[$time];
$gl       = $guests . ($guests === 1 ? ' guest' : ' guests');

$body = "New table request from the Krishvi website\n"
      . "-------------------------------------------\n"
      . "Date:      $niceDate ($date)\n"
      . "Time:      {$slots[$time]}\n"
      . "Guests:    $guests\n"
      . "Occasion:  $occasion\n\n"
      . "Name:      $name\n"
      . "Phone:     $phone\n"
      . "Email:     $email\n\n"
      . 'Notes:     ' . ($notes !== '' ? "\n$notes" : '-') . "\n"
      . ($guests > 8 ? "\n* Party above 8: please call the guest to arrange seating.\n" : '')
      . "-------------------------------------------\n"
      . 'Sent: ' . date('D, d M Y, h:i A') . " IST\n";

if (!kv_send('Table request: ' . $gl . ', ' . $when . ' (' . $name . ')', $body, $email, $name)) {
    kv_respond(false, ['_server' => 'We could not send your request right now. Please call +91 81473 51117.'], 'reservation.html');
}
kv_respond(true, [], 'reservation.html', ['name' => $name, 'summary' => $gl . ' · ' . $when]);
