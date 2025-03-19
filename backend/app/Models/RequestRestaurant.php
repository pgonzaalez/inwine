<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestRestaurant extends Model
{

    use HasFactory;

    protected $fillable = [
        'restaurant_id',
        'product_id',
        'price_restaurant',
        'status'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}
