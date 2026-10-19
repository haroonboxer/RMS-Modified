<?php

use App\Http\Controllers\k9\K9CardPrintController;
use Illuminate\Support\Facades\Route;

//Printed Cards Routesauth:sanctum
Route::middleware('auth:sso')->controller(K9CardPrintController::class)->prefix('k9-printed-card')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::get('createButton', 'createButton');
    Route::post('changeStatus', 'changeStatus');
    Route::post('changeStatusOfLicense', 'changeStatusOfLicense');
    Route::get('generate-idcard/{id}', 'generateIDCard');
});
