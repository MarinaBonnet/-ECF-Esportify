<?php
// /api/player/events.php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';

// On récupère les événements ouverts aux inscriptions
$sql = "SELECT id, title, start, description 
        FROM matches 
        WHERE status = 'en_attente'
        ORDER BY start ASC";

$stmt = $pdo->query($sql);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
