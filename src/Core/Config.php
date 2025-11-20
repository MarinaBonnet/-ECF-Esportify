<?php
namespace Core;

use Symfony\Component\Dotenv\Dotenv;

class Config {
    private static array $settings = [];
    private static bool $loaded = false;

    public static function load(string $envPath = __DIR__ . '/../../.env'): void {
        if (!self::$loaded) {
            $dotenv = new Dotenv();
            $dotenv->load($envPath);
            self::$settings = $_ENV;
            self::$loaded = true;
        }
    }

    public static function get(string $key, $default = null) {
        self::load(); // auto-load si pas encore fait
        return self::$settings[$key] ?? $default;
    }
}
