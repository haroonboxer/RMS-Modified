<?php

use App\Http\Controllers\DroneCamera\DroneCameraBossController;
use Illuminate\Support\Facades\Route;

//Workshop Boss Routes
Route::middleware('auth:sanctum')->controller(DroneCameraBossController::class)->prefix('DroneCameraBoss')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::get('edit/{id}', 'edit');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
});
