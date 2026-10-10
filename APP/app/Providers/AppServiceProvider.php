<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Auth\JwtGuard;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Add additional migration paths
        $this->loadMigrationsFrom([
            database_path('migrations'),
            database_path('migrations/auth_sys'),
            database_path('migrations/rms'),
            database_path('migrations/workshop'),
            database_path('migrations/drone'),
            database_path('migrations/k9'),
            database_path('migrations/gpsCompany'),
            //new migration Path
            database_path('migrations/rms/rmsModified'),
            database_path('migrations/workshop/workshopNewMigration'),
            database_path('migrations/drone/DroppingTheRelationshipMigration'),
            database_path('migrations/k9/k9_New_Migration'),
            database_path('migrations/gpsCompany/gpsCompanyNewMigration'),
            // Add more paths as needed
        ]);
        Auth::extend('sso', function ($app, $name, array $config) {
            // logger()->info('Creating JwtGuard');
            return new JwtGuard();
        });
    }
}
