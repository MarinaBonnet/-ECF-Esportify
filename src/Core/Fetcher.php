<?php
namespace Core;

use Core\DB;

abstract class Fetcher {
    protected DB $db;

    public function __construct() {
        $this->db = new DB();
    }

    /**
     * Réponse JSON standard
     */
    protected function jsonResponse(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    /**
     * Réponse d'erreur
     */
    protected function errorResponse(string $message, int $status = 400): void {
        $this->jsonResponse(['error' => $message], $status);
    }
}
