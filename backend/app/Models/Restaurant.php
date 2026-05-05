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
        "business_name",
        "image",
        "province",
        "description",
        "number_of_diners",
        "wine_rotation",
        "reference_number",
        "shifts",
    ];

    protected function casts(): array
    {
        return [
            'credit_card' => 'encrypted',
            'phone_contact' => 'encrypted',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
