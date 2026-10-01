<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\rms\PrintedCardController;
use App\Models\GpsCompany\GpsCompanyLicense;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return view('auth.login');
});

Route::post('/sso-login', [AuthController::class, 'ssoLogin']);

Route::get('/sso/token', [AuthController::class, 'getReactToken']);
// Route::get("/get_agency", function(){
//   $query = GpsCompanyLicense::select('
//   id',
//   'activity_type',
//   'company_id',
//   'agency_id'
//   )->get();

//   foreach($query as $item)
//     {
//       $item->agency_id = $query->activity_type ? $item->activity_type : 'central_license';
//       $item->update(); 
//     }
// });

Route::get('/get_agency', function () {
  $updated = DB::table('gps_company_licenses')
    ->whereNotNull('activity_type')
    ->update([
      'agency_id' => DB::raw('activity_type'),
    ]);

  return "{$updated} agency IDs updated successfully.";
});

Illuminate\Support\Facades\Auth::routes();
Route::middleware('auth')->group(function () {
  Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
  // web.php or api.php (make sure this is accessible via GET)
  Route::get('printed_card/view/{id}', [PrintedCardController::class, 'generateIDCard']);
});



