<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RequestRestaurant;
use App\Models\Product;
use App\Models\Request;
use Illuminate\Support\Facades\DB;

class RequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $requests = [
            [
                'user_id' => 2,
                'product_id' => 1,
                'quantity' => 1,
                'price_restaurant' => 1500,
            ]
        ];

        foreach ($requests as $request) {
            RequestRestaurant::updateOrCreate(
                [
                    'user_id' => $request['user_id'],
                    'product_id' => $request['product_id'],
                ],
                [
                    'quantity' => $request['quantity'],
                    'price_restaurant' => $request['price_restaurant'],
                ]
            );
        }

        DB::beginTransaction();
        try {
            // 1) Crear un producto en estado 'in_stock'
            $product = Product::factory()->create([
                'name' => 'Producto de prueba',
                'user_id' => 1,
                'status' => 'in_stock'
            ]);

            // 2) Crear una solicitud de restaurante en estado 'pending'
            $restaurantRequest = RequestRestaurant::updateOrCreate(
                [
                    'user_id' => 2,
                    'product_id' => $product->id,
                ],
                [
                    'quantity' => 1,
                    'price_restaurant' => 10,
                    'status' => 'pending'
                ]
            );

            // 3) Crear una solicitud de inversor en estado 'paid'
            Request::create([
                'user_id' => 3,
                'request_restaurant_id' => $restaurantRequest->id,
                'quantity' => 1,
                'status' => 'paid'
            ]);

            // 4) Actualizar estados
            $product->update(['status' => 'requested']);
            $restaurantRequest->update(['status' => 'accepted']);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
