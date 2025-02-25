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

        $phone = '6' . $this->faker->numberBetween(10000000, 99999999);

        return [
            'NIF' => $nif,
            'name' => $this->faker->company,
            'name_contact' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'),
            'address' => $this->faker->address,
            'phone' => $phone,
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
