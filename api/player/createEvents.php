<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';
session_start();

$user_id = $_SESSION['user_id'] ?? 0;
$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data['title'] ?? '');
$start = $data['start'] ?? '';
$description = trim($data['description'] ?? '');

if (!$title || !$start || !$description) {
  http_response_code(400);
  echo json_encode(["error" => "Champs manquants"]);
  exit;
}

// Vérifier si le joueur a le droit de créer (ex: organisateur ou premium)
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$role = $stmt->fetchColumn();

if (!in_array($role, ['organisateur','premium'])) {
  http_response_code(403);
  echo json_encode(["error" => "Non autorisé"]);
  exit;
}

// Création de l'événement
$stmt = $pdo->prepare("
  INSERT INTO matches (title, start, description, status, created_by)
  VALUES (?, ?, ?, 'en_attente', ?)
");
$stmt->execute([$title, $start, $description, $user_id]);

echo json_encode([
  "message" => "Événement créé",
  "title" => $title,
  "start" => $start
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
