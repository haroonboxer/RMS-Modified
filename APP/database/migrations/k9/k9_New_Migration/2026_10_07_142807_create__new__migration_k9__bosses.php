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
        Schema::table('k9_bosses', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['created_department']);
            $table->dropForeign(['created_location']);
        });

        Schema::table('k9_bosses', function (Blueprint $table) 
        {
            $table->string('created_by')->change();
            $table->string('updated_by')->change()->nullable();
            $table->string('created_department')->change();
            $table->string('created_location')->change();

            $table->string('created_by_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_new__migration_k9__bosses');
    }
};
