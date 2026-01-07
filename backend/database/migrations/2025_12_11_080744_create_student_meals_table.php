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
    Schema::create('student_meals', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->foreignId('student_id')->constrained()->cascadeOnDelete();
        $table->foreignId('meal_plan_id')->constrained()->cascadeOnDelete();
        $table->foreignId('class_id')->constrained()->cascadeOnDelete();
        $table->date('date');
        $table->string('status')->nullable();
        $table->text('notes')->nullable();
        $table->boolean('suitable')->default(true);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_meals');
    }
};
