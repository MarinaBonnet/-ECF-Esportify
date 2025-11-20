<?php
require_once '../db.php';
session_start();

$user_id  = $_SESSION['user_id'] ?? 0;
$event_id = $_GET['event_id'] ?? 0;

if (!$user_id || !$event_id) {
    header("Location: ../../event_tournois.php?msg=non_inscrit");
    exit;
}

// Vérifier si inscrit
$stmt = $pdo->prepare("SELECT * FROM participants WHERE user_id = ? AND event_id = ?");
$stmt->execute([$user_id, $event_id]);
$inscrit = $stmt->fetch();

if (!$inscrit) {
    header("Location: ../../event_tournois.php?msg=non_inscrit");
    exit;
}

// Supprimer l'inscription
$stmt = $pdo->prepare("DELETE FROM participants WHERE user_id = ? AND event_id = ?");
$stmt->execute([$user_id, $event_id]);

header("Location: ../../event_tournois.php?msg=desinscription_ok");
exit;
