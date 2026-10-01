<?php

use App\Http\Controllers\DroneCamera\PersonnelDroneCameraController;
use Illuminate\Support\Facades\Route;

// Personnel Drone Routes
Route::middleware('auth:sanctum')->controller(PersonnelDroneCameraController::class)->prefix('PersonnelDroneCamera')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('changeStatus', 'changeStatus');
    Route::post('update', 'update');
});
