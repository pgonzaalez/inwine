<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Seller;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'origin' => $this->faker->word,
            'year' => $this->faker->numberBetween(1900, 2022),
            'wine_type_id' => $this->faker->numberBetween(1, 5),
            'description' => $this->faker->text,
            'price_demanded' => $this->faker->randomFloat(2, 0, 10000),
            'quantity' => $this->faker->numberBetween(1, 100),
            'image' => $this->faker->imageUrl(),
            'user_id' => Seller::factory(),
        ];
    }
}
