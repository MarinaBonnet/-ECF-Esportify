<?php
require_once 'autoload.php';
use Core\Config;

header('Content-Type: application/json');

try {
    $pdo = new PDO(
        "mysql:host=" . Config::db()['host'] . ";dbname=" . Config::db()['name'] . ";charset=utf8",
        Config::db()['user'],
        Config::db()['pass']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM status ORDER BY updated_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
