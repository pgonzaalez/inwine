<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Commission;

class CommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Commission::create([
            'percentage_to_seller' => 0.00,
            'percentage_to_restaurant' => 0.00,
            'percentage_to_investor' => 0.00,
        ]);
    }
}
