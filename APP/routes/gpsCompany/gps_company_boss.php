<?php

use App\Http\Controllers\GpsCompany\BossController;
use Illuminate\Support\Facades\Route;

//Workshop Boss Routes
Route::middleware('auth:sanctum')->controller(BossController::class)->prefix('gpsCompanyBoss')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::get('edit/{id}', 'edit');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
});
