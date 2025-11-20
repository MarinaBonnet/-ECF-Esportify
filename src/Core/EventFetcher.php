<?php
namespace Core;

class EventFetcher extends Fetcher {

    public function handle(string $action, ?array $input = []): void {
        switch ($action) {
            case 'create':
                $this->jsonResponse(['success' => true, 'event' => $this->createEvent($input)]);
                break;
            case 'update':
                $this->jsonResponse(['success' => true, 'event' => $this->updateEvent($input)]);
                break;
            case 'delete':
                $this->jsonResponse(['success' => true, 'deleted' => $this->deleteEvent((int)($input['event_id'] ?? 0))]);
                break;
            case 'validate':
                $this->jsonResponse(['success' => true, 'event' => $this->validateEvent((int)($input['event_id'] ?? 0))]);
                break;
            case 'reject':
                $this->jsonResponse(['success' => true, 'event' => $this->rejectEvent((int)($input['event_id'] ?? 0))]);
                break;
            case 'manage':
                $this->jsonResponse(['success' => true, 'events' => $this->manageEvents()]);
                break;
            case 'all':
                $this->jsonResponse(['success' => true, 'events' => $this->fetchAllEvents()]);
                break;
            case 'join':
                $this->jsonResponse(['success' => true, 'joined' => $this->joinEvent((int)($input['user_id'] ?? 0), (int)($input['event_id'] ?? 0))]);
                break;
            case 'joined':
                $this->jsonResponse(['success' => true, 'events' => $this->fetchJoined((int)($input['user_id'] ?? 0))]);
                break;
            default:
                $this->errorResponse('Action inconnue');
        }
    }

    private function createEvent(array $input): array {
        $stmt = $this->db->prepare("
            INSERT INTO events (title, date, statut)
            VALUES (:title, :date, :statut)
        ");
        $stmt->execute([
            ':title'  => $input['title'] ?? 'Sans titre',
            ':date'   => $input['date'] ?? date('Y-m-d'),
            ':statut' => $input['statut'] ?? 'en_attente'
        ]);
        return $this->getEventById((int)$this->db->lastInsertId());
    }

    private function updateEvent(array $input): ?array {
        $id = (int)($input['event_id'] ?? 0);
        if (!$id) return null;

        $stmt = $this->db->prepare("
            UPDATE events SET title = :title, date = :date, statut = :statut
            WHERE id = :id
        ");
        $stmt->execute([
            ':id'     => $id,
            ':title'  => $input['title'] ?? 'Sans titre',
            ':date'   => $input['date'] ?? date('Y-m-d'),
            ':statut' => $input['statut'] ?? 'en_attente'
        ]);
        return $this->getEventById($id);
    }

    private function deleteEvent(int $eventId): bool {
        if (!$eventId) return false;
        $stmt = $this->db->prepare("DELETE FROM events WHERE id = :id");
        return $stmt->execute([':id' => $eventId]);
    }

    private function validateEvent(int $eventId): ?array {
        if (!$eventId) return null;
        $stmt = $this->db->prepare("UPDATE events SET statut = 'valide' WHERE id = :id");
        $stmt->execute([':id' => $eventId]);
        return $this->getEventById($eventId);
    }

    private function rejectEvent(int $eventId): ?array {
        if (!$eventId) return null;
        $stmt = $this->db->prepare("UPDATE events SET statut = 'refuse' WHERE id = :id");
        $stmt->execute([':id' => $eventId]);
        return $this->getEventById($eventId);
    }

    private function manageEvents(): array {
        $stmt = $this->db->query("SELECT * FROM events ORDER BY date ASC");
        return $stmt->fetchAll();
    }

    private function fetchAllEvents(): array {
        $stmt = $this->db->query("SELECT * FROM events ORDER BY date ASC");
        return $stmt->fetchAll();
    }

    private function joinEvent(int $userId, int $eventId): array {
        if (!$userId || !$eventId) return ['joined' => false];

        $stmt = $this->db->prepare("SELECT COUNT(*) FROM participations WHERE user_id = :user_id AND event_id = :event_id");
        $stmt->execute([':user_id' => $userId, ':event_id' => $eventId]);
        if ($stmt->fetchColumn() > 0) {
            return ['joined' => false, 'message' => 'Déjà inscrit'];
        }

        $stmt = $this->db->prepare("INSERT INTO participations (user_id, event_id) VALUES (:user_id, :event_id)");
        $success = $stmt->execute([':user_id' => $userId, ':event_id' => $eventId]);

        return [
        'joined' => $success,
        'event' => $this->getEventById($eventId),
        'score_added' => $success ? 10 : 0
    ];
    }

    private function fetchJoined(int $userId): array {
        if (!$userId) return [];
        $stmt = $this->db->prepare("
            SELECT e.* 
            FROM events e
            JOIN participations p ON e.id = p.event_id
            WHERE p.user_id = :user_id
            ORDER BY e.date ASC
        ");
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    private function getEventById(int $eventId): ?array {
        $stmt = $this->db->prepare("SELECT * FROM events WHERE id = :id");
        $stmt->execute([':id' => $eventId]);
        $event = $stmt->fetch();
        return $event ?: null;
    }

}
