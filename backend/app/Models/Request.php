<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Request extends Model
{
    
    use HasFactory;

    protected $fillable = [
        'investor_id',
        'request_restaurant_id',
    ];

    public function investor()
    {
        return $this->belongsTo(Investor::class);
    }

    public function requestRestaurant()
    {
        return $this->belongsTo(RequestRestaurant::class);
    }
}
