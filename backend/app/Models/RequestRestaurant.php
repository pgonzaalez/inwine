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
        'price_restaurant',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->where('role', 'restaurant');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
