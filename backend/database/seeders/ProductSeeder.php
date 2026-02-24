<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Copiar imágenes desde resources/images a storage/app/public/proba
        $images = [
            'caja-de-vino-tinto-toro-vinas-elias-mora-6-botellas.jpg',
            'botella-rioja-enamorados.jpg',
            'Botella-vino.jpeg',
            'louis.jpg',
            'palacio.jpg'
        ];

        foreach ($images as $image) {
            $sourcePath = resource_path("images/{$image}");
            $destinationPath = "proba/{$image}";

            if (File::exists($sourcePath)) {
                Storage::disk('public')->put($destinationPath, File::get($sourcePath));
            } else {
                echo "⚠️  No se encontró la imagen: {$image}\n";
            }
        }

        $products = [
            [
                'name' => 'Vi Criança',
                'origin' => 'Catalunya',
                'year' => 2020,
                'wine_type_id' => 1,
                'description' => 'Vi de prova per a la prova',
                'price_demanded' => 45,
                'quantity' => 1,
                'image' => '/storage/proba/caja-de-vino-tinto-toro-vinas-elias-mora-6-botellas.jpg',
            ],
            [
                'name' => 'Vi i sen va',
                'origin' => 'Madrid',
                'year' => 2018,
                'wine_type_id' => 2,
                'description' => 'Vi de prova per a la prova',
                'price_demanded' => 100,
                'quantity' => 1,
                'image' => '/storage/proba/botella-rioja-enamorados.jpg',
            ],
            [
                'name' => 'Vi no vi',
                'origin' => 'França',
                'year' => 2017,
                'wine_type_id' => 3,
                'description' => 'Vi de prova per a la prova',
                'price_demanded' => 25,
                'quantity' => 1,
                'image' => '/storage/proba/Botella-vino.jpeg',
            ],
            [
                'name' => 'Louis Latour ',
                'origin' => 'França',
                'year' => 2023,
                'wine_type_id' => 2,
                'description' => 'Vi de prova per a la prova',
                'price_demanded' => 100,
                'quantity' => 1,
                'image' => '/storage/proba/louis.jpg',
            ],
            [
                'name' => 'Palacio de Bornos',
                'origin' => 'Rueda',
                'year' => 2023,
                'wine_type_id' => 1,
                'description' => 'Vi de prova per a la prova',
                'price_demanded' => 100,
                'quantity' => 1,
                'image' => '/storage/proba/palacio.jpg',
            ],
        ];

        foreach ($products as $index => $product) {
            $createdProduct = Product::factory()->create(array_merge($product, [
                'user_id' => 1,
            ]));

            ProductImage::create([
                'product_id' => $createdProduct->id,
                'image_path' => $product['image'],
                'is_primary' => true,
                'order' => 0
            ]);
        }
    }
}
