<?php
// /api/organizer/inscriptions.php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';

// Exemple : récupérer toutes les inscriptions avec joueur + événement
$sql = "SELECT p.username AS joueur, m.title AS event
        FROM inscriptions i
        JOIN players p ON i.player_id = p.id
        JOIN matches m ON i.match_id = m.id
        WHERE i.status = 'en_attente'";

$stmt = $pdo->query($sql);
$inscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($inscriptions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
