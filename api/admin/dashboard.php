<?php
// /admin/dashboard.php
header('Content-Type: application/json; charset=utf-8');
require_once '../db.php';

$eventsCreated = (int)$pdo->query("SELECT COUNT(*) FROM matches")->fetchColumn();
$participants  = (int)$pdo->query("SELECT COUNT(*) FROM players")->fetchColumn();
$suspended     = (int)$pdo->query("SELECT COUNT(*) FROM matches WHERE status='suspendu'")->fetchColumn();

echo json_encode([
  "eventsCreated" => $eventsCreated,
  "participants"  => $participants,
  "suspended"     => $suspended
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
