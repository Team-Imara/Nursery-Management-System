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
        Schema::table('classes', function (Blueprint $table) {
            $table->json('sections')->nullable()->after('classname');
            $table->foreignId('class_incharge_id')->nullable()->after('head_teacher_id')->constrained('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['class_incharge_id']);
            $table->dropColumn(['sections', 'class_incharge_id']);
        });
    }
};
