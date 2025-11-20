<?php
require_once '../db.php';
session_start();

$action   = $_GET['action'] ?? '';
$user_id  = $_SESSION['user_id'] ?? 0;
$event_id = $_GET['event_id'] ?? ($_POST['event_id'] ?? 0);

header('Content-Type: application/json');

// Vérifier que l'utilisateur est connecté
if (!$user_id) {
    echo json_encode(["success" => false, "error" => "Utilisateur non connecté."]);
    exit;
}

// Vérifier que l'utilisateur est inscrit à l'événement
$stmt = $pdo->prepare("SELECT COUNT(*) FROM participants WHERE user_id = ? AND event_id = ?");
$stmt->execute([$user_id, $event_id]);
$isInscrit = $stmt->fetchColumn() > 0;

if (!$isInscrit) {
    echo json_encode(["success" => false, "error" => "Vous n'êtes pas inscrit à ce tournoi."]);
    exit;
}

// Actions
if ($action === 'get') {
    $stmt = $pdo->prepare("
        SELECT c.id, c.contenu, c.date_envoi, u.username, u.id AS user_id
        FROM chat c
        JOIN users u ON c.user_id = u.id
        WHERE c.event_id = ?
        ORDER BY c.date_envoi ASC
    ");
    $stmt->execute([$event_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $messages]);

} elseif ($action === 'send') {
    if (empty($_POST['message'])) {
        echo json_encode(["success" => false, "error" => "Message vide."]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO chat (event_id, user_id, contenu)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$event_id, $user_id, $_POST['message']]);

    echo json_encode([
        "success" => true,
        "message" => "Message envoyé.",
        "data" => [
            "contenu"   => $_POST['message'],
            "user_id"   => $user_id,
            "username"  => $_SESSION['username'],
            "date_envoi"=> date('Y-m-d H:i:s')
        ]
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Action invalide."]);
}