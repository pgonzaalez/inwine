<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderRequested extends Model
{

    use HasFactory;

    protected $fillable = [
        'user_id',
        'request_restaurant_id',
        'status',
        'total_price',
        'investor_earnings',
    ];

    public function investor()
    {
        return $this->belongsTo(User::class);
    }

    public function requestRestaurant()
    {
        return $this->belongsTo(RequestRestaurant::class);
    }
    
    public function getPlatformEarningsAttribute()
    {
        $productPlatformEarnings = $this->requestRestaurant->product->commission_platform ?? 0;
        $requestRestaurantPlatformEarnings = $this->requestRestaurant->platform_earnings ?? 0;

        return $productPlatformEarnings + $requestRestaurantPlatformEarnings;
    }

    public function getInvestorEarningsAttribute()
    {
        return $this->requestRestaurant->investor_earnings ?? 0;
    }
}
