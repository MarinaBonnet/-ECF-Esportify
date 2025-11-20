-- 🔹 Table des favoris
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  categorie VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Table de l’historique des événements
CREATE TABLE event_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  cible VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  timestamp INT NOT NULL
);

-- 🔹 Table des statuts
CREATE TABLE status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  statut VARCHAR(50) NOT NULL, -- ex: actif, inactif, bloqué
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 🔹 Table des scores
CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  score INT DEFAULT 0,
  niveau VARCHAR(50), -- ex: débutant, avancé, expert
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table users

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- events

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    statut ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- participation

CREATE TABLE participations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);


DELIMITER $$

CREATE TRIGGER after_participation_insert
AFTER INSERT ON participations
FOR EACH ROW
BEGIN
    -- 🔹 Incrémenter le score du user
    UPDATE scores 
    SET score = score + 10 
    WHERE user_id = NEW.user_id;

    -- 🔹 Ajouter une trace dans l’historique
    INSERT INTO event_history (type, cible, message, timestamp)
    VALUES (
        'score',
        'user',
        CONCAT('Utilisateur #', NEW.user_id, ' a gagné 10 points en rejoignant l’événement #', NEW.event_id),
        UNIX_TIMESTAMP()
    );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER after_participation_delete
AFTER DELETE ON participations
FOR EACH ROW
BEGIN
    -- 🔹 Retirer des points au user
    UPDATE scores 
    SET score = GREATEST(score - 10, 0) -- éviter score négatif
    WHERE user_id = OLD.user_id;

    -- 🔹 Ajouter une trace dans l’historique
    INSERT INTO event_history (type, cible, message, timestamp)
    VALUES (
        'score',
        'user',
        CONCAT('Utilisateur #', OLD.user_id, ' a perdu 10 points en quittant l’événement #', OLD.event_id),
        UNIX_TIMESTAMP()
    );
END$$

DELIMITER ;

CREATE TABLE matches (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100),
    date DATETIME,
    category VARCHAR(50),
    status VARCHAR(20),
    image VARCHAR(255)
);

CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id VARCHAR(50),
    username VARCHAR(50),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);
