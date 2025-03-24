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
                'image' => 'https://www.elpationeiva.co/wp-content/uploads/2021/06/COPA-DE-VINO.jpg'
            ],
            [
                'name' => 'Blanc',
                'description' => 'Vino blanco',
                'image' => 'https://www.blasbermejo.com/wp-content/uploads/2023/06/tipos-vino-blanco.webp'
            ],
            [
                'name' => 'Rossat',
                'description' => 'Vino rosado',
                'image' => 'https://s1.elespanol.com/2024/06/13/cocinillas/vinos/862673986_243984786_1706x1280.jpg'
            ],
            [
                'name' => 'Espumós',
                'description' => 'Vino espumoso',
                'image' => 'https://media.scoolinary.app/blog/images/2022/05/como-servir-un-vino-espumoso.jpg'
            ],
            [
                'name' => 'Dolç',
                'description' => 'Vino dulce',
                'image' => 'https://us.123rf.com/450wm/serezniy/serezniy1411/serezniy141101636/33498791-vino-que-vierte-en-la-copa-de-vino-primer-plano.jpg'
            ]
        ];

        foreach ($type_wines as $type_wine) {
            WineType::updateOrCreate(
                [
                    'name' => $type_wine['name'],
                    'description' => $type_wine['description'],
                    'image' => $type_wine['image']
                ]
            );
        }
    }
}
