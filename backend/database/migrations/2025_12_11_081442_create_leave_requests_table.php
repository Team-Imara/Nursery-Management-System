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
    Schema::create('leave_requests', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
        $table->date('from_date');
        $table->date('to_date');
        $table->text('reason');
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->foreignId('approved_by')->nullable()->constrained('users');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests'); 
    }
};
