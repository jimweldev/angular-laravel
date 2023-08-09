<?php

namespace Database\Seeders;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // php artisan db:seed --class=DatabaseSeeder

        User::create([
            'username' => 'admin@connextglobal.com',
            'password' => bcrypt('admin_password'),
            'email' => 'admin@connextglobal.com',
            'last_name' => 'Admin',
            'first_name' => 'Connext',
            'middle_name' => '',
            'is_admin' => true,
            'created_by' => 1,
        ]);
    }
}
