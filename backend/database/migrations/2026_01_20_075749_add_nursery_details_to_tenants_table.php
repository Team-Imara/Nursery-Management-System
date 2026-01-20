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
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('nursery_name')->nullable();
            $table->string('nursery_logo')->nullable();
            $table->string('nursery_address')->nullable();
            $table->string('nursery_contact')->nullable();
            $table->string('nursery_email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['nursery_name', 'nursery_logo', 'nursery_address', 'nursery_contact', 'nursery_email']);
        });
    }
};
