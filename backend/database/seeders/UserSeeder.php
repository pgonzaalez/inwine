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

        // Crear usuarios aleatorios
        Investor::factory()->count(20)->create();
        Seller::factory()->count(20)->create();
        Restaurant::factory()->count(6)->create();

        //Crear más usuarios de restaurantes ficticios
        $sampleRestaurant1 = User::factory()->create([
            'password' => Hash::make('1234'),
        ]);
        Restaurant::factory()->create([
            'user_id' => $sampleRestaurant1->id,
            'business_name' => 'Ca l\'Isidre',
            'province' => 'Barcelona',
            'image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
            'description' => 'Restaurant d\'alta cuina catalana amb més de 50 anys d\'història',
        ]);

        $sampleRestaurant2 = User::factory()->create([
            'password' => Hash::make('1234'),
        ]);
        Restaurant::factory()->create([
            'user_id' => $sampleRestaurant2->id,
            'business_name' => 'Botafumeiro',
            'province' => 'Barcelona',
            'image' => 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
            'description' => 'Restaurant especialitzat en peix i marisc de primera qualitat',
        ]);

        $sampleRestaurant3 = User::factory()->create([
            'password' => Hash::make('1234'),
        ]);
        Restaurant::factory()->create([
            'user_id' => $sampleRestaurant3->id,
            'business_name' => 'El Celler de Can Roca',
            'province' => 'Girona',
            'image' => 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
            'description' => 'Restaurant amb tres estrelles Michelin, referent de la gastronomia catalana',
        ]);

        $sampleRestaurant4 = User::factory()->create([
            'password' => Hash::make('1234'),
        ]);
        Restaurant::factory()->create([
            'user_id' => $sampleRestaurant4->id,
            'business_name' => 'Can Jubany',
            'province' => 'Vic',
            'image' => 'https://images.unsplash.com/photo-1515669097368-22e68427d265',
            'description' => 'Restaurant amb una estrella Michelin, cuina d\'autor amb arrels tradicionals',
        ]);

        $sampleRestaurant5 = User::factory()->create([
            'password' => Hash::make('1234'),
        ]);
        Restaurant::factory()->create([
            'user_id' => $sampleRestaurant5->id,
            'business_name' => 'Via Veneto',
            'province' => 'Barcelona',
            'image' => 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c',
            'description' => 'Restaurant clàssic amb una estrella Michelin, referent de la cuina mediterrània',
        ]);

        $sampleRestaurant6 = User::factory()->create([
            'password' => Hash::make('1234'),
        ]);
        Restaurant::factory()->create([
            'user_id' => $sampleRestaurant6->id,
            'business_name' => 'Les Cols',
            'province' => 'Girona',
            'image' => 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
            'description' => 'Restaurant amb dues estrelles Michelin, cuina d\'avantguarda amb producte local',
        ]);
    }
}
