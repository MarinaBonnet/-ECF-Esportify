<?php
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$pdo = new PDO(
    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8",
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$token = $_GET['token'] ?? '';

if ($token) {
    $stmt = $pdo->prepare("UPDATE newsletter SET status='unsubscribed' WHERE unsubscribe_token=?");
    $stmt->execute([$token]);

    if ($stmt->rowCount() > 0) {
        echo "<h1>Tu es bien désabonné(e) de la newsletter Esportify ✅</h1>";
    } else {
        echo "<h1>❌ Token invalide ou déjà désabonné</h1>";
    }
} else {
    echo "<h1>❌ Erreur : token manquant</h1>";
}
