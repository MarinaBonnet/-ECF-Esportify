<?php
// /admin/users.php
require_once '../db.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $pdo->query("SELECT username, role FROM users ORDER BY username ASC LIMIT 50");
  echo json_encode(["list" => $stmt->fetchAll(PDO::FETCH_ASSOC)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  if (!isset($data['action'], $data['user'])) { http_response_code(400); echo json_encode(["error"=>"missing params"]); exit; }

  if ($data['action'] === 'banUser') {
    $stmt = $pdo->prepare("UPDATE users SET status='suspendu' WHERE username=?");
    $stmt->execute([$data['user']]);
    echo json_encode(["message"=>"user suspended"]); exit;
  }

  if ($data['action'] === 'changeRole') {
    // demo: cycle role joueur -> organisateur -> admin -> joueur
    $stmt = $pdo->prepare("SELECT role FROM users WHERE username=?");
    $stmt->execute([$data['user']]);
    $current = $stmt->fetchColumn();
    $order = ['joueur','organisateur','admin'];
    $next = $order[(array_search($current, $order) + 1) % count($order)];
    $upd = $pdo->prepare("UPDATE users SET role=? WHERE username=?");
    $upd->execute([$next, $data['user']]);
    echo json_encode(["message"=>"role changed", "newRole"=>$next]); exit;
  }

  http_response_code(400); echo json_encode(["error"=>"unknown action"]); exit;
}
