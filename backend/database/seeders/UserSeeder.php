<?php

namespace Database\Seeders;

use App\Models\Investor;
use App\Models\Seller;
use App\Models\Restaurant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario específico de prueba
        $testUser = User::factory()->create([
            'name' => 'Usuario de Prueba',
            'email' => 'prueba@gmail.com',
            'password' => Hash::make('1234'),
            'role' => 'seller',
        ]);

        // Asociar el usuario a su tabla correspondiente según el rol
        switch ($testUser->role) {
            case 'seller':
                Seller::factory()->create(['user_id' => $testUser->id]);
                break;
            case 'investor':
                Investor::factory()->create(['user_id' => $testUser->id]);
                break;
            case 'restaurant':
                Restaurant::factory()->create(['user_id' => $testUser->id]);
                break;
        }

        // Crear usuarios aleatorios
        Investor::factory()->count(10)->create();
        Seller::factory()->count(9)->create();
        Restaurant::factory()->count(10)->create();
    }
}
