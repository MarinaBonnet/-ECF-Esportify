<?php
// /api/organizer/updateEvent.php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['event_id'], $data['status'])) {
  http_response_code(400);
  echo json_encode(["error" => "Paramètres manquants"]);
  exit;
}

// Statuts autorisés
$allowed = ['demarre', 'termine'];
if (!in_array($data['status'], $allowed)) {
  http_response_code(400);
  echo json_encode(["error" => "Statut invalide"]);
  exit;
}

// Vérification : démarrage seulement 30 minutes avant l'heure prévue
if ($data['status'] === 'demarre') {
  $stmt = $pdo->prepare("
    UPDATE matches 
    SET status = 'demarre' 
    WHERE id = ? 
      AND start <= (NOW() + INTERVAL 30 MINUTE)
      AND status = 'en_attente'
  ");
  $stmt->execute([$data['event_id']]);

  if ($stmt->rowCount() === 0) {
    http_response_code(403);
    echo json_encode(["error" => "Impossible de démarrer : trop tôt ou déjà démarré"]);
    exit;
  }
} else {
  // Exemple pour terminer un événement
  $stmt = $pdo->prepare("UPDATE matches SET status = 'termine' WHERE id = ?");
  $stmt->execute([$data['event_id']]);
}

echo json_encode([
  "message" => "Événement mis à jour",
  "id" => $data['event_id'],
  "status" => $data['status']
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
