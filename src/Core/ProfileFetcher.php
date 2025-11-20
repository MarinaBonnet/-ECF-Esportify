<?php
namespace Core;

class ProfileFetcher extends Fetcher {

    public function handle(string $action, string $username): void {
        switch ($action) {
            case 'stats':
                $this->jsonResponse(['stats' => $this->getStats($username)]);
                break;

            case 'favorites':
                $this->jsonResponse(['favorites' => $this->getFavorites($username)]);
                break;

            case 'history':
                $this->jsonResponse(['history' => $this->getHistory($username)]);
                break;

            default:
                $this->errorResponse('Action inconnue', 400);
        }
    }

    /**
     * Récupère les stats du joueur
     */
    private function getStats(string $username): array {
        $stmt = $this->db->prepare("
            SELECT matchs_joues, matchs_gagnes, classement_general, classement_equipe
            FROM stats
            WHERE username = ?
        ");
        $stmt->execute([$username]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) {
            return [];
        }

        return [
            ['label' => 'Matchs joués', 'value' => (int)$row['matchs_joues']],
            ['label' => 'Matchs gagnés', 'value' => (int)$row['matchs_gagnes']],
            ['label' => 'Classement général', 'value' => (int)$row['classement_general']],
            ['label' => 'Classement équipe', 'value' => (int)$row['classement_equipe']]
        ];
    }

    /**
     * Récupère les favoris du joueur
     */
    private function getFavorites(string $username): array {
        $stmt = $this->db->prepare("
            SELECT id, nom, url, categorie
            FROM favoris
            WHERE username = ?
            ORDER BY id DESC
        ");
        $stmt->execute([$username]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
    }

    /**
     * Récupère l’historique du joueur
     */
    private function getHistory(string $username): array {
        $stmt = $this->db->prepare("
            SELECT id, nom, date, description
            FROM historique
            WHERE username = ?
            ORDER BY date DESC
        ");
        $stmt->execute([$username]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
    }
}
