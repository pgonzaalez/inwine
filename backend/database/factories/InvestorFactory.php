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
        $phone = '6' . $this->faker->numberBetween(10000000, 99999999);

        return [
            'user_id' => User::factory(),
            'address' => $this->faker->address,
            'phone_contact' => $phone,
            'credit_card' => $this->faker->creditCardNumber,
            'bank_account' => $this->faker->bankAccountNumber,
            'balance' => $this->faker->randomFloat(2, 0, 100000),
        ];
    }

}
