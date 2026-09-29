<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seller extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'address',
        'phone_contact',
        'name_contact',
        'bank_account',
        'balance',
    ];

    protected function casts(): array
    {
        return [
            'bank_account' => 'encrypted',
            'phone_contact' => 'encrypted',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
