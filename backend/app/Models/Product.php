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
        "quantity",
        "image",
        "user_id",
    ];

    public function wineType()
    {
        return $this->belongsTo(WineType::class, 'wine_type_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
