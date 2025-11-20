<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../core/autoload.php';
require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

try {
    // Connexion PDO
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};port={$_ENV['DB_PORT']};dbname={$_ENV['DB_NAME']};charset=utf8",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connexion réussie<br>";
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$email = $_POST['email'] ?? null;

if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $token = bin2hex(random_bytes(32));

    // Insérer en BDD
    $stmt = $pdo->prepare("INSERT INTO newsletter (email, unsubscribe_token) VALUES (?, ?)");
    $stmt->execute([$email, $token]);

    // Charger le template
    $template = file_get_contents(__DIR__ . "/../../public/newsletter.html");
    $template = str_replace("{{username}}", "Marina", $template);
    $template = str_replace("{{gameName}}", "League of Legends", $template);
    $template = str_replace("{{eventDate}}", "20 novembre 2025", $template);
    $template = str_replace("{{eventTime}}", "18h00", $template);
    $template = str_replace("{{rewards}}", "500€ + goodies", $template);
    $template = str_replace("{{eventLink}}", "https://esportify.com/tournoi", $template);
    $template = str_replace("{{unsubscribeLink}}", "https://esportify.com/unsubscribe.php?token=$token", $template);

    // Envoyer avec PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'];
        $mail->Password   = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $_ENV['SMTP_PORT'];

        $mail->setFrom('newsletter@esportify.com', 'Esportify');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = "🎮 Nouveau tournoi sur Esportify !";
        $mail->Body    = $template;

        $mail->send();
        echo "✅ Email envoyé via Gmail SMTP et inscrit en BDD";
    } catch (Exception $e) {
        echo "❌ Erreur d'envoi SMTP : {$mail->ErrorInfo}";
    }
} else {
    echo "❌ Email invalide ou non reçu";
}
