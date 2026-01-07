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
    Schema::create('meal_plans', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->foreignId('class_id')->constrained()->cascadeOnDelete();
        $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
        $table->string('meal_type');
        $table->text('menu');
        $table->text('ingredients');
        $table->boolean('is_suitable_prediction')->default(true);
        $table->text('prediction_notes')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_plans');
    }
};
