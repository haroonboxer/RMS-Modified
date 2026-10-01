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
        Schema::create('drone_camera_licenses', function (Blueprint $table) {
            $table->id();
            $table->enum('license_type', ['new', 'extend', 'renew']);
            $table->string('hanging_date');
            $table->string('bank_account_number');
            $table->string('issue_date');
            $table->string('validity_date');
            $table->string('fee');
            $table->string('drone_model');
            $table->string('drone_sn');
            $table->string('sn')->nullable();
            $table->string('reject_reason')->nullable();
            $table->integer('status')->default(0);
            $table->integer('printed')->default(0);
            $table->foreignId('personnel_id')->references("id")->on("personnel_drone_cameras")->nullable();
            $table->foreignId('company_id')->references("id")->on("drone_camera_companies")->nullable();
            $table->foreignId('created_by')->references("id")->on("users");
            $table->foreignId('created_department')->references('id')->on('departments');
            $table->foreignId('created_location')->references("id")->on("provinces");
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drone_camera_licenses');
    }
};
