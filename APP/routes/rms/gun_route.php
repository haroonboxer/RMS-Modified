<?php

use App\Http\Controllers\rms\GunController;
use Illuminate\Support\Facades\Route;

// auth:sanctum
Route::middleware('auth:sso')->controller(GunController::class)->prefix('gun')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('update/{id}', 'update');
});
