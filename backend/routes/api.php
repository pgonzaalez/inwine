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
use App\Models\Restaurant;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StripeController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);

    Route::put('/seller', [SellerController::class, 'update']);
    Route::put('/restaurant', [RestaurantController::class, 'update']);
    Route::put('/investor', [InvestorController::class, 'update']);

    // Rutas para inversor
    // Ruta para obtener el historial del inversor
    Route::get('{userId}/investments', [InvestorController::class,'investments']);

    Route::get('{userId}/investments/{investmentId}', [InvestorController::class,'showInvestment']);

    
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/update-active-role', [AuthController::class, 'updateActiveRole'])->middleware('auth:sanctum');


Route::prefix('v1')->group(function () {

    // Route::apiResource('/products', ProductController::class)->middleware('auth:sanctum');
    // Rutas para los productos
    Route::get('{userId}/products/', [ProductController::class, 'indexByUser']);
    Route::get('{userId}/products/{productId}', [ProductController::class, 'showByUser']); 
    Route::delete('{userId}/products/{productId}', [ProductController::class, 'destroyAllByUser']);
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/winetypes', WineTypeController::class);
    Route::apiResource('/investor', InvestorController::class);
    Route::get('/request-product/{id}', [RequestRestaurantController::class, 'searchByProduct']);
    Route::apiResource('/restaurants', RequestRestaurantController::class);
    Route::apiResource('/orders', OrderController::class);
    Route::get('/{userId}/orders', [OrderController::class, 'showOrderByUser']);
    Route::post('/orders/{orderId}/completed', [OrderController::class, 'completed']);

    Route::get('/{userId}/restaurant', [RequestRestaurantController::class, 'indexByRestaurant']);

    Route::post('/seller', [AuthController::class, 'storeSeller']);
    Route::post('/restaurant', [AuthController::class, 'storeRestaurant']);
    Route::post('/investor', [AuthController::class, 'storeInvestor']);

    Route::delete('products/{productId}/images/{imageId}', [ProductController::class, 'deleteImage']);
    Route::put('products/{productId}/images/{imageId}/primary', [ProductController::class, 'setPrimaryImage']);

    Route::prefix('logistic')->group(function () {
        Route::post('/{productId}/approve', [LogisticController::class, 'approve']);
        Route::post('/{productId}/send', [LogisticController::class, 'send']);
        Route::post('/{productId}/deliver', [LogisticController::class, 'deliver']);
        Route::post('/{productId}/sell', [LogisticController::class, 'sell']);
    });

    Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);

   
});
