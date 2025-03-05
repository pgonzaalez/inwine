<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Seller>
 */
class SellerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'seller']),
            'name_contact' => $this->faker->name,
            'credit_card' => $this->faker->creditCardNumber,
            'balance' => $this->faker->randomFloat(2, 0, 100000),
        ];
    }

    /**
     * Calcula la letra del NIF a partir de los 8 números.
     *
     * @param int $numbers Los 8 números del NIF.
     * @return string La letra correspondiente.
     */
    private function calculateNIFLetter($numbers)
    {
        $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        $index = $numbers % 23;
        return $letters[$index];
    }
}
