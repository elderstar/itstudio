<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SpecialistTagSeeder::class,
        ]);

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@codenebula.local'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );
        $admin->assignRole('admin');

        $client = User::query()->firstOrCreate(
            ['email' => 'client@codenebula.local'],
            [
                'name' => 'Demo Client',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );
        $client->assignRole('client');
    }
}
