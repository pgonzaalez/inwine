<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Por defecto, Laravel intenta redirigir a un invitado no autenticado
        // a la ruta NOMBRADA 'login' (pensado para apps con sesión web). Esta
        // API no tiene ninguna ruta así — el login es POST /api/login, sin
        // vista — así que ese intento de redirección lanzaba
        // RouteNotFoundException ("Route [login] not defined") y CUALQUIER
        // petición sin token a una ruta protegida devolvía un 500 en vez de
        // un 401 limpio, siempre que el cliente no mandara
        // "Accept: application/json" (varias llamadas del frontend no lo
        // hacían). Al no haber destino de redirección, nunca lo intenta.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Toda esta API vive bajo /api — siempre debe responder en JSON
        // (422 con errores de validación, 401 sin sesión, 404, etc.),
        // nunca con una redirección HTML. Sin esto, Laravel decide el
        // formato mirando la cabecera Accept de la petición, y varias
        // llamadas del frontend no la mandan: un simple error de
        // validación (NIF duplicado, email ya usado...) se convertía en
        // una redirección 302 que el frontend no podía interpretar.
        $exceptions->shouldRenderJsonWhen(function ($request, \Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });
    })
    ->create();