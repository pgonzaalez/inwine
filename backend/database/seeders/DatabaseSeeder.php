<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WineType;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        if ($this->command->confirm('Vols refrescar la base de dades?', true)) {
            $this->command->call('migrate:fresh');

            // Elimina el directorio 'products' del disco 'public' y lo vuelve a crear
            Storage::disk('public')->deleteDirectory('products');
            Storage::disk('public')->makeDirectory('products');

            $this->command->info("S'ha eliminat el directori 'products' del disc 'public'");
            $this->command->info("S'ha reconstruït la base de dades");
        }

        $this->command->info('Base de dades inicialitzada amb exit.');

        $this->call([
            WineTypeSeeder::class,
            UserSeeder::class,
        ]);
    }
}
