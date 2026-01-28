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
        Schema::table('students', function (Blueprint $table) {
            $table->string('name_with_initials')->after('fullname')->nullable();
            $table->string('calling_name')->after('name_with_initials')->nullable();
            
            $table->string('whatsapp_number')->after('father_nic')->nullable();
            $table->enum('guardian_type', ['father', 'mother', 'others'])->after('whatsapp_number')->default('father');
            $table->text('guardian_address')->after('guardian_nic')->nullable();

            $table->string('section')->after('class_id')->nullable();
            $table->string('end_year')->after('academic_year')->nullable();
            $table->date('enrollment_date')->after('end_year')->nullable();

            $table->string('assessment_reading')->nullable();
            $table->string('assessment_writing')->nullable();
            $table->string('assessment_numbers')->nullable();
            $table->string('assessment_language_tamil')->nullable();
            $table->string('assessment_language_english')->nullable();
            $table->string('assessment_language_sinhala')->nullable();
            $table->string('assessment_drawing')->nullable();
            $table->text('assessment_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'name_with_initials',
                'calling_name',
                'whatsapp_number',
                'guardian_type',
                'guardian_address',
                'section',
                'end_year',
                'enrollment_date',
                'assessment_reading',
                'assessment_writing',
                'assessment_numbers',
                'assessment_language_tamil',
                'assessment_language_english',
                'assessment_language_sinhala',
                'assessment_drawing',
                'assessment_notes',
            ]);
        });
    }
};
