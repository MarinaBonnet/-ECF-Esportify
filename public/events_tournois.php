<?php
require_once 'db.php';
session_start();

$user_id = $_SESSION['user_id'] ?? 0;

// Récupération des filtres
$search = $_GET['search'] ?? '';
$categorie = $_GET['categorie'] ?? '';
$msg = $_GET['msg'] ?? ''; // récupération du message

$params = [];
$where = "WHERE 1=1";

if (!empty($search)) {
    $where .= " AND titre LIKE ?";
    $params[] = "%$search%";
}
if (!empty($categorie)) {
    $where .= " AND categorie = ?";
    $params[] = $categorie;
}

// Tournois en cours
$stmt = $pdo->prepare("SELECT * FROM events $where AND statut = 'En cours'");
$stmt->execute($params);
$eventsEnCours = $stmt->fetchAll();

// Tournois à venir
$stmt = $pdo->prepare("SELECT * FROM events $where AND statut = 'À venir'");
$stmt->execute($params);
$eventsAVenir = $stmt->fetchAll();

// Exemple : récupérer les résultats pour un tournoi précis
$event_id = $_GET['event_id'] ?? 1; // ⚠️  passer l'ID du tournoi en paramètre

$stmt = $pdo->prepare("
    SELECT rang, username, score_tournoi
    FROM classement_podium
    WHERE event_id = ?
    ORDER BY rang ASC
");
$stmt->execute([$event_id]);
$results = $stmt->fetchAll();

// Récupérer tous les tournois en cours
$stmt = $pdo->prepare("SELECT id, title, date FROM events WHERE statu = 'En cours'");
$stmt->execute();
$eventsEnCours = $stmt->fetchAll();

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

<body>


  <!--header de la page avec bannière et menu-->
  <main class="site-content events">

    <!--menu de navigation desktop-->
    <header class="header ">

      <div class="topbar">
        <div class="logo">
          <a href="accueil.html"><img src="assets/img/logoManette.png" alt="logo de esportify" /></a>
        </div>
        <nav class="nav-links" aria-label="Menu de navigation">
  <a href="accueil.html">Accueil</a>
  <a href="event_tournois.php">Événements</a>
  <a href="jeux.php">Jeux</a>
  <a href="contact.php">Contacts</a>
  <a href="connexion.php">Connexion</a>
</nav>
        <button class="burger" aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded="false">
          <span class="lines" aria-hidden="true"></span>
        </button>
      </div>
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

     <!-- Messages de confirmation -->
  <?php if (!empty($msg)): ?>
    <div class="alert">
      <?php if ($msg == 'inscription_ok'): ?>
        ✅ Inscription réussie !
      <?php elseif ($msg == 'desinscription_ok'): ?>
        ❌ Désinscription effectuée.
      <?php elseif ($msg == 'deja_inscrit'): ?>
        ⚠️ Vous êtes déjà inscrit à ce tournoi.
      <?php elseif ($msg == 'non_inscrit'): ?>
        ⚠️ Vous n’êtes pas inscrit à ce tournoi.
      <?php else: ?>
        ℹ️ Action effectuée.
      <?php endif; ?>
    </div>
  <?php endif; ?>

   <!-- Filtres -->
    <section class="filters">
      <form method="get">
        <input type="text" name="search" placeholder="Rechercher un tournoi..." value="<?= htmlspecialchars($search) ?>">
        <select name="categorie">
          <option value="">Toutes catégories</option>
          <option value="Réflexion" <?= $categorie=="Réflexion"?"selected":"" ?>>Réflexion</option>
          <option value="Sport" <?= $categorie=="Sport"?"selected":"" ?>>Sport</option>
        </select>
        <button type="submit">Filtrer</button>
      </form>
    </section>

    <!-- Tournois en cours -->
    <section class="event-section">
      <h3>Tournois en cours</h3>
      <?php if (empty($eventsEnCours)): ?>
        <p>Aucun tournoi en cours trouvé.</p>
      <?php else: ?>
        <?php foreach ($eventsEnCours as $event): ?>
          <article class="event-card">
            <h4><?= htmlspecialchars($event['titre']) ?></h4>
            <p>Date : <?= htmlspecialchars($event['date']) ?></p>
            <p>Catégorie : <?= htmlspecialchars($event['categorie']) ?></p>
            <p>Statut : <?= htmlspecialchars($event['statut']) ?></p>
            <div class="event-actions">
              <?php
              $stmt = $pdo->prepare("SELECT COUNT(*) FROM participants WHERE user_id = ? AND event_id = ?");
              $stmt->execute([$user_id, $event['id']]);
              $isInscrit = $stmt->fetchColumn() > 0;
              ?>
              <?php if ($isInscrit): ?>
                <a href="api/event/unsubscribe.php?event_id=<?= $event['id'] ?>" class="leave-event">Quitter le tournoi</a>
              <?php else: ?>
                <a href="api/event/subscribe.php?event_id=<?= $event['id'] ?>" class="join-event">Rejoindre le tournoi</a>
              <?php endif; ?>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
    </section>

    <!-- Tournois à venir -->
    <section class="event-section">
      <h3>Tournois à venir</h3>
      <?php if (empty($eventsAVenir)): ?>
        <p>Aucun tournoi à venir trouvé.</p>
      <?php else: ?>
        <?php foreach ($eventsAVenir as $event): ?>
        <article class="event-card">
  <h4><?= htmlspecialchars($event['title']) ?></h4>
  <p>Date : <?= htmlspecialchars($event['date']) ?></p>
  <?php if (isset($event['categorie'])): ?>
    <p>Catégorie : <?= htmlspecialchars($event['categorie']) ?></p>
  <?php endif; ?>
  <p>Statut : <?= htmlspecialchars($event['statu']) ?></p>

  <div class="event-actions">
    <?php if ($user_id > 0): ?>
      <?php
      $stmt = $pdo->prepare("SELECT COUNT(*) FROM participants WHERE user_id = ? AND event_id = ?");
      $stmt->execute([$user_id, $event['id']]);
      $isInscrit = $stmt->fetchColumn() > 0;
      ?>
      <?php if ($isInscrit): ?>
        <a href="api/event/unsubscribe.php?event_id=<?= $event['id'] ?>" class="leave-event">Quitter le tournoi</a>
      <?php else: ?>
        <a href="api/event/subscribe.php?event_id=<?= $event['id'] ?>" class="join-event">Rejoindre le tournoi</a>
      <?php endif; ?>
    <?php else: ?>
      <p>⚠️ Connectez-vous pour participer aux tournois.</p>
    <?php endif; ?>
  </div>
</article>
        <?php endforeach; ?>
      <?php endif; ?>
    </section>

    <!-- Section jeux -->
    <section class="training-games">
      <h2>Jeux</h2>
      <p>Améliore tes réflexes, ta stratégie en solo ou contre l’ordinateur.</p>
      <div class="game-grid">
        <article class="game-card">
          <img src="/assets/img/imagesJeux/imgJeuMarina.png" alt="Aim Trainer" class="game-img">
          <h3>Aim Trainer</h3>
          <p>Mode : Solo / Contre IA</p>
          <button class="btn-play">Jouer</button>
        </article>
        <article class="game-card">
          <img src="/assets/img/imagesJeux/mario.jpg" alt="Chess Reflex" class="game-img">
          <h3>Chess Reflex</h3>
          <p>Mode : Réflexion / Contre IA</p>
          <button class="btn-play">Jouer</button>
        </article>
      </div>
    </section>

    <!-- Résultats -->
  <section class="match-results">
  <h2>Classements des tournois en cours</h2>

  <?php if (empty($eventsEnCours)): ?>
    <p>Aucun tournoi en cours pour le moment.</p>
  <?php else: ?>
    <?php foreach ($eventsEnCours as $event): ?>
      <div class="event-result-block">
        <h3>🏆 <?= htmlspecialchars($event['title']) ?> (<?= $event['date'] ?>)</h3>

        <?php
        // Récupérer le classement pour ce tournoi
        $stmt = $pdo->prepare("
          SELECT rang, username, score_tournoi
          FROM classement_podium
          WHERE event_id = ?
          ORDER BY rang ASC
        ");
        $stmt->execute([$event['id']]);
        $results = $stmt->fetchAll();
        ?>

        <?php if (empty($results)): ?>
          <p>Aucun résultat disponible pour ce tournoi.</p>
        <?php else: ?>
          <table class="results-table">
            <thead>
              <tr><th>Position</th><th>Joueur</th><th>Score</th></tr>
            </thead>
            <tbody>
             <?php foreach ($results as $row): ?>
  <?php
    $class = '';
    if ($row['rang'] == 1) $class = 'gold animate-pulse'; // 🥇 pulse
    elseif ($row['rang'] == 2) $class = 'silver animate-fadein'; // 🥈 fadeIn
    elseif ($row['rang'] == 3) $class = 'bronze animate-fadein'; // 🥉 fadeIn
    else $class = 'animate-fadein'; // autres joueurs fadeIn
  ?>
  <tr class="<?= $class ?>">
    <td>
      <?php if ($row['rang'] == 1): ?>🥇
      <?php elseif ($row['rang'] == 2): ?>🥈
      <?php elseif ($row['rang'] == 3): ?>🥉
      <?php else: ?><?= $row['rang'] ?>
      <?php endif; ?>
    </td>
    <td><?= htmlspecialchars($row['username']) ?></td>
    <td><?= $row['score_tournoi'] ?> pts</td>
  </tr>
<?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
</section>
  </main>
  <!--pied de page -->
  <footer class="footer-nav">
    <a href="/accueil.html"><img class="logo" src="assets/img/logoManette.png" alt="logo de esportify" /></a>
    <ul>
      <li>© 2025 Esportify. Tous droits réservés.</li>
      <li>Made With <img src="/assets/img/icones/Vector_heart.png" alt=" icone coeur" class="icone-heart" /></li>
      <li>Condition d'utilisation</li>
      <li>Contact nous</li>
    </ul>
  </footer>
        <script>
    const isLoggedIn = <?php echo json_encode(isset($_SESSION['user_id'])); ?>;
  </script>
  <script type="module" src="/js/main.js"></script>

</body>

</html>