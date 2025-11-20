<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Core\Config;
use Core\EventFetcher;

header('Content-Type: application/json');

// Charger le .env
Config::load(__DIR__ . '/../../.env');

// Récupérer action et input
$action = $_GET['action'] ?? null;
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

if (!$action) {
    http_response_code(400);
    echo json_encode(['error' => 'Action manquante']);
    exit;
}

// Instancier et router
$fetcher = new EventFetcher();
$fetcher->handle($action, $input);
