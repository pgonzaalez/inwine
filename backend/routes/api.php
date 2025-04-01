<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WineTypeController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\LogisticController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/user', [UserController::class, 'show'])->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Route::apiResource('/products', ProductController::class)->middleware('auth:sanctum');
    // Rutas para los productos
    Route::get('{userId}/products/', [ProductController::class, 'indexByUser']); // Todos los productos de un usuario
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/winetypes', WineTypeController::class);
    Route::apiResource('/investor', InvestorController::class);
    Route::get('/request/{id}', [RequestController::class, 'searchByProduct']);
    Route::apiResource('/request', RequestController::class);
    Route::apiResource('/restaurants', RestaurantController::class);

    Route::post('/seller', [AuthController::class, 'storeSeller']);
    Route::get('/{userId}/restaurant', [RestaurantController::class, 'indexByRestaurant']);
    Route::post('/restaurant', [AuthController::class, 'storeRestaurant']);


    Route::delete('products/{productId}/images/{imageId}', [ProductController::class, 'deleteImage']);
    Route::put('products/{productId}/images/{imageId}/primary', [ProductController::class, 'setPrimaryImage']);

    Route::prefix('logistic')->group(function () {
        Route::post('/{productId}/approve', [LogisticController::class, 'approve']);
        Route::post('/{productId}/send', [LogisticController::class, 'send']);
        Route::post('/{productId}/deliver', [LogisticController::class, 'deliver']);
        Route::post('/{productId}/sell', [LogisticController::class, 'sell']);
    });
});
