<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
    Schema::create('observations', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->foreignId('student_id')->constrained()->cascadeOnDelete();
        $table->date('date');
        $table->string('mood')->nullable();
        $table->string('social_interaction')->nullable();
        $table->string('attention_span')->nullable();
        $table->string('language_development')->nullable();
        $table->string('motor_skills')->nullable();
        $table->text('health_observation')->nullable();
        $table->text('teacher_comments')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('observations');   
    }
};
