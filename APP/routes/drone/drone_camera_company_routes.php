<?php

use App\Http\Controllers\DroneCamera\DroneCameraCompanyController;
use Illuminate\Support\Facades\Route;

//Companies Routes
Route::middleware('auth:sanctum')->controller(DroneCameraCompanyController::class)->prefix('DroneCameraCompany')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('changeStatus', 'changeStatus');
    Route::post('update', 'update');
});
