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

// Récupération de l'utilisateur connecté
$userId = $_SESSION['user_id'] ?? 0;

// Infos joueur
$user = null;
if ($userId > 0) {
    $stmt = $pdo->prepare("SELECT username, email, role FROM users WHERE id = :id");
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();
}

if ($user) {
    echo "<h1>Bienvenue {$user['username']}</h1>";
    echo "<p>Email : {$user['email']}</p>";
    echo "<p>Rôle : {$user['role']}</p>";
} else {
    echo "<p>Aucun utilisateur connecté.</p>";
}

// Favoris
$stmt = $pdo->prepare("
    SELECT e.title, e.date
    FROM favorites f
    JOIN events e ON f.event_id = e.id
    WHERE f.user_id = :id
");
$stmt->execute(['id' => $userId]);
$favoris = $stmt->fetchAll();

// Classement perso
$stmt = $pdo->prepare("
    SELECT event_nom, score_tournoi, rang, niveau_global
    FROM classement_complet
    WHERE user_id = :id
");
$stmt->execute(['id' => $userId]);
$classement = $stmt->fetchAll();

// Historique matchs
$stmt = $pdo->prepare("
    SELECT event_nom, match_id, resultat, points_gagnes, date_match
    FROM historique_matchs
    WHERE user_id = :id
    ORDER BY date_match DESC
");
$stmt->execute(['id' => $userId]);
$historique = $stmt->fetchAll();

// Stats globales
$stats = [
    'matchs_joues'       => count($historique),
    'matchs_gagnes'      => count(array_filter($historique, fn($m) => $m['resultat'] === 'victoire')),
    'classement_general' => $classement[0]['rang'] ?? 0,
    'classement_equipe'  => 0 // à calculer via ta logique d'équipe
];

// Exemple d'affichage des stats
echo "<h2>Statistiques</h2>";
echo "<ul>";
echo "<li>Matchs joués : {$stats['matchs_joues']}</li>";
echo "<li>Matchs gagnés : {$stats['matchs_gagnes']}</li>";
echo "<li>Classement général : {$stats['classement_general']}</li>";
echo "<li>Classement équipe : {$stats['classement_equipe']}</li>";
echo "</ul>";
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Esportify - Plateforme de tournois Esport en ligne</title>
    <meta name="description" content="Mettez vos compétences à l'epreuve avec Esportify, la plateforme 100% gaming.
    Rejoignez une communauté passionnée de joueurs,participez à des tournois palpitants.
    Rejoignez-nous dès maintenant et devenez le champion du gaming ! " />
    <link rel="stylesheet" href="assets/css/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    <link rel="shortcut icon" href="assets/img/logoManette.png" />
</head>

<body data-role="admin">

    <main class="site-content events">
        <!--header de la page avec bannière et menu-->

        <header class="header">
            <!--menu de navigation desktop-->

            <div class="topbar">
                <div class="logo">
                    <a href="accueil.html"><img src="assets/img/logoManette.png" alt="logo de esportify" /></a>
                </div>
                <nav class="nav-links" aria-label="Menu de navigation">
                    <a href="accueil.html">Accueil</a>
                    <a href="events_tournois.html">Événements</a>
                    <a href="jeux.html">Jeux</a>
                    <a href="contact.html">Contacts</a>
                    <a href="connexion.html">Connexion</a>
                </nav>
                <button class="burger" aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="lines" aria-hidden="true"></span>
                </button>

                <ul class="dropdown-menu hidden">
                    <li><a href="profil.html">Mon profil</a></li>
                    <li><a href="accueil.html">Accueil</a></li>
                    <li><a href="events_tournois.html">Événements</a></li>
                    <li><a href="jeux.html">Jeux</a></li>
                    <li><a href="contact.html">Contacts</a></li>
                    <li><a href="deconnexion.html">Déconnexion</a></li>
                </ul>
            </div>
            </div>

            <div id="overlay" class="overlay hidden" aria-hidden="true"></div>
            <dialog id="mobile-menu" class="mobile-panel" aria-modal="true" aria-label="Menu">
                <nav class="mobile-nav" aria-label="Menu de navigation mobile">
                    <button class="close-menu" aria-label="Fermer le menu">×</button>
                    <a href="#accueil">Accueil</a>
                    <a href="#evenements">Evénements</a>
                    <a href="jeux.html">Jeux</a>
                    <a href="#contacts">Contacts</a>
                    <a href="#connexion">Connexion</a>
                </nav>
            </dialog>
        </header>
        <!--fin header-->

        <!-- Bloc commun -->
       

<section class="common-player-profile">

  <!-- Profil joueur -->
  <section class="player-profile">
    <div class="user-block">
      <img src="assets/img/teams/image_manga.jpg" alt="Avatar de <?= htmlspecialchars($user['username']) ?>" class="avatar">
      <h2 class="username"><?= htmlspecialchars($user['username']) ?></h2>
      <span class="role-badge" data-role="<?= $user['role'] ?>"><?= ucfirst($user['role']) ?></span>
    </div>
    <div class="level-bar">
      <label for="level">Niveau</label>
      <progress id="level" value="20" max="100"></progress>
    </div>
  </section>

  <!-- Favoris -->
  <section class="profile-block favorites-blocks">
    <h3>⭐ Mes favoris</h3>
    <?php if (empty($favoris)): ?>
      <p>Aucun favori pour l’instant.</p>
    <?php else: ?>
      <ul>
        <?php foreach ($favoris as $fav): ?>
          <li><?= htmlspecialchars($fav['title']) ?> (<?= $fav['date'] ?>)</li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </section>

  <!-- Classement perso -->
  <section class="perso-classement">
    <h3>Mon classement</h3>
    <?php foreach ($classement as $c): ?>
      <?php
$class = '';

if ($c['rang'] == 1) {
    $class = 'gold animate-pulse';
} elseif ($c['rang'] == 2) {
    $class = 'silver animate-fadein';
} elseif ($c['rang'] == 3) {
    $class = 'bronze animate-fadein';
} else {
    $class = 'animate-fadein';
}
?>
<div class="event-result-block <?= $class ?>">
    <h4>🏆 <?= $c['event_nom'] ?></h4>
    <p>
        Position : <?= $c['rang'] ?>
        <?php
        if ($c['rang'] == 1) {
            echo '🥇';
        } elseif ($c['rang'] == 2) {
            echo '🥈';
        } elseif ($c['rang'] == 3) {
            echo '🥉';
        }
        ?>
    </p>
    <p>Score : <?= $c['score_tournoi'] ?> pts</p>
    <p>Niveau : <?= $c['niveau_global'] ?></p>
</div>
<?php endforeach; ?>

  </section>

  <!-- Historique matchs -->
  <section class="perso-historique">
    <h3>Historique de mes matchs</h3>
    <?php if (empty($historique)): ?>
      <p>Aucun match joué pour l’instant.</p>
    <?php else: ?>
      <table class="results-table">
        <thead>
          <tr><th>Tournoi</th><th>Match</th><th>Résultat</th><th>Points</th><th>Date</th></tr>
        </thead>
        <tbody>
          <?php foreach ($historique as $h): ?>
            <tr class="animate-fadein">
              <td><?= htmlspecialchars($h['event_nom']) ?></td>
              <td>#<?= $h['match_id'] ?></td>
              <td><?= $h['resultat'] ?></td>
              <td><?= $h['points_gagnes'] ?> pts</td>
              <td><?= $h['date_match'] ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </section>

  <!-- Stats -->
 
            <section class="stats-section">
  <h3>Mes statistiques</h3>
  <div class="stats-grid">
    <div class="stats-card">
      <h4>Matchs joués</h4>
      <p><?= $stats['matchs_joues'] ?></p>
    </div>
    <div class="stats-card">
      <h4>Matchs gagnés</h4>
      <p><?= $stats['matchs_gagnes'] ?></p>
    </div>
    <div class="stats-card">
      <h4>Classement général</h4>
      <p><?= $stats['classement_general'] ?></p>
    </div>
    <div class="stats-card">
      <h4>Classement équipe</h4>
      <p><?= $stats['classement_equipe'] ?></p>
    </div>
  </div>
</section>

  <!-- Création d’événement -->
<section class="event-create">
  <h3>Créer un événement</h3>
  <form id="event-form-player">
    <input type="text" name="title" placeholder="Nom de l'événement" required />
    <input type="datetime-local" name="start" required />
    <textarea name="description" placeholder="Description de l'événement" required></textarea>
    <button type="submit">Soumettre</button>
  </form>
</section>

  <!-- Historique des événements -->
  <section class="event-history">
    <h3>Historique des événements</h3>
    <div class="event-list">
      <!-- événements ajoutés dynamiquement -->
    </div>
  </section>

  <!-- Événements disponibles -->
 <section class="events-list">
  <h3>Événements disponibles</h3>
  <?php if (empty($events_disponibles)): ?>
    <p>Aucun événement disponible pour l’instant.</p>
  <?php else: ?>
    <table class="table-style">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Date</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($events_disponibles as $ev): ?>
          <tr>
            <td><?= htmlspecialchars($ev['title']) ?></td>
            <td><?= $ev['start'] ?></td>
            <td><?= htmlspecialchars($ev['description']) ?></td>
            <td>
              <!-- Bouton d'inscription -->
             <button class="join-btn" data-id="<?= $ev['id'] ?>">S'inscrire</button>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</section>


  <!-- Mes inscriptions -->
  <section class="my-inscriptions">
  <h3>Mes inscriptions</h3>
  <?php if (empty($mes_inscriptions)): ?>
    <p>Aucune inscription pour l’instant.</p>
  <?php else: ?>
    <table class="table-style">
      <thead>
        <tr>
          <th>Événement</th>
          <th>Date</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($mes_inscriptions as $insc): ?>
          <tr>
            <td><?= htmlspecialchars($insc['event']) ?></td>
            <td><?= $insc['start'] ?></td>
            <td>
              <?php if ($insc['status'] === 'valide'): ?>
                ✅ Validée
              <?php elseif ($insc['status'] === 'rejete'): ?>
                ❌ Rejetée
              <?php else: ?>
                ⏳ En attente
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</section>

  <!-- Exemple carte match -->
  <section class="match-card" id="match-42">
    <h3>Match #42</h3>
    <p>Les Boss du 33 vs Team Rocket</p>
    <!-- Bouton favori injecté par JS -->
  </section>
</section>

<!-- Team -->
<section class="team-section">
  <h3>Ma team</h3>
  <p class="team-name"> les boss du 33</p>
  <!-- perso.html -->
<iframe
    src="message/team.html"
    title="Discussion de l'équipe"
    width="100%"
    height="400"
    style="border:none;">
</iframe>


  <input type="text" placeholder="Rechercher une team" class="team-search" />
  <div class="team-action">
    <button>Créer une team</button>
    <button>Demande d'ajout</button>
  </div>
</section>



        
       <!-- Bloc organisateur  -->
  <h1>🎤 Interface Organisateur</h1>

  <!-- Tableau des inscriptions -->
  <section class="inscription-management">
    <h3>Inscriptions reçues</h3>
    <table class="table-style inscription-table">
      <thead>
        <tr>
          <th>Joueur</th>
          <th>Événement</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="inscription-rows">
        <!-- Généré par JS -->
      </tbody>
    </table>
  </section>

  <!-- Tableau des événements -->
  <section class="organizer-dashboard">
    <h3>Organisations des événements</h3>
    <table class="table-style event-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Date</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="event-rows">
        <!-- Généré par JS -->
      </tbody>
    </table>
  </section>

  <!-- Formulaire création/modification -->
  <section class="event-editor">
    <h3>Créer ou modifier un événement</h3>
    <form id="event-form-organizer">
      <input type="hidden" name="id" /> <!-- vide = création -->
      <input type="text" name="title" placeholder="Nom de l'événement" required />
      <input type="datetime-local" name="start" required />
      <textarea name="description" placeholder="Description" required></textarea>
      <button type="submit">Soumettre</button>
    </form>
  </section>
</main>

       
<!-- Bloc réservé aux administrateurs -->
<section class="admin-panel" data-visible-for="admin">
  <h2>Interface Administrateur</h2>

  <!-- Onglets -->
  <div class="admin-tabs">
    <button data-tab="moderation" class="tab-btn active">Modération</button>
    <button data-tab="users" class="tab-btn">Utilisateurs</button>
    <button data-tab="dashboard" class="tab-btn">Tableau de bord</button>
  </div>

  <!-- Contenu des onglets -->
  <div class="admin-tab-content">
    <!-- Modération -->
    <div class="tab-section" id="moderation" data-tab-content>
      <h3>Modération des événements</h3>
      <div class="event-card">
        <h4>Tournoi Rocket League</h4>
        <p>Statut : Validé</p>
        <button class="suspend-btn">Suspendre</button>
        <button class="view-modifications-btn">Voir les modifications</button>
      </div>
    </div>

    <!-- Utilisateurs -->
    <div class="tab-section hidden" id="users" data-tab-content>
      <h3>Gestion des utilisateurs</h3>
      <table class="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Marinabpro</td>
            <td>Organisateur</td>
            <td>
              <button class="change-role-btn">Changer rôle</button>
              <button class="ban-user-btn">Suspendre</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dashboard -->
    <div class="tab-section hidden" id="dashboard" data-tab-content>
      <h3>Tableau de bord</h3>
      <div class="dashboard-grid">
        <div class="metric-card">
          <h4>Événements créés</h4>
          <p id="event-count">0</p>
        </div>
        <div class="metric-card">
          <h4>Participants inscrits</h4>
          <p id="participant-count">0</p>
        </div>
        <div class="metric-card">
          <h4>Événements suspendus</h4>
          <p id="suspended-count">0</p>
        </div>
      </div>
      <canvas id="eventChart"></canvas>
    </div>
  </div>
</section>

    </main>
    <!--pied de page -->
    <footer class="footer-nav">
        <a href="accueil.html"><img class="logo" src="assets/img/logoManette.png" alt="logo de esportify" /></a>
        <ul>
            <li>© 2025 Esportify. Tous droits réservés.</li>
            <li>Made With <img src="assets/img/icones/Vector_heart.png" alt=" icone coeur" class="icone-heart" />
            </li>
            <li>Condition d'utilisation</li>
            <li>Contact nous</li>
        </ul>
    </footer>

    <script type="module" src="js/main.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


</body>

</html>