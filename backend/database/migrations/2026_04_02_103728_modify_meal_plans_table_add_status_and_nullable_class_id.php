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
        Schema::table('meal_plans', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable()->change();
            $table->string('status')->nullable()->after('menu'); // healthy, review, allergy
            $table->string('meal_name')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meal_plans', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable(false)->change();
            $table->dropColumn(['status', 'meal_name']);
        });
    }
};
