<?php

namespace App\Logging;

use Monolog\Logger;

/**
 * Factory para el canal de logging "discord" (config/logging.php).
 * Laravel invoca esta clase con la config del canal y espera un Logger de
 * Monolog de vuelta ('driver' => 'custom', 'via' => self::class).
 */
class CreateDiscordLogger
{
    public function __invoke(array $config): Logger
    {
        $level = Logger::toMonologLevel($config['level'] ?? 'debug');

        return new Logger('discord', [
            new DiscordWebhookHandler($config['url'] ?? null, $level),
        ]);
    }
}
