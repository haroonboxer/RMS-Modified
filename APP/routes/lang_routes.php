<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LanguageController;

Route::middleware(['middleware' => 'auth'])->controller(LanguageController::class)->group(function () {
    Route::get('/language/{locale}', 'changeLanguage')->name('language');
});