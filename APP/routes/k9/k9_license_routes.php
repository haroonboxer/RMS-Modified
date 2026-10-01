<?php

use App\Http\Controllers\k9\K9LicenseController;
use Illuminate\Support\Facades\Route;

//Licences Routes
Route::middleware('auth:sanctum')->controller(K9LicenseController::class)->prefix('k9-license')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
    Route::post('changeStatusOfPrint', 'changeStatusOfPrint');
});
