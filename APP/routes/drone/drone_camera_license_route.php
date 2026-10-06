<?php

use App\Http\Controllers\DroneCamera\DroneCameraLicenseController;
use Illuminate\Support\Facades\Route;

//Licences Routes  auth:sanctum
Route::middleware('auth:sso')->controller(DroneCameraLicenseController::class)->prefix('DroneCameraLicense')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
    Route::post('changeStatusOfPrint', 'changeStatusOfPrint');
});
