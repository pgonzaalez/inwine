<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WineTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/winetypes', WineTypeController::class);
});
