<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Product extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        "name",
        "origin",
        "year",
        "wine_type_id",
        "description",
        "price_demanded",
        "price_demanded_with_commission",
        "quantity",
        "image",
        'status',
        "user_id",
    ];

    protected static function booted()
    {
        static::saving(function ($product) {
            $product->price_demanded_with_commission = $product->calculatePriceWithCommission();
        });
    }

    public function wineType()
    {
        return $this->belongsTo(WineType::class, 'wine_type_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasMany(ProductImage::class)->where('is_primary', true)->first();
    }

    public function requestsRestaurant()
    {
        return $this->hasMany(RequestRestaurant::class);
    }

    public function calculatePriceWithCommission(): float
    {
        $commission = Commission::where('name', 'Comissió pel producte')->first();

        if (!$commission) return $this->price_demanded;

        return round($this->price_demanded * (1 + $commission->percentage / 100), 2);
    }
}
