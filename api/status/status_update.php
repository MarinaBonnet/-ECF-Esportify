<?php
require_once 'autoload.php';
use Core\Config;

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$statut = $data['statut'] ?? null;

if (!$id || !$statut) {
    http_response_code(400);
    echo json_encode(['error' => 'ID et statut requis']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=" . Config::db()['host'] . ";dbname=" . Config::db()['name'] . ";charset=utf8",
        Config::db()['user'],
        Config::db()['pass']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("UPDATE status SET statut = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$statut, $id]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
