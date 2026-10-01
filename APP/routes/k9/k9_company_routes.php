<?php

use App\Http\Controllers\k9\K9CompanyController;
use Illuminate\Support\Facades\Route;

//K9 Company Routes
Route::middleware('auth:sanctum')->controller(K9CompanyController::class)->prefix('k9-company')->group(function () {
    Route::get('index', 'index');
    Route::post('store', 'store');
    Route::post('view/{id}', 'view');
    Route::post('changeStatus', 'changeStatus');
    Route::post('update', 'update');
});
