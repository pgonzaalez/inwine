<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Restaurant extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'address',
        'phone_contact',
        'name_contact',
        'credit_card',
        'balance',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
