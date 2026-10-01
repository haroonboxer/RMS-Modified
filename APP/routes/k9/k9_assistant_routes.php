<?php

use App\Http\Controllers\k9\K9AssistantController;
use Illuminate\Support\Facades\Route;

//Assistant Routes
Route::middleware('auth:sanctum')->controller(K9AssistantController::class)->prefix('k9-assistant')->group(function () {
    Route::get('index', 'index');
    Route::get('createButton', 'createButton');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('update/{id}', 'update');
    Route::post('changeStatus', 'changeStatus');
});
