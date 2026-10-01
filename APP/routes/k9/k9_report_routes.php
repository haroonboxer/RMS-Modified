<?php

use App\Http\Controllers\k9\K9ReportController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->controller(K9ReportController::class)->prefix('k9-report')->group(function () {
    Route::get('index', 'index');
    Route::get('listCompany', 'listCompany');
    Route::get('monthlyCompanyStats', 'monthlyCompanyStats');
    Route::get('generate-report', 'gen_excel_report');
});
