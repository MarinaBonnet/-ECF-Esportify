<?php
// /admin/roles.php
header('Content-Type: application/json; charset=utf-8');
require_once '../db.php';

$roles = ['joueur','organisateur','admin'];
$labels = ["Joueurs","Organisateurs","Admins"];
$counts = [];

foreach ($roles as $r) {
  $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = ?");
  $stmt->execute([$r]);
  $counts[] = (int)$stmt->fetchColumn();
}

echo json_encode(["labels" => $labels, "counts" => $counts], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
