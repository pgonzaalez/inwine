<?php

namespace Database\Seeders;

use App\Models\Investor;
use App\Models\Seller;
use App\Models\Restaurant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;



class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear carpeta 'proba' si no existe
        if (!Storage::disk('public')->exists('proba')) {
            Storage::disk('public')->makeDirectory('proba');
        }

        // Copiar imágenes al almacenamiento
        $images = [
            'caja-de-vino-tinto-toro-vinas-elias-mora-6-botellas.jpg',
            'botella-rioja-enamorados.jpg',
            'Botella-vino.jpeg',
            'louis.jpg',
            'palacio.jpg',
        ];

        foreach ($images as $image) {
            $sourcePath = resource_path("images/$image");
            $destinationPath = "proba/$image";

            if (file_exists($sourcePath)) {
                Storage::disk('public')->put($destinationPath, file_get_contents($sourcePath));
            }
        }

        // Crear usuario específico de prueba (Seller)
        $testSeller = User::factory()->create([
            'name' => 'Bodega de Proba',
            'email' => 'bodega@gmail.com',
            'password' => Hash::make('1234'),
        ]);

        // Asignar rol de seller
        UserRole::create([
            'user_id' => $testSeller->id,
            'role' => 'seller'
        ]);

        // Asignar rol de restaurant
        UserRole::create([
            'user_id' => $testSeller->id,
            'role' => 'restaurant'
        ]);

        // Crear usuario específico de prueba (Restaurant)
        $testRestaurant = User::factory()->create([
            'name' => 'Restaurante de Prueba',
            'email' => 'restaurant@gmail.com', // Corregido el punto
            'password' => Hash::make('1234'),
        ]);

        // Asignar rol de restaurant
        UserRole::create([
            'user_id' => $testRestaurant->id,
            'role' => 'restaurant'
        ]);

        $testInvestor = User::factory()->create([
            'name' => 'Inversor de Prueba',
            'email' => 'inversor@gmail.com',
            'password' => Hash::make('1234'),
        ]);

        $testInvestor2 = User::factory()->create([
            'name' => 'Inversor de Prueba',
            'email' => 'inversor2@gmail.com',
            'password' => Hash::make('1234'),
        ]);

        // Asignar rol de investor
        UserRole::create([
            'user_id' => $testInvestor->id,
            'role' => 'investor'
        ]);

        //Crear usuario admin (Pol)
        $admin = User::factory()->create([
            'name' => 'Pol Santandreu',
            'email' => 'polsantandreu@gmail.com',
            'password' => Hash::make('1234'),
        ]);

        //Asignamos todos los roles
        UserRole::create([
            'user_id' => $admin->id,
            'role' => 'seller'
        ]);

        UserRole::create([
            'user_id' => $admin->id,
            'role' => 'restaurant'
        ]);

        UserRole::create([
            'user_id' => $admin->id,
            'role' => 'investor'
        ]);

        function createProfiles(User $user, string $role): void
        {
            switch ($role) {
                case 'seller':
                    Seller::factory()->create(['user_id' => $user->id]);
                    break;
                case 'restaurant':
                    Restaurant::factory()->create(['user_id' => $user->id]);
                    break;
                case 'investor':
                    Investor::factory()->create(['user_id' => $user->id]);
                    break;
            }
        }

        // Crear perfiles usando factories
        createProfiles($testSeller, 'seller');
        createProfiles($testSeller, 'restaurant');
        createProfiles($testRestaurant, 'restaurant');
        createProfiles($testInvestor, 'investor');
        createProfiles($testInvestor2, 'investor');
        createProfiles($admin, 'seller');
        createProfiles($admin, 'restaurant');
        createProfiles($admin, 'investor');

        // // Crear usuarios aleatorios
        Investor::factory()->count(5)->create();
        Seller::factory()->count(5)->create();
        Restaurant::factory()->count(5)->create();
    }
}
