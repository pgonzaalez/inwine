<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RequestRestaurant extends Model
{

    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'price_restaurant',
        'restaurant_earnings', // Ganancias del restaurante
        'platform_earnings', // Ganancias de la plataforma
        'investor_earnings', // Ganancias del inversor
        'status'
    ];

    protected static function booted()
    {
        static::saving(function ($requestRestaurant) {
            $product = $requestRestaurant->product;

            // Precio base del restaurante menos la comisión de la plataforma (5%)
            $price_after_platform_commission = $requestRestaurant->price_restaurant - round($requestRestaurant->price_restaurant * 0.05, 2);

            // Beneficio del restaurante después de pagar al inversor
            $profit_restaurant = $price_after_platform_commission - $product->price_demanded_with_commission;

            // Ganancia del restaurante (70% del beneficio restante)
            $requestRestaurant->restaurant_earnings = round($profit_restaurant * 0.7, 2);

            // Ganancia de la plataforma (5% del precio del restaurante)
            $requestRestaurant->platform_earnings = round($requestRestaurant->price_restaurant * 0.05, 2);

            // Ganancia del inversor (55 + 30% del beneficio restante)
            $investor_base = $product->price_demanded_with_commission; // Precio que recibe el inversor inicialmente
            $investor_profit = round($profit_restaurant * 0.3, 2); // 30% del beneficio restante
            $requestRestaurant->investor_earnings = $investor_base + $investor_profit;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
