<?php
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};port={$_ENV['DB_PORT']};dbname={$_ENV['DB_NAME']};charset=utf8",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    );
    echo "Connexion OK 🎉";
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
