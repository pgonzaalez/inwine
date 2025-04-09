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
        'total_price'
    ];

    public function investor()
    {
        return $this->belongsTo(User::class);
    }

    public function requestRestaurant()
    {
        return $this->belongsTo(RequestRestaurant::class);
    }
}
