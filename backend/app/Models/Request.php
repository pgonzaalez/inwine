<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'restaurant_id',
        'inversor_id',
        'product_id',
        'quantity',
        'status',
    ];

    public function restaurant()
    {
        return $this->belongsTo(User::class);
    }
    
    public function inversor()
    {
        return $this->belongsTo(User::class);
    }
  
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

  
}
