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
        'price_restaurant_with_commission',
        'status'
    ];

    protected static function booted()
    {
        static::saving(function ($requestRestaurant) {
            $requestRestaurant->price_restaurant_with_commission = $requestRestaurant->calculatePriceWithCommission();
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

    public function calculatePriceWithCommission(): float
    {
        $commission = Commission::where('name', 'Comissió pel restaurant')->first();

        if (!$commission) return $this->price_restaurant;

        return round($this->price_restaurant * (1 + $commission->percentage / 100), 2);
    }
}
