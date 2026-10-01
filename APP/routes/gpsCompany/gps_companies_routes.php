<?php

use App\Http\Controllers\GpsCompany\GpsCompanyController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->controller(GpsCompanyController::class)->prefix('gps_companies')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update', 'update');
    Route::post('changeStatus', 'changeStatus');
});
