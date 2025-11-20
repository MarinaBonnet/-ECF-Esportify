<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use Core\DB;

session_start();

try {
    $pdo = new DB();
} catch (\RuntimeException $e) {
    echo "⚠️ Connexion impossible.";
    error_log($e->getMessage());
    exit;
}


// Récupération de l'ID de l'événement depuis l'URL
$event_id = $_GET['id'] ?? 0;
$user_id  = $_SESSION['user_id'] ?? null;

// Vérifier que l'événement existe
$stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
$stmt->execute([$event_id]);
$event = $stmt->fetch();

if (!$event) {
    die("Tournoi introuvable.");
}

// Vérifier que l'utilisateur est connecté et inscrit
if (!$user_id) {
    header("Location: erreur.php?msg=non_connecte");
    exit;
}

$stmt = $pdo->prepare("SELECT COUNT(*) FROM participants WHERE user_id = ? AND event_id = ?");
$stmt->execute([$user_id, $event_id]);
$isInscrit = $stmt->fetchColumn() > 0;

if (!$isInscrit) {
    header("Location: erreur.php?msg=non_inscrit");
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($event['titre']) ?> - Yams</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="assets/js/chat.js" defer></script>
</head>
<body>
<div id="game-loader" class="pulse-loader hidden"></div>

  <!-- Header -->
  <header>
    <h2><?= htmlspecialchars($event['titre']) ?></h2>
    <p>Catégorie : <?= htmlspecialchars($event['categorie']) ?> | Statut : <?= htmlspecialchars($event['statut']) ?></p>
  </header>

  <!-- Zone de jeu -->
  <section class="game-area">
    <p>Bienvenue dans le tournoi Yamzilla 🎲</p>
  </section>

  <!-- Chat -->
  <section class="chat-section">
    <h3>Chat du tournoi</h3>
    <div id="chat-box" class="chat-box"></div>

    <form id="chat-form">
      <input type="hidden" name="event_id" value="<?= $event_id ?>">
      <input type="hidden" name="user_id" value="<?= $user_id ?>">
      <input type="text" id="chat-message" name="message" placeholder="Écrire un message..." required>
      <button type="submit">Envoyer</button>
    </form>
  </section>
 <script type="module">
    import { loadGame } from "./modules/gameLoader.js";

    // Exemple : charger Yamzilla
    loadGame("yamzilla", "#game-container", "#game-title", "game-loader");
  </script>
</body>
</html>
