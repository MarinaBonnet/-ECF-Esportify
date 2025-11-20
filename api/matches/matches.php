<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php'; // 🔹 connexion PDO

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 🔹 Récupération des matchs
    $stmt = $pdo->query("SELECT id, title, date, category, status, image FROM matches");
    $matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 🔹 Ajout des joueurs pour chaque match
    foreach ($matches as &$match) {
        $stmtPlayers = $pdo->prepare("SELECT username FROM players WHERE match_id = ?");
        $stmtPlayers->execute([$match['id']]);
        $match['players'] = $stmtPlayers->fetchAll(PDO::FETCH_COLUMN);
    }

    echo json_encode($matches, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

elseif ($method === 'POST') {
    // 🔹 Ajouter un joueur à un match
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['matchId'], $data['player'])) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètres manquants"]);
        exit;
    }

    $matchId = $data['matchId'];
    $player = $data['player'];

    // Vérifier si le joueur est déjà inscrit
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM players WHERE match_id = ? AND username = ?");
    $stmt->execute([$matchId, $player]);
    $exists = $stmt->fetchColumn();

    if ($exists) {
        echo json_encode(["message" => "$player est déjà inscrit"]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO players (match_id, username) VALUES (?, ?)");
        $stmt->execute([$matchId, $player]);
        echo json_encode(["message" => "$player inscrit au tournoi $matchId"]);
    }
}
