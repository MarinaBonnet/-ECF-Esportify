<?php

namespace App\Helpers;

class Auth {
  public static function requireLogin(): void {
    if (!isset($_SESSION['id'])) {
      http_response_code(401);
      echo json_encode(['error' => 'Connexion requise']);
      exit;
    }
  }

  public static function requireRole(string $expected): void {
    $role = $_SESSION['role'] ?? null;
    if ($role !== $expected) {
      http_response_code(403);
      echo json_encode(['error' => 'Accès refusé']);
      exit;
    }
  }

  public static function requireAnyRole(array $roles): void {
    $role = $_SESSION['role'] ?? null;
    if (!in_array($role, $roles)) {
      http_response_code(403);
      echo json_encode(['error' => 'Accès refusé']);
      exit;
    }
  }

  public static function getUserId(): ?int {
    return $_SESSION['id'] ?? null;
  }

  public static function getRole(): ?string {
    return $_SESSION['role'] ?? null;
  }
}
