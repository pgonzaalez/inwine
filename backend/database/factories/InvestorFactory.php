<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Investor>
 */
class InvestorFactory extends Factory
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
                'role' => 'investor'
            ]),
            'credit_card' => $this->faker->creditCardNumber,
            'bank_account' => $this->faker->bankAccountNumber,
            'balance' => $this->faker->randomFloat(2, 0, 100000),
        ];
    }

}
