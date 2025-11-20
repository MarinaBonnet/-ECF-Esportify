<?php
// /admin/moderation.php
require_once '../db.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $pdo->query("SELECT id, title, status FROM matches ORDER BY date DESC LIMIT 20");
  echo json_encode(["events" => $stmt->fetchAll(PDO::FETCH_ASSOC)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  if (!isset($data['action'], $data['id'])) { http_response_code(400); echo json_encode(["error"=>"missing params"]); exit; }
  if ($data['action'] === 'suspend') {
    $stmt = $pdo->prepare("UPDATE matches SET status='suspendu' WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["message"=>"event suspended"]); exit;
  }
  if ($data['action'] === 'validate') {
    $stmt = $pdo->prepare("UPDATE matches SET status='valide' WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["message"=>"event validated"]); exit;
  }
  http_response_code(400); echo json_encode(["error"=>"unknown action"]); exit;
}
