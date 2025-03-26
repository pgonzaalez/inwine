<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RequestRestaurant;

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
                'price_restaurant' => 100,
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
    }
}
