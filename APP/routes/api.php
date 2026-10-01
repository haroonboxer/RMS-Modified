<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\DirectorateController;
use App\Http\Controllers\rms\PrintedCardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->controller(AuthController::class)->group(function () {
    Route::post('verify_user', 'verify_user');
});

// Route::post('login', [AuthController::class, 'login']);
// web.php or api.php (make sure this is accessible via GET)
Route::get('printed_card/view/{id}', [PrintedCardController::class, 'generateIDCard']);

Route::middleware('auth:sanctum')->group(function () {
    require('user_routes.php');
    require('administration.php');

    //-------------------------------------------------------------------------------------- RMS Routes --------------------------------------------------------------------------------------

    require __DIR__ . '/rms/company_routes.php';
    require __DIR__ . '/rms/boss_routes.php';
    require __DIR__ . '/rms/assistant_route.php';
    require __DIR__ . '/rms/employee_route.php';
    require __DIR__ . '/rms/weapon.php';
    require __DIR__ . '/rms/license_route.php';
    require __DIR__ . '/rms/gun_route.php';
    require __DIR__ . '/rms/contracts_route.php';
    require __DIR__ . '/rms/vehicals_route.php';
    require __DIR__ . '/rms/printed_card_route.php';
    require __DIR__ . '/rms/reports_routes.php';

    //-------------------------------------------------------------------------------------- Workshop Routes --------------------------------------------------------------------------------------

    require __DIR__ . '/workshop/workshopCompany_routes.php';
    require __DIR__ . '/workshop/workshopAssistant_routes.php';
    require __DIR__ . '/workshop/workshop_boss_routes.php';
    require __DIR__ . '/workshop/workshop_license_route.php';
    require __DIR__ . '/workshop/workshop_report_routes.php';
    require __DIR__ . '/workshop/card_print_route.php';

    //-------------------------------------------------------------------------------------- K9 Routes --------------------------------------------------------------------------------------

    require __DIR__ . '/k9/k9_company_routes.php';
    require __DIR__ . '/k9/k9_assistant_routes.php';
    require __DIR__ . '/k9/k9_boss_routes.php';
    require __DIR__ . '/k9/k9_license_routes.php';
    require __DIR__ . '/k9/k9_report_routes.php';
    require __DIR__ . '/k9/k9_card_print_routes.php';


    //-------------------------------------------------------------------------------------- Drone Camera Routes --------------------------------------------------------------------------------------

    require __DIR__ . '/drone/drone_camera_company_routes.php';
    require __DIR__ . '/drone/drone_camera_assistant_routes.php';
    require __DIR__ . '/drone/drone_camera_boss_routes.php';
    require __DIR__ . '/drone/drone_camera_license_route.php';
    require __DIR__ . '/drone/drone_camera_report_routes.php';
    require __DIR__ . '/drone/drone_camera_card_print_route.php';
    require __DIR__ . '/drone/peronnel_drone_camera_routes.php';
    require __DIR__ . '/drone/personel_drone_camera_card_print_route.php';

    //-------------------------------------------------------------------------------------- GPS Camera Routes --------------------------------------------------------------------------------------

    require __DIR__ . '/gpsCompany/gps_companies_routes.php';
    require __DIR__ . '/gpsCompany/gps_company_boss.php';
    require __DIR__ . '/gpsCompany/gps_company_assistant_routes.php';
    require __DIR__ . '/gpsCompany/gps_company_license_route.php';
    require __DIR__ . '/gpsCompany/gps_company_printed_card_routes.php';
    require __DIR__ . '/gpsCompany/gps_company_report_routes.php';
    require __DIR__ . '/gpsCompany/gps_company_agency.php';
});
