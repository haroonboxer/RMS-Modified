<?php

use App\Http\Controllers\DroneCamera\DroneCameraCompanyController;
use Illuminate\Support\Facades\Route;

//Companies Routes  auth:sanctum
Route::middleware('auth:sso')->controller(DroneCameraCompanyController::class)->prefix('DroneCameraCompany')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('changeStatus', 'changeStatus');
    Route::post('update', 'update');
});
