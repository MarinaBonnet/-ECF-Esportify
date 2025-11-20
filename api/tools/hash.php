<?php
// Exemple pour générer un hash pour "admin123" a remplacer pour chaque nouveau mdp 
echo password_hash("admin123", PASSWORD_DEFAULT);
// genere un hash different pour chaque demande  a mettre dans la bdd 