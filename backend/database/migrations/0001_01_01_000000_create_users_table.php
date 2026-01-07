<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // create_users_table.php (updated)
public function up(): void {
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->string('fullname');
        $table->date('dob')->nullable();
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->enum('role', ['admin', 'teacher']);
        $table->string('phone')->nullable();
        $table->string('address')->nullable();
        $table->string('nic')->nullable();
        $table->string('emergency_contact_name')->nullable();
        $table->string('emergency_contact_phone')->nullable();
        $table->string('teaching_subject')->nullable();
        $table->decimal('basic_salary', 10, 2)->nullable();
        $table->date('join_date')->nullable();
        $table->string('qualification')->nullable();
        $table->integer('experience')->nullable();
        $table->string('profile_photo')->nullable();
        $table->rememberToken();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
