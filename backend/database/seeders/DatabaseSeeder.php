<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WineType;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        if ($this->command->confirm('Vols refrescar la base de dades?', true)) {
            $this->command->call('migrate:fresh');
            $this->command->info("S'ha reconstruït la base de dades");
        }

        $this->command->info('Base de dades inicialitzada amb exit.');

        $this->call([
            WineTypeSeeder::class,
            // SellerSeeder::class,
            // InvestorSeeder::class,
            UserSeeder::class,
            // RestaurantSeeder::class,
        ]);
    }
}
