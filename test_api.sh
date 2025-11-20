#!/bin/bash

echo "🔹 Lister tous les événements"
curl http://localhost/api/events/index.php?action=all
echo -e "\n-----------------------------\n"

echo "🔹 Voir les événements de Bob (user_id=2)"
curl http://localhost/api/events/index.php?action=joined&user_id=2
echo -e "\n-----------------------------\n"

echo "🔹 Inscrire Alice (user_id=1) à Hackathon Dev (event_id=2)"
curl -X POST http://localhost/api/events/index.php?action=join \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"event_id":2}'
echo -e "\n-----------------------------\n"

echo "🔹 Créer un nouvel événement"
curl -X POST http://localhost/api/events/index.php?action=create \
     -H "Content-Type: application/json" \
     -d '{"title":"Tournoi Magic","date":"2025-12-10","statut":"en_attente"}'
echo -e "\n-----------------------------\n"

echo "🔹 Valider l’événement Conférence PHP (event_id=1)"
curl -X POST http://localhost/api/events/index.php?action=validate \
     -H "Content-Type: application/json" \
     -d '{"event_id":1}'
echo -e "\n-----------------------------\n"

echo "🔹 Rejeter l’événement Hackathon Dev (event_id=2)"
curl -X POST http://localhost/api/events/index.php?action=reject \
     -H "Content-Type: application/json" \
     -d '{"event_id":2}'
echo -e "\n-----------------------------\n"

echo "🔹 Supprimer l’événement Atelier Sécurité (event_id=3)"
curl -X POST http://localhost/api/events/index.php?action=delete \
     -H "Content-Type: application/json" \
     -d '{"event_id":3}'
echo -e "\n-----------------------------\n"
