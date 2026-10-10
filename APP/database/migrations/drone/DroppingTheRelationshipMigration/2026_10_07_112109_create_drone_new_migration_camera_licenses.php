<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        Schema::table('drone_camera_licenses', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['created_department']);
            $table->dropForeign(['created_location']);

        });
        Schema::table('drone_camera_licenses',function(Blueprint $table){
            $table->string('created_by')->change();
            $table->string('created_department')->change();
            $table->string('created_location')->change();
            $table->string('created_by_name')->nullabe();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drone_new_migration_camera_licenses');
    }
};
