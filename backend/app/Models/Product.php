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
        "description",
        "price_demand",
        "quantity",
        "category_id",
        "seller_id",
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class, "seller_id");
    }

}
