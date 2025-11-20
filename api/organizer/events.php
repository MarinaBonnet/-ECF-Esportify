<?php
// /api/organizer/events.php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['title'], $data['start'], $data['description'])) {
  http_response_code(400);
  echo json_encode(["error" => "Paramètres manquants"]);
  exit;
}

// Exemple d’insertion
$stmt = $pdo->prepare("INSERT INTO matches (title, start, description, status) VALUES (?, ?, ?, 'en_attente')");
$stmt->execute([$data['title'], $data['start'], $data['description']]);

echo json_encode([
  "message" => "Événement créé",
  "title" => $data['title'],
  "start" => $data['start']
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
