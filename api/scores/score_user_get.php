<?php
require_once '../../../vendor/autoload.php';

use Core\DB;

session_start();
$user = $_SESSION['username'] ?? null;

if (!$user) {
  echo json_encode(['error' => 'Utilisateur non connecté']);
  exit;
}

$db = new DB();
$query = $db->prepare('SELECT matchs_joues, matchs_gagnes, classement_general, classement_equipe FROM stats_joueurs WHERE joueur = :joueur');
$query->execute(['joueur' => $user]);

echo json_encode($query->fetch(PDO::FETCH_ASSOC));
