<?php

use App\Http\Controllers\DroneCamera\DroneCameraReportController;
use Illuminate\Support\Facades\Route;

// auth:sanctum
Route::middleware('auth:sso')->controller(DroneCameraReportController::class)->prefix('DroneCameraReport')->group(function () {
    Route::get('index', 'index');
    Route::get('listCompany', 'listCompany');
    Route::get('monthlyCompanyStats', 'monthlyCompanyStats');
    Route::get('generate-report', 'gen_excel_report');
});
