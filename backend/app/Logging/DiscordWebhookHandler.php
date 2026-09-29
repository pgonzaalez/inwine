<?php

namespace App\Logging;

use Illuminate\Support\Facades\Http;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Level;
use Monolog\LogRecord;

/**
 * Manda cada línea de log a un webhook de Discord.
 *
 * Diseño deliberado:
 * - Si no hay URL configurada, no hace nada (no lanza excepción). Así se
 *   puede dejar el canal activo en el stack de logging sin miedo a romper
 *   la app mientras nadie ha pegado todavía la URL real.
 * - El envío se difiere con `afterResponse()`: se manda después de que la
 *   respuesta ya ha llegado al navegador, así que un Discord lento o caído
 *   nunca añade latencia a la petición real, y no hace falta tener un
 *   worker de colas corriendo (no pasa por QUEUE_CONNECTION).
 * - Cualquier fallo de red al avisar a Discord se traga en silencio: como
 *   mucho se pierde ese aviso puntual, nunca debe tumbar la petición.
 * - El contenido va en un bloque de código y con `allowed_mentions` vacío
 *   para que nada de lo que aparezca en un log (un nombre, un email...)
 *   pueda disparar una mención de verdad (@everyone, @here, etc).
 */
class DiscordWebhookHandler extends AbstractProcessingHandler
{
    private const MAX_CONTENT_LENGTH = 1900;

    public function __construct(private readonly ?string $webhookUrl, int|string|Level $level = Level::Debug, bool $bubble = true)
    {
        parent::__construct($level, $bubble);

        $this->setFormatter(new LineFormatter(null, null, true, true));
    }

    protected function write(LogRecord $record): void
    {
        if (!$this->webhookUrl) {
            return;
        }

        $formatted = trim((string) $record->formatted);

        if (mb_strlen($formatted) > self::MAX_CONTENT_LENGTH) {
            $formatted = mb_substr($formatted, 0, self::MAX_CONTENT_LENGTH) . "\n… (truncado)";
        }

        $url = $this->webhookUrl;

        $send = function () use ($url, $formatted) {
            try {
                Http::timeout(5)->post($url, [
                    'content' => "```\n{$formatted}\n```",
                    'allowed_mentions' => ['parse' => []],
                ]);
            } catch (\Throwable $e) {
                // Nunca dejamos que un fallo al avisar a Discord rompa nada,
                // pero que quede constancia en el fichero de log (nunca en
                // el canal "discord": eso sería un bucle infinito) — la
                // primera versión de esto se tragaba el error del todo, lo
                // que hizo parecer que el webhook "no hacía nada" sin dar
                // ninguna pista de por qué.
                logger()->channel('single')->warning('No se pudo mandar el log a Discord', [
                    'error' => $e->getMessage(),
                ]);
            }
        };

        if (function_exists('dispatch')) {
            dispatch($send)->afterResponse();
        } else {
            $send();
        }
    }
}
