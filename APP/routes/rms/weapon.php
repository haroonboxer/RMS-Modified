<?php

use App\Http\Controllers\rms\WeaponsController;
use Illuminate\Support\Facades\Route;
// auth:sanctum
Route::middleware('auth:sso')->group(function () {
    // Weapon Routes
    Route::prefix('weapon')->controller(WeaponsController::class)->group(function () {
        Route::get('index', 'index');
        Route::post('store', 'store');
        Route::post('update/{id}', 'update');
        Route::post('changeStatus', 'changeStatus');
        Route::get('view/{id}', 'view');
    });
});
