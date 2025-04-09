<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

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
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('1234'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
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
