<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WineTypeController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\AuthController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::prefix('v1')->group(function () {
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/winetypes', WineTypeController::class);
    Route::apiResource('/investor', InvestorController::class);
});
