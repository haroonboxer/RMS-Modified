
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Remove existing foreign key constraints.
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['created_department']);
            $table->dropForeign(['created_location']);
        });

        // Step 2: Convert existing columns to strings.
        Schema::table('contracts', function (Blueprint $table) {
            $table->string('created_by')->change();
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
        Schema::dropIfExists('contracts');
    }
};
