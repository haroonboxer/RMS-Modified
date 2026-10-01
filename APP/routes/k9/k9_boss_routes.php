<?php

use App\Http\Controllers\k9\K9BossController;
use Illuminate\Support\Facades\Route;

//K9 Boss Routes
Route::middleware('auth:sanctum')->controller(K9BossController::class)->prefix('k9-boss')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::get('edit/{id}', 'edit');
    Route::post('update/{id}', 'update');
});
