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
            'wine_rotation' => $this->faker->randomElement(['Cada dia', '2 dies', 'Cada setmana', '4 dies', '3 dies']),
            'reference_number' => $this->faker->numberBetween(10, 45),
            'shifts' => $this->faker->randomElement([
                'mond_to_sund_lunch',
                'mond_to_sund_dinner',
                'mond_to_sund_lunch_and_dinner',
                'tues_to_sund_lunch',
                'tues_to_sund_dinner',
                'tues_to_sund_lunch_and_dinner',
                'frid_to_sund_lunch',
                'frid_to_sund_dinner',
                'frid_to_sund_lunch_and_dinner',
                'satu_and_sund_lunch',
                'satu_and_sund_dinner',
                'satu_and_sund_lunch_and_dinner']),
        ];
    }
}
