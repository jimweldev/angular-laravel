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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('email')->unique();
            $table->string('alternate_email')->default('');
            $table->integer('login_attempts')->default(0);
            $table->string('otp_code')->default('');
            $table->string('last_name')->default('');
            $table->string('first_name')->default('');
            $table->string('middle_name')->default('');
            $table->string('position')->default('');
            $table->string('photo_url')->default('');
            $table->boolean('is_admin')->default(0);
            $table->integer('created_by')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
