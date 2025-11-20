<?php

namespace App\Events;

use App\Core\DB;
use PDO;

class EventManager {

  public static function create(array $data, string $username): bool {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare(
      'INSERT INTO evenements (
        nom, jeu, date, description, email_organisateur, statut, joueur_proposeur
      ) VALUES (
        :nom, :jeu, :date, :description, :email, :statut, :joueur
      )'
    );

    return $stmt->execute([
      'nom' => $data['name'],
      'jeu' => $data['game'],
      'date' => $data['date'],
      'description' => $data['description'],
      'email' => $data['email'],
      'statut' => 'en attente',
      'joueur' => $username
    ]);
  }

  public static function update(array $data, string $username): bool {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare(
      'UPDATE evenements SET
        nom = :nom,
        jeu = :jeu,
        date = :date,
        description = :description,
        statut = "en attente",
        modifie_par = :modifie_par,
        derniere_modification = NOW()
       WHERE id = :id'
    );

    return $stmt->execute([
      'nom' => $data['nom'],
      'jeu' => $data['jeu'],
      'date' => $data['date'],
      'description' => $data['description'],
      'modifie_par' => $username,
      'id' => $data['id']
    ]);
  }

  public static function validate(int $id): bool {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare('UPDATE evenements SET statut = "validé" WHERE id = :id');
    return $stmt->execute(['id' => $id]);
  }

  public static function reject(int $id): bool {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare('UPDATE evenements SET statut = "refusé" WHERE id = :id');
    return $stmt->execute(['id' => $id]);
  }

  public static function delete(int $id): bool {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare('DELETE FROM evenements WHERE id = :id');
    return $stmt->execute(['id' => $id]);
  }

  public static function getAll(): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->query(
      'SELECT id, nom, jeu, date, description, statut, joueur_proposeur, modifie_par, derniere_modification
       FROM evenements'
    );
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function getPending(): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare(
      'SELECT id, nom, jeu, date, description, statut, joueur_proposeur
       FROM evenements
       WHERE statut = "en attente"'
    );
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
