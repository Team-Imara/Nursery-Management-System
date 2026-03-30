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
        Schema::create('interactive_calendar_events', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->string('title');
            $table->date('date');
            $table->time('time')->nullable();
            $table->text('description')->nullable();
            $table->string('venue')->nullable();
            $table->string('type'); // 'holiday' or 'special'
            $table->string('audience'); // 'all' or specific 'class_id'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interactive_calendar_events');
    }
};
