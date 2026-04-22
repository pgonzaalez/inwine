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
        $phone = '6' . $this->faker->numberBetween(10000000, 99999999);

        return [
            'user_id' => User::factory(),
            'address' => $this->faker->address,
            'phone_contact' => $phone,
            'name_contact' => $this->faker->name,
            'credit_card' => $this->faker->creditCardNumber,
            'balance' => $this->faker->randomFloat(2, 0, 100000),
            'business_name' => $this->faker->company() . ' Restaurant',
            'province' => $this->faker->randomElement(['Barcelona', 'Girona', 'Lleida', 'Tarragona']),
            'description' => $this->faker->sentence(10),
            'number_of_diners' => $this->faker->numberBetween(1, 120),
            'wine_rotation' => $this->faker->randomElement(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
        ];
    }
}
