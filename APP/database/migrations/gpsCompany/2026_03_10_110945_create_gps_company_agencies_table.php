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
        Schema::create('gps_company_agencies', function (Blueprint $table) {
            $table->id();
            $table->string('name_dr')->nullable();;
            $table->string('name_pa')->nullable();;
            $table->string('name_en')->nullable();;
            $table->integer('main_province')->nullable();
            $table->integer('main_district')->nullable();
            $table->string('main_village')->nullable();
            $table->integer('current_province')->nullable();
            $table->integer('current_district')->nullable();
            $table->string('current_village')->nullable();
            $table->text('reason_dismissed')->nullable();
            $table->integer('status')->default(1);
            $table->string('agency_manager')->nullable();
            $table->string('phone')->nullable();
            $table->string('photo')->nullable();
            $table->foreignId('company_id')->references("id")->on("gps_companies");
            $table->foreignId('created_by')->references("id")->on("users");
            $table->foreignId('created_department')->references('id')->on('departments');
            $table->foreignId('created_location')->references("id")->on("provinces");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gps_company_agencies');
    }
};
