<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Investor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'credit_card',
        'bank_account',
        'balance',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class);

    }

}
