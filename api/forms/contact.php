<?php
require_once __DIR__ . '/../../vendor/autoload.php'; // adapte le chemin selon ton projet

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die("❌ Erreur de connexion : " . $e->getMessage());
}

// Récupérer les données
$nom = $_POST['nom'] ?? '';
$emails = $_POST['email'] ?? [];
$message = $_POST['message'] ?? '';

if ($nom && !empty($emails) && $message) {
    foreach ($emails as $email) {
        $stmt = $pdo->prepare("INSERT INTO contacts (nom, email, message) VALUES (?, ?, ?)");
        $stmt->execute([$nom, $email, $message]);
    }
    echo json_encode(["success" => true, "message" => "✅ Message enregistré avec succès"]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Champs manquants"]);
}

