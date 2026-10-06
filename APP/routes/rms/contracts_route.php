<?php

use App\Http\Controllers\rms\ContractController;
use Illuminate\Support\Facades\Route;

//Contract Routesauth:sanctum
Route::middleware('auth:sso')->controller(ContractController::class)->prefix('contract')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
});
