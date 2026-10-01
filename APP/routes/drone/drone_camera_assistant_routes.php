<?php

use App\Http\Controllers\DroneCamera\DroneCameraAssistantController;
use Illuminate\Support\Facades\Route;

//Assistant Routes
Route::middleware('auth:sanctum')->controller(DroneCameraAssistantController::class)->prefix('DroneCameraAssistant')->group(function () {
    Route::get('index', 'index');
    Route::get('createButton', 'createButton');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::post('changeStatus', 'changeStatus');
});
