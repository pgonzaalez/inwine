<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Commission extends Model
{
    use HasFactory;

    protected $fillable = [
        'percentage_to_seller',
        'percentage_to_restaurant',
        'percentage_to_investor',
        'percentage_to_delivery',
    ];
    protected $casts = [
        'percentage_to_seller' => 'decimal:2',
        'percentage_to_restaurant' => 'decimal:2',
        'percentage_to_investor' => 'decimal:2',
    ];


}
