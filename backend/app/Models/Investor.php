<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investor extends Model
{
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

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class);

    }



}
