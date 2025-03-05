<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

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

        return [
            'user_id' => User::factory()->state([
                'role' => 'seller',
                'name' => $this->faker->company // Asegurar que sea una empresa
            ]),
            'name_contact' => $this->faker->name,
            'credit_card' => $this->faker->creditCardNumber,
            'balance' => $this->faker->randomFloat(2, 0, 100000),
        ];
    }
}
