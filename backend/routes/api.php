<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WineTypeController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/user', [UserController::class, 'show'])->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/winetypes', WineTypeController::class);
    Route::apiResource('/investor', InvestorController::class);
    Route::post('/seller', [AuthController::class, 'storeSeller']);
});
