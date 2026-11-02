<?php
/* Contact form handler: every field is mandatory */
require __DIR__ . '/mail-helper.php';
kv_only_post();

/* Honeypot: bots fill this hidden field, people never see it */
if (!empty($_POST['company'] ?? '')) { kv_respond(true, [], 'contact.html'); }

$name    = kv_line($_POST['name'] ?? '', 100);
$phone   = kv_line($_POST['phone'] ?? '', 30);
$email   = kv_line($_POST['email'] ?? '', 150);
$message = kv_text($_POST['message'] ?? '', 3000);

$err    = [];
$digits = preg_replace('/\D/', '', $phone);

if (mb_strlen($name) < 2)                                  $err['name']    = 'Please tell us your name.';
if ($phone === '')                                         $err['phone']   = 'Please enter your phone number.';
elseif (strlen($digits) < 10 || strlen($digits) > 13)      $err['phone']   = 'Enter a valid phone number.';
if ($email === '')                                         $err['email']   = 'Please enter your email address.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL))        $err['email']   = 'Enter a valid email address.';
if ($message === '')                                       $err['message'] = 'Please write your message.';
elseif (mb_strlen($message) < 10)                          $err['message'] = 'A few words more, please (at least 10 characters).';

if ($err) { kv_respond(false, $err, 'contact.html'); }
if (kv_rate_limited('contact')) { kv_respond(false, ['_server' => 'Too many messages. Please try again in a few minutes.'], 'contact.html'); }

$body = "New enquiry from the Krishvi website\n"
      . "-----------------------------------\n"
      . "Name:    $name\n"
      . "Phone:   $phone\n"
      . "Email:   $email\n\n"
      . "Message:\n$message\n\n"
      . "-----------------------------------\n"
      . 'Sent: ' . date('D, d M Y, h:i A') . " IST\n";

if (!kv_send('Krishvi enquiry from ' . $name, $body, $email, $name)) {
    kv_respond(false, ['_server' => 'We could not send your message right now. Please call +91 81473 51117.'], 'contact.html');
}
kv_respond(true, [], 'contact.html', ['name' => $name]);
