<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WineType;

class WineTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $type_wines = [
            [
                'name' => 'Negre',
                'description' => 'Vino tinto',
            ],
            [
                'name' => 'Blanc',
                'description' => 'Vino blanco',
            ],
            [
                'name' => 'Rossat',
                'description' => 'Vino rosado',
            ],
            [
                'name' => 'Espumós',
                'description' => 'Vino espumoso',
            ],
            [
                'name' => 'Dolç',
                'description' => 'Vino dulce',
            ]
        ];

        foreach ($type_wines as $type_wine) {
            WineType::updateOrCreate(
                [
                    'name' => $type_wine['name'],
                    'description' => $type_wine['description'],
                ]
            );
        }
    }
}
