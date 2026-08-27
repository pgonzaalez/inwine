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
        $commissions = [
            ["name" => "Comissió pel producte", "percentage" => 10.00],
            ["name" => "Comissió pel restaurant", "percentage" => 5.00],
            ["name" => "Comissió per l'inversor", "percentage" => 5.00],
        ];

        foreach ($commissions as $commission) {
            Commission::create($commission);
        }
    }
}
