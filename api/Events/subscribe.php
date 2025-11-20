<?php
require_once '../db.php';
session_start();

$user_id  = $_SESSION['user_id'] ?? 0;
$event_id = $_GET['event_id'] ?? 0;

if (!$user_id || !$event_id) {
    header("Location: ../../event_tournois.php?msg=non_inscrit");
    exit;
}

// Vérifier si déjà inscrit
$stmt = $pdo->prepare("SELECT * FROM participants WHERE user_id = ? AND event_id = ?");
$stmt->execute([$user_id, $event_id]);
$already = $stmt->fetch();

if ($already) {
    header("Location: ../../yamzilla.php?id=$event_id&msg=deja_inscrit");
    exit;
}

// Inscrire
$stmt = $pdo->prepare("INSERT INTO participants (user_id, event_id, date_inscription) VALUES (?, ?, NOW())");
$stmt->execute([$user_id, $event_id]);

header("Location: ../../yamzilla.php?id=$event_id&msg=inscription_ok");
exit;
