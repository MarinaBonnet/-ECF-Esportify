<?php
require_once '../autoload.php';
use Core\Config;

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO(
        "mysql:host=" . Config::db()['host'] . ";dbname=" . Config::db()['name'] . ";charset=utf8",
        Config::db()['user'],
        Config::db()['pass']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $action = $_GET['action'] ?? 'get';
    $userId = $_GET['user_id'] ?? 0;

    switch ($action) {
        case 'update':
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("UPDATE favoris 
                           SET nom = :nom, url = :url, categorie = :categorie 
                           WHERE id = :id AND user_id = :user_id");
    $stmt->execute([
        ':nom' => $data['nom'],
        ':url' => $data['url'],
        ':categorie' => $data['categorie'],
        ':id' => $data['id'],
        ':user_id' => $data['user_id']
    ]);
    echo json_encode(['success' => true, 'message' => 'Favori mis à jour']);
    break;

        case 'add':
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("INSERT INTO favoris (nom, url, categorie, user_id) VALUES (:nom, :url, :categorie, :user_id)");
            $stmt->execute([
                ':nom' => $data['nom'],
                ':url' => $data['url'],
                ':categorie' => $data['categorie'],
                ':user_id' => $data['user_id']
            ]);
            echo json_encode(['success' => true, 'message' => 'Favori ajouté']);
            break;

        case 'remove':
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("DELETE FROM favoris WHERE id = :id AND user_id = :user_id");
            $stmt->execute([
                ':id' => $data['id'],
                ':user_id' => $data['user_id']
            ]);
            echo json_encode(['success' => true, 'message' => 'Favori supprimé']);
            break;

        case 'render':
            $stmt = $pdo->prepare("SELECT id, nom, url, categorie FROM favoris WHERE user_id = :user_id");
            $stmt->execute([':user_id' => $userId]);
            $favoris = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($favoris as $fav) {
                echo '<div class="carte" data-id="' . $fav['id'] . '" data-categorie="' . htmlspecialchars($fav['categorie']) . '">';
                echo '<span class="etoile">⭐</span>';
                echo '<h3>' . htmlspecialchars($fav['nom']) . '</h3>';
                echo '<a href="' . htmlspecialchars($fav['url']) . '" target="_blank">' . htmlspecialchars($fav['url']) . '</a>';
                echo '</div>';
            }
            break;

        case 'get':
        default:
            $stmt = $pdo->prepare("SELECT id, nom, url, categorie FROM favoris WHERE user_id = :user_id");
            $stmt->execute([':user_id' => $userId]);
            $favoris = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'favorites' => $favoris]);
            break;

    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
