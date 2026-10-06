<?php

use App\Http\Controllers\GpsCompany\GpsCompanyAgencyController;
use Illuminate\Support\Facades\Route;

//Assistant Routesauth:sanctum
Route::middleware('auth:sso')->controller(GpsCompanyAgencyController::class)->prefix('gpsCompanyAgency')->group(function () {
    Route::get('index', 'index');
    Route::get('allGpsCompanyAgency/{id?}', 'allGpsCompanyAgency');
    Route::get('createButton', 'createButton');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::post('changeStatus', 'changeStatus');
});
