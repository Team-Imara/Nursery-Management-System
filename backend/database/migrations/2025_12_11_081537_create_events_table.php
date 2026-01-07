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
    Schema::create('events', function (Blueprint $table) {
        $table->id();
        $table->uuid('tenant_id')->index();
        $table->string('title');
        $table->text('description');
        $table->date('date');
        $table->time('time')->nullable();
        $table->string('venue')->nullable();
        $table->enum('type', ['parent_meeting', 'cultural_program', 'concert', 'holiday', 'other']);
        $table->timestamps();
        $table->softDeletes();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events'); 
    }
};
