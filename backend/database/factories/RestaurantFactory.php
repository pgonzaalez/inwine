<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Restaurant>
 */
class RestaurantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $numbers = $this->faker->numberBetween(10000000, 99999999);
        $letter = $this->calculateNIFLetter($numbers);
        $nif = $numbers . $letter;

        return [
            'NIF' => $nif,
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'),
            'address' => $this->faker->address,
            // 'phone' => $this->faker->phoneNumber,
            'credit_card' => $this->faker->creditCardNumber,
            'bank_account' => $this->faker->bankAccountNumber,
            'balance' => $this->faker->numberBetween(1000, 100000),
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
