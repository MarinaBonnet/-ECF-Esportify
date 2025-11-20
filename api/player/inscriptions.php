<?php
// /api/player/inscriptions.php
header('Content-Type: application/json; charset=utf-8');
require_once '../core/db.php';

// Exemple : récupérer l'ID du joueur connecté
$player_id = 1; // ⚠️ À remplacer par ton système d'authentification

$sql = "SELECT m.title AS event, i.status
        FROM inscriptions i
        JOIN matches m ON i.match_id = m.id
        WHERE i.player_id = ?
        ORDER BY m.start ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$player_id]);
$inscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($inscriptions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
