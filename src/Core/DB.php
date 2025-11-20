<?php
namespace Core;

use PDO;
use PDOException;
use Core\Config;

class DB extends PDO {
    public function __construct() {
        // Récupération des paramètres depuis .env via Config
        $host    = Config::get('DB_HOST');
        $port    = Config::get('DB_PORT', '3307'); // ajout du port avec valeur par défaut
        $dbname  = Config::get('DB_NAME');
        $user    = Config::get('DB_USER');
        $pass    = Config::get('DB_PASS');
        $charset = Config::get('DB_CHARSET', 'utf8mb4');

        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";
        try {
            parent::__construct($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false
            ]);
        } catch (PDOException $e) {
            throw new \RuntimeException("Erreur de connexion DB: " . $e->getMessage());
        }
    }
}
