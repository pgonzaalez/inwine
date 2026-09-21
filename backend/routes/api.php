<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WineTypeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RequestRestaurantController;
use App\Http\Controllers\Api\LogisticController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\FavoriteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\CommissionController;

// Login: throttled to slow down credential-stuffing / brute force attempts.
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword'])->middleware('throttle:5,1');
    Route::put('/user/preferences', [UserController::class, 'updatePreferences']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-active-role', [AuthController::class, 'updateActiveRole']);

    // Favorites routes
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{productId}/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/favorites/ids', [FavoriteController::class, 'ids']);

    Route::put('/seller', [SellerController::class, 'update']);
    Route::put('/restaurant', [RestaurantController::class, 'update']);
    Route::put('/investor', [InvestorController::class, 'update']);

    // Rutas para inversor
    // Ruta para obtener el historial del inversor
    Route::get('{userId}/investments', [InvestorController::class, 'investments']);
    Route::get('{userId}/investments/{investmentId}', [InvestorController::class, 'showInvestment']);
});

Route::prefix('v1')->group(function () {

    // ---- Alta de cuenta (público, sin sesión todavía) ----
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/seller', [AuthController::class, 'storeSeller']);
        Route::put('/restaurant', [AuthController::class, 'storeRestaurant']);
        Route::post('/investor', [AuthController::class, 'storeInvestor']);
    });

    // ---- Lectura pública: catálogo e información de marketplace ----
    // OJO: estas rutas no deben devolver nunca datos sensibles (balances,
    // tarjetas, cuentas bancarias, NIF...). Cualquier campo nuevo que se
    // añada a estas respuestas debe revisarse con ese criterio.
    Route::get('{userId}/products/', [ProductController::class, 'indexByUser']);
    Route::get('{userId}/products/{productId}', [ProductController::class, 'showByUser']);
    Route::apiResource('/products', ProductController::class)->only(['index', 'show']);
    Route::apiResource('/winetypes', WineTypeController::class)->only(['index', 'show']);

    Route::get('/commissions/{type}', [CommissionController::class, 'show']);

    Route::get('/restaurants-info', [RestaurantController::class, 'indexInfo']);
    Route::get('/restaurants-info/{id}', [RestaurantController::class, 'showPublicData']);
    Route::get('/restaurants-requests', [RequestRestaurantController::class, 'searchActiveUserRequests']);
    Route::get('/request-product/{id}', [RequestRestaurantController::class, 'searchByProduct']);
    Route::get('/{userId}/restaurant', [RequestRestaurantController::class, 'indexByRestaurant']);
    Route::get('/{userId}/restaurant/{requestId}', [RequestRestaurantController::class, 'showRequestWithProduct']);
    Route::apiResource('/restaurants', RequestRestaurantController::class)->only(['index', 'show']);

    // ---- Todo lo demás muta estado o toca datos privados: requiere sesión ----
    Route::middleware('auth:sanctum')->group(function () {
        Route::delete('{userId}/products/{productId}', [ProductController::class, 'destroyAllByUser']);
        Route::apiResource('/products', ProductController::class)->only(['store', 'update', 'destroy']);
        Route::post('products/{id}/duplicate', [ProductController::class, 'duplicate']);
        Route::delete('products/{productId}/images/{imageId}', [ProductController::class, 'deleteImage']);
        Route::put('products/{productId}/images/{imageId}/primary', [ProductController::class, 'setPrimaryImage']);

        Route::apiResource('/winetypes', WineTypeController::class)->only(['store', 'update', 'destroy']);

        // 'store' se excluye a propósito: InvestorController::store() nunca ha
        // tenido implementación (está vacío) y, si se registrara aquí, su
        // ruta (POST /v1/investor) pisaría silenciosamente a la ruta de alta
        // real (AuthController::storeInvestor, pública, definida más arriba)
        // porque Laravel resuelve una URI+método duplicados con el último
        // registro, no el primero.
        Route::apiResource('/investor', InvestorController::class)->except(['store']);

        Route::apiResource('/restaurants', RequestRestaurantController::class)->only(['store', 'update', 'destroy']);
        Route::delete('/restaurant/{id}', [RequestRestaurantController::class, 'destroy']);

        Route::apiResource('/orders', OrderController::class);
        Route::get('{userId}/orders/', [OrderController::class, 'showOrderByUser']);
        Route::post('/orders/{orderId}/completed', [OrderController::class, 'completed']);
        Route::delete('{userId}/orders/clear', [OrderController::class, 'clearForUser']);

        Route::prefix('logistic')->group(function () {
            Route::post('/{productId}/approve', [LogisticController::class, 'approve']);
            Route::post('/{productId}/send', [LogisticController::class, 'send']);
            Route::post('/{productId}/deliver', [LogisticController::class, 'deliver']);
            Route::post('/{productId}/sell', [LogisticController::class, 'sell']);
        });

        Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
    });
});
