<?php
// /api/player/join.php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['event_id'])) {
  http_response_code(400);
  echo json_encode(["error" => "Paramètres manquants"]);
  exit;
}

// Exemple : récupérer l'ID du joueur connecté (ici simplifié)
$player_id = 1; // ⚠️ À remplacer par ton système d'authentification

// Vérifier si déjà inscrit
$stmt = $pdo->prepare("SELECT id FROM inscriptions WHERE player_id = ? AND match_id = ?");
$stmt->execute([$player_id, $data['event_id']]);
if ($stmt->fetch()) {
  http_response_code(409);
  echo json_encode(["error" => "Déjà inscrit à cet événement"]);
  exit;
}

// Inscrire le joueur
$stmt = $pdo->prepare("INSERT INTO inscriptions (player_id, match_id, status) VALUES (?, ?, 'en_attente')");
$stmt->execute([$player_id, $data['event_id']]);

echo json_encode([
  "message" => "Inscription envoyée",
  "event_id" => $data['event_id'],
  "player_id" => $player_id
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
