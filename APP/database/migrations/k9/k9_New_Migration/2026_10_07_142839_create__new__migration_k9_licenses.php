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
        Schema::table('k9_licenses', function (Blueprint $table) {
            $table->dropForeign('created_by')->references("id")->on("users");
            $table->dropForeign('updated_by')->nullable();
            $table->dropForeign('created_department')->references('id')->on('departments');
            $table->dropForeign('created_location')->references("id")->on("provinces");
        });

          Schema::table('k9_licenses', function (Blueprint $table) {
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->string('created_department');
            $table->string('created_location');


            $table->string('created_by')->nullable();
          

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_new__migration_k9_licenses');
    }
};
