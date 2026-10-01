<?php

use App\Http\Controllers\DroneCamera\DroneCameraCardPrintController;
use Illuminate\Support\Facades\Route;

//Printed Cards Routes
Route::middleware('auth:sanctum')->controller(DroneCameraCardPrintController::class)->prefix('droneCameraPrintedCard')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
    Route::post('changeStatusOfLicense', 'changeStatusOfLicense');
    Route::get('generate-idcard/{id}', 'generateIDCard');
});
