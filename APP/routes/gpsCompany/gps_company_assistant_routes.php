<?php

use App\Http\Controllers\GpsCompany\AssistantController;
use Illuminate\Support\Facades\Route;

//Assistant Routesauth:sanctum
Route::middleware('auth:sso')->controller(AssistantController::class)->prefix('gpsCompanyAssistant')->group(function () {
    Route::get('index', 'index');
    Route::get('createButton', 'createButton');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::post('changeStatus', 'changeStatus');
});
