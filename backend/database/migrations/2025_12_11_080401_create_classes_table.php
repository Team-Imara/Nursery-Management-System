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
    Schema::create('classes', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->string('classname');
        $table->integer('capacity');
        $table->integer('total_students')->default(0);
        $table->foreignId('head_teacher_id')->constrained('users')->cascadeOnDelete();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          Schema::dropIfExists('classes');
    }
};
