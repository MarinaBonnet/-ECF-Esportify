<?php
spl_autoload_register(function ($class) {
    $prefix = 'Core\\';
    $baseDir = __DIR__ . '/';

    // Vérifie si la classe commence par le bon namespace
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    // Récupère le nom relatif de la classe
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    } else {
        throw new \InvalidArgumentException("Classe introuvable : $file");
    }
});
