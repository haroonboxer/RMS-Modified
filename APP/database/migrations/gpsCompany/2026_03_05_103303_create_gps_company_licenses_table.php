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
        Schema::create('gps_company_licenses', function (Blueprint $table) {
            $table->id();
            $table->enum('license_type', ['new', 'extend', 'renew']);
            $table->string('hanging_date');
            $table->string('bank_account_number');
            $table->string('issue_date');
            $table->string('validity_date');
            $table->integer('activity_type')->nullable();
            // $table->enum('activity_type', ['central_license', 'agency_license'])->default('central_license');
            $table->string('fee');
            $table->string('sn')->nullable();
            $table->string('reject_reason')->nullable();
            $table->integer('status')->default(0);
            $table->integer('printed')->default(0);
            $table->foreignId('company_id')->references("id")->on("gps_companies");
            $table->string('agency_id')->nullable();
            $table->foreignId('created_by')->references("id")->on("users");
            $table->foreignId('created_department')->references('id')->on('departments');
            $table->foreignId('created_location')->references("id")->on("provinces");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gps_company_licenses');
    }
};
