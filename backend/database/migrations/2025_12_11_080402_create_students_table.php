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
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->string('fullname');
        $table->date('dob');
        $table->enum('gender', ['male', 'female', 'other'])->nullable();
        $table->string('address')->nullable();
        $table->string('academic_year');
        $table->string('religion')->nullable();
        $table->text('uniform_details')->nullable();
        $table->text('favourite_toys')->nullable();
        $table->string('first_language')->nullable();
        $table->foreignId('class_id')->constrained()->cascadeOnDelete();
        $table->string('mother_name')->nullable();
        $table->string('mother_contact')->nullable();
        $table->string('mother_occupation')->nullable();
        $table->string('mother_nic')->nullable();
        $table->string('father_name')->nullable();
        $table->string('father_contact')->nullable();
        $table->string('father_occupation')->nullable();
        $table->string('father_nic')->nullable();
        $table->string('guardian_name')->nullable();
        $table->string('guardian_contact')->nullable();
        $table->string('guardian_occupation')->nullable();
        $table->string('guardian_nic')->nullable();
        $table->string('emergency_contact_name')->nullable();
        $table->string('emergency_contact_phone')->nullable();
        $table->text('allergies')->nullable();
        $table->decimal('height', 5, 2)->nullable();
        $table->decimal('weight', 5, 2)->nullable();
        $table->text('special_needs')->nullable();
        $table->text('health_notes')->nullable();
        $table->timestamps();
        $table->softDeletes();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
