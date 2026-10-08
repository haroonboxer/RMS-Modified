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
        Schema::table('bosses', function (Blueprint $table) {
            $table->dropForeign('created_by')->references("id")->on("users");
            $table->dropForeign('created_department')->references('id')->on('departments');
            $table->dropForeign('created_location')->references("id")->on("provinces");
        });

        Schema::table('bosses', function (Blueprint $table) {
            $table->string('created_by')->change();
            $table->string('created_department')->change();
            $table->string('created_location')->change();

            $table->string('created_by_name')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_new__migration_bosses');
    }
};
