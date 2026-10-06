<?php

use App\Http\Controllers\rms\ReportController;
use Illuminate\Support\Facades\Route;

// auth:sanctum
Route::middleware('auth:sso')->controller(ReportController::class)->prefix('report')->group(function () {
    Route::get('index', 'index');
    Route::get('listCompany', 'listCompany');
    Route::get('monthlyCompanyStats', 'monthlyCompanyStats');
});
