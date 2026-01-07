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
    Schema::create('attendances', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->foreignId('student_id')->constrained()->cascadeOnDelete();
        $table->foreignId('class_id')->constrained()->cascadeOnDelete();
        $table->date('attendance_date');
        $table->enum('status', ['present', 'absent', 'late']);
        $table->foreignId('marked_by')->constrained('users');
        $table->text('notes')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
