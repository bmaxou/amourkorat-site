<?php
header('Content-Type: application/json; charset=UTF-8');

function respond($ok, $error = '') {
    echo json_encode(['ok' => $ok, 'error' => $error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Méthode non autorisée.');
}

// Piège à robots : champ invisible qui doit rester vide
if (!empty($_POST['site'])) {
    respond(true);
}

$nom     = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Merci de renseigner une adresse e-mail valide.');
}
if ($message === '') {
    respond(false, 'Merci de renseigner un message.');
}

$to      = 'contact@amourkorat.com';
$subject = 'Nouveau message via le site AmourKorat.com';
$body    = "Nom : " . ($nom !== '' ? $nom : '(non renseigné)') . "\n";
$body   .= "E-mail : $email\n\n";
$body   .= "Message :\n$message\n";

$safeEmail = str_replace(["\r", "\n"], '', $email);
$headers  = "From: contact@amourkorat.com\r\n";
$headers .= "Reply-To: $safeEmail\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $body, $headers);

respond($sent, $sent ? '' : "L'envoi a échoué, merci de réessayer ou d'écrire directement à contact@amourkorat.com.");
