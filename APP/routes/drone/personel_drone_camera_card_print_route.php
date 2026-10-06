<?php

use App\Http\Controllers\DroneCamera\PersonnelDroneCameraCardsApproveController;
use Illuminate\Support\Facades\Route;

//Printed Cards Routes  auth:sanctum
Route::middleware('auth:sso')->controller(PersonnelDroneCameraCardsApproveController::class)->prefix('personnelDroneCameraCardsApprove')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
    Route::post('changeStatusOfLicense', 'changeStatusOfLicense');
    Route::get('generate-idcard/{id}', 'generateIDCard');
});
