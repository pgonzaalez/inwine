<?php

namespace Database\Seeders;

use App\Models\Investor;
use App\Models\Seller;
use App\Models\Restaurant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
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

        // Crear productos de prueba
        $product = Product::factory()->create([
            'name' => 'Vi Criança',
            'origin' => 'Catalunya',
            'year' => 2020,
            'wine_type_id' => 1,
            'description' => 'Vi de prova per a la prova',
            'price_demanded' => 1000,
            'quantity' => 1,
            'image' => '/storage/proba/caja-de-vino-tinto-toro-vinas-elias-mora-6-botellas.jpg',
            'user_id' => Seller::first()->id,
        ]);

        $product2 = Product::factory()->create([
            'name' => 'Vi i sen va ',
            'origin' => 'Madrid',
            'year' => 2018,
            'wine_type_id' => 2,
            'description' => 'Vi de prova per a la prova',
            'price_demanded' => 100,
            'quantity' => 1,
            'image' => '/storage/proba/botella-rioja-enamorados.jpg',
            'user_id' => Seller::first()->id,
        ]);

        $product3 = Product::factory()->create([
            'name' => 'Vi no vi',
            'origin' => 'França',
            'year' => 2017,
            'wine_type_id' => 3,
            'description' => 'Vi de prova per a la prova',
            'price_demanded' => 9900,
            'quantity' => 1,
            'image' => '/storage/proba/Botella-vino.jpeg',
           'user_id' => Seller::first()->id,
        ]);

        // Crear usuarios aleatorios
        Investor::factory()->count(10)->create();
        Seller::factory()->count(9)->create();
        Restaurant::factory()->count(10)->create();
    }
}
