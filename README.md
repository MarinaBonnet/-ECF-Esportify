# 🎮 Esportify

Esportify est une plateforme web dédiée aux compétition  e-sport.  
Elle permet aux joueurs de s’inscrire à des compétitions, de voir leur stats et  communiquer entre eux .
Elle est aussi doté d'une interface de gestion pour ses événements .
---

## 🚀 Fonctionnalités principales
- Inscription aux tournois et à la newsletter
- Envoi d’emails HTML personnalisés (jeu, date, récompenses, lien)
- Lien de désinscription sécurisé (RGPD)
- Interface responsive (desktop + mobile)
- Gestion des événements et communication centralisée
- Design gaming immersif

---

## ⚙️ Spécifications techniques
- **Langage :** PHP 8+
- **Base de données :** MariaDB/MySQL
- **Connexion :** PDO avec requêtes préparées
- **Emails :** PHPMailer via SMTP Gmail (TLS)
- **Gestion des secrets :** `.env` (phpdotenv)
- **Frontend :** HTML5 / CSS3 responsive
- **Versionning :** Git + GitHub

---

## 🔐 Sécurité
- Validation des emails côté client (HTML5) et côté serveur (PHP `filter_var`)
- Requêtes préparées PDO pour éviter les injections SQL
- Tokens uniques pour la désinscription
- Identifiants sensibles protégés dans `.env`
- SMTP sécurisé avec TLS
- Respect du RGPD (désinscription possible à tout moment)

---

## 📦 Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/tonPseudo/esportify.git
