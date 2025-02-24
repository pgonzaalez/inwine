<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seller extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'NIF',
        'name',
        'email',
        'password',
        'address',
        'phone',
        'credit_card',
        'bank_account',
        'balance',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
