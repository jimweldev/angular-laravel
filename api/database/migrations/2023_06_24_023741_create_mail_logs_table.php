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
        Schema::create('mail_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient');
            $table->string('recipient_email');
            $table->string('sender');
            $table->string('sender_email');
            $table->string('subject');
            $table->string('link')->nullable();
            $table->boolean('is_sent')->default(0);
            $table->boolean('is_opened')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mail_logs');
    }
};
