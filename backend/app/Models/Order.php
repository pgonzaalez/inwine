<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Order extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'request_restaurant_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function requestRestaurant()
    {
        return $this->belongsTo(RequestRestaurant::class);
    }
}
